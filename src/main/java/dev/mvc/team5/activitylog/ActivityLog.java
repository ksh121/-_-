package dev.mvc.team5.activitylog;


import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "activity_logs")
@Data
public class ActivityLog {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="actlog_seq")
    @SequenceGenerator(name="actlog_seq", sequenceName="ACTLOG_SEQ", allocationSize=1)
    private Long actlogno;

//    @Column(nullable = false)
//    private Long userno;
    
    //양방향 ㅋㅋ 
    @ManyToOne
    @JsonIgnore  // 이거안하면 무한으로 참조
    @JoinColumn(name = "userno")
    private User user;

    @Column(length = 100)
    private String action;

    @Lob
    private String detail;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    
     
}