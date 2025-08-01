package dev.mvc.team5.notification;

import lombok.Data;


@Data
public class NotificationDTO {
    private Long notificationno;

    private Long userno;
    private String type;
    private String message;
    private Boolean read;
    private String createdAt;
 // 알림이 가리키는 대상 엔티티의 ID
    private Long targetId;
 
    private String title;

}
