package dev.mvc.team5.activitylog;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ActivityLogDTO {
    private Long actlogno;
    private Long userno;   // 엔티티는 User, DTO는 ID만
    private String action;
    private String detail;
    private LocalDateTime createdAt;
}