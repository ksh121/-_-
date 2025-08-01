package dev.mvc.team5.message;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import dev.mvc.team5.chatroom.ChatRoom;
import jakarta.transaction.Transactional;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByChatRoomChatRoomno(Long chatRoomno);
    List<Message> findByChatRoom_ChatRoomnoOrderBySentAtAsc(Long chatRoomno);
    
    @Query("SELECT m FROM Message m LEFT JOIN FETCH m.sender WHERE m.chatRoom.chatRoomno = :chatRoomno ORDER BY m.sentAt ASC")
    List<Message> findByChatRoomWithSender(@Param("chatRoomno") Long chatRoomno);


    // chatRoomno 기준 최근 1건
    Message findTopByChatRoom_ChatRoomnoOrderBySentAtDesc(Long chatRoomno);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM Message m WHERE m.chatRoom = :chatRoom")
    void deleteByChatRoom(@Param("chatRoom") ChatRoom chatRoom);

}