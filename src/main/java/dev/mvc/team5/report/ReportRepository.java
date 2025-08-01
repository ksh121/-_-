package dev.mvc.team5.report;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.mvc.team5.tool.ReportStatus;
import dev.mvc.team5.user.User;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

  int countByTargetId(Long targetId);
  
  Page<Report> findByStatus(String status, Pageable pageable);

  int countByReportedAndStatus(User reported, String status);   // 자동차단용

  boolean existsByReporter_UsernoAndReportTypeAndTargetIdAndStatus(Long reporter, String reportType, Integer targetId,
      String string);
}
