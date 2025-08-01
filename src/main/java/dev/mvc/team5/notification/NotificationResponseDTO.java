package dev.mvc.team5.notification;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {
    private Integer notificationno;
    private Long userno;
    private String username;
    private String type;
    private String message;
    private Boolean read;
    private LocalDateTime createdAt;
    private String title;
}
