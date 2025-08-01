package dev.mvc.team5.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService service;

    /* 목록: /reports?status=OPEN&page=0&size=10 */
    @GetMapping
    public Page<ReportDTO> list(
            @RequestParam(name="status",required = false) String status,
            @RequestParam(name="page",defaultValue = "0") int page,
            @RequestParam(name="size",defaultValue = "10") int size) {
        return service.findAll(status, PageRequest.of(page, size, Sort.by("reportno").descending()));
    }
    /* 단건 */
    @GetMapping("/{id}")
    public ReportDTO one(@PathVariable(name="id") Long id) {
        return service.findAll(null, Pageable.unpaged())   // 재활용
                 .stream().filter(r -> r.getReportno().equals(id))
                 .findFirst().orElseThrow();
    }
    @PostMapping
    public ResponseEntity<ReportDTO> create(@RequestBody ReportDTO dto) {
        try {
            ReportDTO saved = toDTO(service.save(dto));        // 정상 저장
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (IllegalStateException e) {                    // 중복 신고
            return ResponseEntity.status(HttpStatus.CONFLICT)  // 409
                                 .body(null);                  // 또는 e.getMessage()
        }
    }
    /* 상태 변경 */
    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable(name="id") Long id, @RequestBody String status) {
        service.updateStatus(id, status);
    }
    //신고 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name="id")  Long id) {
        service.delete(id);
    }
    
    private ReportDTO toDTO(Report report) {
        ReportDTO dto = new ReportDTO();
        dto.setReportno(report.getReportno());
        dto.setReporter(report.getReporter().getUserno());
        dto.setReported(report.getReported().getUserno());
        dto.setReason(report.getReason());
        dto.setReportType(report.getReportType());
        dto.setTargetId(report.getTargetId());
        dto.setCreatedAt(report.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        dto.setStatus(report.getStatus());
        return dto;
    }
}
