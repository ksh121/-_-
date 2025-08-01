package dev.mvc.team5.activitylog;

import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserDTO;
import dev.mvc.team5.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ 모든 활동 로그 가져오기 (DTO 변환)
     */
    public List<ActivityLogDTO> getAll() {
        return activityLogRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * ✅ 특정 사용자(userno)의 모든 활동 로그 가져오기 (DTO 변환)
     */
    public List<ActivityLogDTO> getByUser(Long userno) {
        return activityLogRepository.findByUser_Userno(userno)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * ✅ 특정 액션 키워드로 활동 로그 가져오기 (DTO 변환)
     */
    public List<ActivityLogDTO> getByAction(String action) {
        return activityLogRepository.findByAction(action)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * ✅ 기간으로 활동 로그 가져오기 (DTO 변환)
     * @param start 시작 시간 (ISO_DATE_TIME 형식)
     * @param end 끝 시간 (ISO_DATE_TIME 형식)
     */
    public List<ActivityLogDTO> getByPeriod(String start, String end) {
        LocalDateTime startTime = LocalDateTime.parse(start, DateTimeFormatter.ISO_DATE_TIME);
        LocalDateTime endTime = LocalDateTime.parse(end, DateTimeFormatter.ISO_DATE_TIME);
        return activityLogRepository.findByCreatedAtBetween(startTime, endTime)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * ✅ 관리자용: 모든 활동 로그를 페이징 처리하여 조회 (DTO 변환 포함)
     * @param action 필터링할 액션 타입 (null 또는 "ALL"이면 전체)
     * @param pageable 페이징 정보 (페이지 번호, 크기, 정렬 등)
     * @return 페이징 처리된 ActivityLogDTO 목록
     */
    public Page<ActivityLogDTO> getAllActivityLogsPaged(String action, Pageable pageable) {
        Page<ActivityLog> activityLogPage;
        
        // ✅ action 파라미터에 따라 다른 Repository 메서드 호출
        if (action != null && !action.equalsIgnoreCase("ALL")) {
            activityLogPage = activityLogRepository.findByActionOrderByCreatedAtDesc(action, pageable);
        } else {
            activityLogPage = activityLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        
        return activityLogPage.map(this::toDTO);
    }

    /**
     * ✅ 전체 최신 로그 N개 가져오기 (엔티티 그대로)
     */
    public List<ActivityLog> findLatest(int limit) {
        return activityLogRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, limit))
                .getContent();
    }

    /**
     * ✅ 특정 사용자(userno)의 최신 로그 N개 가져오기 (엔티티 그대로)
     */
    public List<ActivityLog> findLatestByUser(Long userno, int limit) {
        return activityLogRepository
                .findByUserUsernoOrderByCreatedAtDesc(userno, PageRequest.of(0, limit))
                .getContent();
    }

    /**
     * ✅ 새로운 활동 로그 저장 (DTO -> 엔티티)
     */
    public ActivityLog save(ActivityLogDTO dto) {
        ActivityLog entity = new ActivityLog();
        User user = userRepository.findById(dto.getUserno()).orElseThrow();
        entity.setUser(user);
        entity.setAction(dto.getAction());
        entity.setDetail(dto.getDetail());
        entity.setCreatedAt(LocalDateTime.now());
        return activityLogRepository.save(entity);
    }

    /**
     * ✅ 활동 로그 삭제 (PK 기준)
     */
    public void deleteById(Long id) {
        activityLogRepository.deleteById(id);
    }

    /**
     * ✅ 엔티티 → DTO 변환 헬퍼
     */
    private ActivityLogDTO toDTO(ActivityLog log) {
        ActivityLogDTO dto = new ActivityLogDTO();
        dto.setActlogno(log.getActlogno());
        dto.setUserno(log.getUser().getUserno());
        dto.setAction(log.getAction());
        dto.setDetail(log.getDetail());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }
    // 로그인 로그
    public void logLogin(Long userno, String ip) {
      User user = userRepository.findById(userno).orElseThrow();
      ActivityLog log = new ActivityLog();
      log.setUser(user);
      log.setAction("LOGIN");
      log.setDetail("{\"ip\":\"" + ip + "\"}");
      log.setCreatedAt(LocalDateTime.now());
      activityLogRepository.save(log);
  }
    // 로그아웃 로그
    public void logLogout(Long userno, String ip) {
      User user = userRepository.findById(userno).orElseThrow();
      ActivityLog log = new ActivityLog();
      log.setUser(user);
      log.setAction("LOGOUT");
      log.setDetail("{\"ip\":\"" + ip + "\"}");
      log.setCreatedAt(LocalDateTime.now());
      activityLogRepository.save(log);
  }
    /**
     * ✅ 신고 활동 로그 기록  
     * @param reporterUserno 신고를 한 사용자 번호
     * @param reportedTargetId 신고 대상의 ID (예: 게시물 ID, 댓글 ID, 사용자 ID 등)
     * @param reportedTargetType 신고 대상의 타입 (예: "POST", "COMMENT", "USER" 등)
     * @param reason 신고 사유
     * 이거 그대로 리포트서비스에서 사용하면됨
     */
    public void logReport(Long reporterUserno, Integer reportedTargetId, String reportedTargetType, String reason) {
        User reporter = userRepository.findById(reporterUserno)
                .orElseThrow(() -> new IllegalArgumentException("Reporter user not found for userno: " + reporterUserno));
        
        ActivityLog log = new ActivityLog();
        log.setUser(reporter); // 신고를 한 사용자를 로그에 기록
        log.setAction("REPORT"); // 액션 타입은 "REPORT"로 설정

        // detail 필드에 신고와 관련된 상세 정보 JSON 형태로 저장
        String detailJson = String.format("{\"reportedTargetId\":%d, \"reportedTargetType\":\"%s\", \"reason\":\"%s\"}",
                                        reportedTargetId, reportedTargetType, escapeJson(reason));
        log.setDetail(detailJson);
        
        log.setCreatedAt(LocalDateTime.now());
        activityLogRepository.save(log);
    }

    // JSON 문자열 내 특수 문자 이스케이프를 위한 헬퍼 메서드 (선택 사항이나 권장)
    private String escapeJson(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "\\r");
    }
}

