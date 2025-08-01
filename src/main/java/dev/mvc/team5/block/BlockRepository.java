package dev.mvc.team5.block;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BlockRepository extends JpaRepository<Block, Long> {
  // 중복차단 방지  (이미했는지 안했는지)
  boolean existsByBlocker_UsernoAndBlocked_Userno(Long blocker, Long blocked);
  // 사용자가 차단한 사람 목록 보기
  List<Block> findByBlockerUserno(Long blockerUserno);
  void deleteByBlockerUsernoAndBlockedUserno(Long blockerUserno, Long blockedUserno);
  // 이미 활성 차단이 있는지 
  boolean existsByBlocked_UsernoAndActiveTrue(Long targetUserno);
  /* 사용자가 차단한 목록 */
  List<Block> findByBlocker_Userno(Long blockerUserno);
  
  
}
