package dev.mvc.team5.notification;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping
    public List<NotificationDTO> getAll() {
      return service.findAll().stream().map(service::toDTO).collect(Collectors.toList());
    }
    
    @PostMapping
    public NotificationDTO create(@RequestBody NotificationDTO dto) {
      return service.toDTO(service.save(dto));
    }
    // 사용자는 본인의 안읽은 알림만 볼수잇음 
    @GetMapping("/user/{userno}")
    public List<NotificationDTO> getByUser(
        @PathVariable(name="userno") Long userno,
        @PageableDefault(size = 3, sort ={"createdAt", "notificationno"}) Pageable pageable) {
      return service.findUnreadByUserPaged(userno, pageable)
          .stream()
          .map(service::toDTO) // service.toDTO
          .collect(Collectors.toList());
    }
    // 사용자가 알림을 클릭하면 read = true로 업데이트
    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable(name="id") Long id) {
        service.markAsRead(id);
    }
    // 프론트 상단 미확인알림 숫자 표시용
    @GetMapping("/user/{userno}/unreadCount")
    public Long getUnreadCount(@PathVariable(name="userno") Long userno) {
        return service.countUnread(userno);
    }
    // 사용자 알림 모두읽음
    @PutMapping("/user/{userno}/readAll")
    public void markAllAsRead(@PathVariable(name="userno") Long userno) {
        service.markAllAsRead(userno);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable(name="id") Long id) {
        service.delete(id);
    }

//    private NotificationDTO toDTO(Notification n) {
//      NotificationDTO dto = new NotificationDTO();
//      dto.setNotificationno(n.getNotificationno());
//      dto.setUserno(n.getUser().getUserno());
//      dto.setType(n.getType());
//      dto.setMessage(n.getMessage());
//      dto.setRead(n.getRead());
//      dto.setCreatedAt(n.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
//      return dto;
//
//  }
}
