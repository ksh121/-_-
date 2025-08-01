package dev.mvc.team5.activitylog;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.mvc.team5.user.User;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
  List<ActivityLog> findByUser_Userno(Long userno);

  //최신순으로 페이지네이션 (Pageable로 개수 제한)
  Page<ActivityLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
  
//✅ 특정 action으로 필터링하고 최신순으로 페이징 처리하여 조회
  Page<ActivityLog> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);
  
  //특정 유저의 로그를 최신순으로 페이지네이션
  Page<ActivityLog> findByUserUsernoOrderByCreatedAtDesc(Long userno, Pageable pageable);
  
  List<ActivityLog> findByAction(String action);

  List<ActivityLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
