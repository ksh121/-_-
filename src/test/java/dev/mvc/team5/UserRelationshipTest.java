package dev.mvc.team5;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import dev.mvc.team5.activitylog.ActivityLog;
import dev.mvc.team5.activitylog.ActivityLogRepository;
import dev.mvc.team5.block.Block;
import dev.mvc.team5.block.BlockRepository;
import dev.mvc.team5.loginlog.LoginLog;
import dev.mvc.team5.loginlog.LoginLogRepository;
import dev.mvc.team5.notification.Notification;
import dev.mvc.team5.notification.NotificationRepository;
import dev.mvc.team5.report.Report;
import dev.mvc.team5.report.ReportRepository;
import dev.mvc.team5.school.School;
import dev.mvc.team5.school.SchoolRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;

@SpringBootTest
@Transactional
public class UserRelationshipTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private LoginLogRepository loginLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private BlockRepository blockRepository;

    @Autowired
    private ReportRepository reportRepository;

    private User user1;
    private User user2;

    @BeforeEach
    public void setup() {
        // 학교 생성
        School school = new School();
        school.setSchoolname("Test School");
        schoolRepository.save(school);

        // 사용자 생성
        user1 = new User("user1", "pass1", "User One", school);
        userRepository.save(user1);

        user2 = new User("user2", "pass2", "User Two", school);
        userRepository.save(user2);
    }

    @Test
    public void testActivityLog() {
        ActivityLog log = new ActivityLog();
        log.setUser(user1);
        log.setAction("LOGIN");
        log.setDetail("User logged in successfully.");
        log.setCreatedAt(LocalDateTime.now());
        activityLogRepository.save(log);

        System.out.println("ActivityLog saved: " + log);
    }

    @Test
    public void testLoginLog() {
        LoginLog log = new LoginLog();
        log.setUser(user1);
        log.setLoginTime(LocalDateTime.now());
        log.setIpAddress("127.0.0.1");
        loginLogRepository.save(log);

        System.out.println("LoginLog saved: " + log);
    }

    @Test
    public void testNotification() {
        Notification notification = new Notification();
        notification.setUser(user1);
        notification.setMessage("Welcome to the system!");
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        System.out.println("Notification saved: " + notification);
    }

    @Test
    public void testBlock() {
        Block block = new Block();
        block.setBlocker(user1);
        block.setBlocked(user2);
        block.setCreatedAt(LocalDateTime.now());
        blockRepository.save(block);

        System.out.println("Block saved: " + block);
    }

    @Test
    public void testReport() {
        Report report = new Report();
        report.setReporter(user1);
        report.setReported(user2);
        report.setReason("Inappropriate behavior");
        report.setCreatedAt(LocalDateTime.now());
        reportRepository.save(report);

        System.out.println("Report saved: " + report);
    }

}
