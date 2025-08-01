package dev.mvc.team5.chatroom;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import dev.mvc.team5.chatroommember.ChatRoomMember;
import dev.mvc.team5.user.User;
import jakarta.transaction.Transactional;

/**
 * ChatRoom 관련 DB 접근을 처리하는 Repository 인터페이스
 */
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

  /**
   * 특정 게시글(talent)에 대해 sender, receiver가 참여한 1:1 채팅방 조회
   * (양쪽 모두 해당 채팅방에 있어야 함)
   *
   * @param senderId 보낸 사람의 사용자 번호
   * @param receiverId 받은 사람의 사용자 번호
   * @param talentId 게시물 번호
   * @return 존재하는 채팅방이 있다면 Optional로 반환
   */
  @Query("""
      SELECT cr FROM ChatRoom cr
      JOIN ChatRoomMember m1 ON m1.chatRoom = cr
      JOIN ChatRoomMember m2 ON m2.chatRoom = cr
      WHERE m1.user.userno = :senderId
        AND m2.user.userno = :receiverId
        AND cr.talent.talentno = :talentId
  """)
  Optional<ChatRoom> findPrivateRoomByMembersAndTalent(
      @Param("senderId") Long senderId,
      @Param("receiverId") Long receiverId,
      @Param("talentId") Long talentId
  );

  /**
   * 해당 채팅방의 모든 멤버 삭제 (채팅방 삭제 전 사용)
   *
   * @param chatRoom 삭제할 채팅방
   */
  @Transactional
  @Modifying
  @Query("DELETE FROM ChatRoomMember m WHERE m.chatRoom = :chatRoom")
  void deleteByChatRoom(@Param("chatRoom") ChatRoom chatRoom);

  /**
   * 공개 채팅방 전체 조회 (생성일 기준 내림차순)
   * @return 공개방 리스트
   */
  List<ChatRoom> findByPublicRoomTrueOrderByCreatedAtDesc();

}
