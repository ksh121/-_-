package dev.mvc.team5.activitylog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import net.bytebuddy.implementation.bytecode.constant.DefaultValue;

import java.util.List;

@RestController
@RequestMapping("/activityLog")
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    /**
     *모든 활동 로그 조회 (DTO 리스트 반환)
     * GET /activityLog/all
     */
    @GetMapping("/all")
    public List<ActivityLogDTO> getAll() {
        return activityLogService.getAll();
    }

    /**
     * 특정 사용자 활동 로그 조회
     * GET /activityLog/user/{userno}
     */
    @GetMapping("/user/{userno}")
    public List<ActivityLogDTO> getByUser(@PathVariable(name="userno") Long userno) {
        return activityLogService.getByUser(userno);
    }

    /**
     * 특정 액션의 활동 로그 조회
     * GET /activityLog/action/{action}
     */
    @GetMapping("/action/{action}")
    public List<ActivityLogDTO> getByAction(@PathVariable(name="action") String action) {
        return activityLogService.getByAction(action);
    }

    /**
     * 기간별 활동 로그 조회 (쿼리 파라미터로 기간 전달)
     * GET /activityLog/period?start=2024-06-01T00:00:00&end=2024-06-30T23:59:59
     */
    @GetMapping("/period")
    public List<ActivityLogDTO> getByPeriod(
            @RequestParam(name="start", defaultValue ="") String start,
            @RequestParam(name="end", defaultValue ="")  String end) {
        return activityLogService.getByPeriod(start, end);
    }

    /**
     * 전체 최신 로그 N개 조회
     * GET /activityLog/latest?limit=10
     */
    @GetMapping("/latest")
    public List<ActivityLog> getLatest(@RequestParam(name="limit",defaultValue = "10") int limit) {
        return activityLogService.findLatest(limit);
    }

    /**
     * ✅ 관리자용: 모든 활동 로그를 페이징 처리하여 조회
     * GET /activityLog/admin/all?page=0&size=10&sort=createdAt,desc&action=LOGIN
     * @param action 필터링할 액션 타입 (선택 사항)
     * @param pageable 페이징 정보 (페이지 번호, 크기, 정렬 등)
     * @return 페이징 처리된 ActivityLogDTO 목록
     */
    @GetMapping("/admin/all")
    public Page<ActivityLogDTO> getAllActivityLogsForAdmin(
            @RequestParam(name = "action", required = false) String action, //파라미터 null허용
            @PageableDefault(size = 10, sort = {"createdAt"}) Pageable pageable) {
        return activityLogService.getAllActivityLogsPaged(action, pageable);
    }
    
    /**
     * 특정 사용자 최신 로그 N개 조회
     * GET /activityLog/user/{userno}/latest?limit=10
     */
    @GetMapping("/user/{userno}/latest")
    public List<ActivityLog> getLatestByUser(
            @PathVariable(name="userno") Long userno,
            @RequestParam(name="limit", defaultValue = "10") int limit) {
        return activityLogService.findLatestByUser(userno, limit);
    }

    /**
     * 새로운 활동 로그 등록
     * POST /activityLog
     * Body: { userno, action, detail }
     */
    @PostMapping("")
    public ActivityLog save(@RequestBody ActivityLogDTO dto) {
        return activityLogService.save(dto);
    }

    /**
     * 활동 로그 삭제 (PK 기준)
     * DELETE /activityLog/{id}
     */
    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable(name="id") Long id) {
     
        activityLogService.deleteById(id);
    }
}