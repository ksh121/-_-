package dev.mvc.team5.chatroommember;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.user.User;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {
    List<ChatRoomMember> findByChatRoomChatRoomno(Long chatRoomno);
    
    List<ChatRoomMember> findByUserUserno(Long userno);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM ChatRoomMember m WHERE m.chatRoom = :chatRoom")
    void deleteByChatRoom(@Param("chatRoom") ChatRoom chatRoom);
    
    // ChatRoomMemberRepository.java
    boolean existsByChatRoomAndUser(ChatRoom chatRoom, User user);
    
    Optional<ChatRoomMember> findFirstByChatRoomAndUser(ChatRoom chatRoom, User user);
    
   
}