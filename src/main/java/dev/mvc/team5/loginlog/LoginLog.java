package dev.mvc.team5.loginlog;

import java.time.LocalDateTime;

import dev.mvc.team5.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "login_logs")
@Data
public class LoginLog {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="login_seq")
    @SequenceGenerator(name="login_seq", sequenceName="LOGIN_SEQ", allocationSize=1)
    private Long loginno;

    @ManyToOne
    @JoinColumn(name = "userno")
    private User user; 
    
    private LocalDateTime loginTime;
    
    private String IpAddress;
    //log.setLoginTime(LocalDateTime.now());
   // log.setIpAddress("127.0.0.1");
}