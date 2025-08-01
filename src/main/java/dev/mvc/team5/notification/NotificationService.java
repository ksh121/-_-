package dev.mvc.team5.notification;


import dev.mvc.team5.sse.SseService;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private  SseService sseService; 

    public List<Notification> findAll() {
        return repo.findAll();
    }

    public Optional<Notification> findById(Long id) {
        return repo.findById(id);
    }

    // 사용자 본인 알림 조회 (DB에서 직접 조회)
    public List<Notification> findByUser(Long userno) {
        return repo.findByUserUsernoOrderByCreatedAtDesc(userno);
    }

    // 사용자가 알림 클릭 시 read=true 업데이트
    public void markAsRead(Long id) {
        Notification n = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 알림이 없습니다. id=" + id));
        n.setRead(true);
        repo.save(n);
    }

    // 미확인 알림 개수 조회
    public Long countUnread(Long userno) {
        return repo.countByUserUsernoAndReadFalse(userno);
    }
    // 알림 모두읽음
    public void markAllAsRead(Long userno) {
      List<Notification> notifications = repo.findByUserUsernoOrderByCreatedAtDesc(userno);
      notifications.forEach(n -> n.setRead(true));
      repo.saveAll(notifications);
  }

    // 알림 저장
    public Notification save(NotificationDTO dto) {
        Notification n = new Notification();
        User user = userRepo.findById(dto.getUserno())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. userno=" + dto.getUserno()));
        n.setUser(user);
        n.setType(dto.getType());
        n.setMessage(dto.getMessage());
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        n.setTargetId(dto.getTargetId());
        // 2) DB 저장
        Notification saved = repo.save(n);

        // 3) DTO 변환 후 SSE 전송
        sseService.send(user.getUserno(), toDTO(saved));
        System.out.println(">>> targetId from DTO: " + dto.getTargetId());
        System.out.println(">>> targetId set to Entity: " + n.getTargetId());
        return saved;
    }
    //알림 헬퍼  다른 곳에서 이거쓰면돼
    @Transactional
    public Notification createNotification(Long userno,
                                           String type,
                                           String message,
                                           Long targetId) {

        // 1) DTO 생성 (재활용 가능)
        NotificationDTO dto = new NotificationDTO();
        dto.setUserno(userno);       // 알림 받을 사용자
        dto.setType(type);           // 예: "chat", "info", "reservation" …
        dto.setMessage(message);     // 알림 내용
        dto.setTargetId(targetId); 

        // 2) 기존 save(dto) 메서드 재사용 → DB 저장 & 엔티티 반환
        return save(dto);
    }

    // 알림 삭제
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("삭제할 알림이 없습니다. id=" + id);
        }
        repo.deleteById(id);
    }

    public Page<Notification> findByUserPaged(Long userno, Pageable pageable) {
      return repo.findByUserUserno(userno, pageable);
  }
    
    public Page<Notification> findUnreadByUserPaged(Long userno, Pageable pageable) {
      return repo.findByUser_UsernoAndReadFalseOrderByCreatedAtDesc(userno, pageable);
  }
    
    public NotificationDTO toDTO(Notification n) {
      NotificationDTO dto = new NotificationDTO();
      dto.setNotificationno(n.getNotificationno());
      dto.setUserno(n.getUser().getUserno());
      dto.setType(n.getType());
      dto.setMessage(n.getMessage());
      dto.setRead(n.getRead());
      dto.setCreatedAt(n.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
      dto.setTargetId(n.getTargetId()); // ⭐ 추가: 엔티티의 targetId를 DTO에 설정 ⭐
      return dto;

  }
}