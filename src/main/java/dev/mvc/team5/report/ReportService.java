package dev.mvc.team5.report;

import dev.mvc.team5.activitylog.ActivityLogService;
import dev.mvc.team5.block.Block;
import dev.mvc.team5.block.BlockRepository;
import dev.mvc.team5.block.BlockService;
import dev.mvc.team5.tool.ReportStatus;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository repo;

    @Autowired
    private BlockRepository blockRepo;
    
    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private  BlockService blockSvc;
    
    @Autowired
    private ActivityLogService activityLogSvc;
    
    public List<Report> findAll() {
        return repo.findAll();
    }

    public Optional<Report> findById(Long id) {
        return repo.findById(id);
    }
     // 신고 중복확인후 저장
    public Report save(ReportDTO dto) {
        boolean dup = repo.existsByReporter_UsernoAndReportTypeAndTargetIdAndStatus(
          dto.getReporter(), dto.getReportType(), dto.getTargetId(), "OPEN");

      if (dup) throw new IllegalStateException("이미 신고한 대상입니다.");
        Report report = new Report();

        User reporter = userRepo.findById(dto.getReporter()).orElseThrow();
        User reported = userRepo.findById(dto.getReported()).orElseThrow();

        report.setReporter(reporter);
        report.setReported(reported);
        report.setReason(dto.getReason());
        report.setReportType(dto.getReportType());
        report.setTargetId(dto.getTargetId());
        report.setCreatedAt(LocalDateTime.now());
        report.setStatus(dto.getStatus() != null ? dto.getStatus() : "OPEN");
        
        //자동 차단 이거후 blockservice에서 글 안보이게도함
        Block block = new Block();
        block.setBlocker(reporter); // 신고자
        block.setBlocked(reported);   // 피신고자
        blockRepo.save(block);
        
        // ⭐ 4. 활동 로그 기록 ⭐
        // logReport(reporterUserno, reportedTargetId, reportedTargetType, reason)
        // dto.getReason()을 그대로 쓰면 따옴표나 줄바꿈 있을 시 JSON 깨질 수 있으니,
        // ActivityLogService의 logReport 메서드 안에서 escapeJson 헬퍼 메서드를 사용하도록 했습니다.
        // reportedTargetId는 Long 타입이므로 dto.getTargetId()를 그대로 사용하고,
        // reportedTargetType은 String이므로 dto.getReportType()을 그대로 사용합니다.
        try {
            activityLogSvc.logReport(
                dto.getReporter(),      // 신고를 한 사용자 userno
                dto.getTargetId(),      // 신고 대상 ID (예: 게시물, 댓글, 사용자 ID)
                dto.getReportType(),    // 신고 대상 타입 (예: "POST", "COMMENT", "USER" 등)
                dto.getReason()         // 신고 사유
            );
            System.out.println("활동 로그: 신고 이벤트가 성공적으로 기록되었습니다.");
        } catch (Exception e) {
            System.err.println("활동 로그 기록 중 오류 발생: " + e.getMessage());
            // 활동 로그 기록 실패가 핵심 기능(신고)에 영향을 주지 않도록 예외를 다시 던지지 않습니다.
        }
        
        return repo.save(report);
    }
//    /* 신고 중복 여부 */
//    public boolean existsDuplicate(ReportDTO dto) {
//        return repo.existsByReporter_UsernoAndReportTypeAndTargetIdAndStatus(
//                dto.getReporter(), dto.getReportType(), dto.getTargetId(), "OPEN");
//    }
    /* 목록 */
    public Page<ReportDTO> findAll(String status, Pageable pageable) {
        Page<Report> page = status == null
                ? repo.findAll(pageable)
                : repo.findByStatus(status, pageable);
        return page.map(this::toDTO);
    }
    
    /* 상태 변경 + 자동 차단 */
    private static final int AUTO_BLOCK = 3;   // 🚨 3건 이상 승인 시 자동 차단
    @Transactional
    public void updateStatus(Long id, String newStatus) {
        Report report = repo.findById(id).orElseThrow();
        report.setStatus(newStatus);

        // 승인된 경우 자동 차단 검사
        if (newStatus == ReportStatus.APPROVED) {
            int approvedCnt = repo.countByReportedAndStatus(report.getReported(), ReportStatus.APPROVED);
            if (approvedCnt >= AUTO_BLOCK) {
                blockSvc.blockUser(report.getReported().getUserno(),
                                   "신고 누적 " + approvedCnt + "회");
                
            }
                
        }
      
    }

    /* 삭제 */
    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }

    /* ------------------ Mapper ------------------ */
    private ReportDTO toDTO(Report r) {
        ReportDTO dto = new ReportDTO();
        dto.setReportno(r.getReportno());
        dto.setReporter(r.getReporter().getUserno());
        dto.setReported(r.getReported().getUserno());
        dto.setReason(r.getReason());
        dto.setReportType(r.getReportType());
        dto.setTargetId(r.getTargetId());
        dto.setCreatedAt(r.getCreatedAt().toString());
        dto.setStatus(r.getStatus());
        return dto;
    }
  }
