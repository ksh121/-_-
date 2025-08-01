package dev.mvc.team5.notification;

import java.time.LocalDateTime;

import dev.mvc.team5.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="notification_seq")
    @SequenceGenerator(name="notification_seq", sequenceName="NOTIFICATION_SEQ", allocationSize=1)
    private Long notificationno;

    @ManyToOne
    @JoinColumn(name = "userno")
    private User user;

    @Column(length = 50)
    private String type;

    @Lob
    private String message;

    private Boolean read;

    private LocalDateTime createdAt;
    @Column(name = "TARGET_ID")
    private Long targetId;
}