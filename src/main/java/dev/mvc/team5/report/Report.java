package dev.mvc.team5.report;

import java.time.LocalDateTime;

import dev.mvc.team5.tool.ReportStatus;
import dev.mvc.team5.tool.RequestStatus;
import dev.mvc.team5.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;


@Entity
@Table(name = "reports"
//    uniqueConstraints = @UniqueConstraint(
//        name = "uk_reporter_target_open",
//        columnNames = { "reporter", "reportType", "targetId", "status" }
//      )
)
@Data
public class Report {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="report_seq")
    @SequenceGenerator(name="report_seq", sequenceName="REPORT_SEQ", allocationSize=1)
    private Long reportno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter")
    private User reporter;  // 신고자

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported")
    private User reported;  // 신고당한 사용자

    @Lob
    @Column(nullable = false)
    private String reason;

    @Column(length = 50)
    private String reportType;

    private Integer targetId;

    private LocalDateTime createdAt;

    @Column(length = 20)
    private String status = ReportStatus.OPEN;
    
    
}