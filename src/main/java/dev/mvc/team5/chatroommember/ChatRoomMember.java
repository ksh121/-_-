package dev.mvc.team5.chatroommember;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "chat_room_member")
public class ChatRoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chatRoomMember_seq")
    @SequenceGenerator(name = "chatRoomMember_seq", sequenceName = "CHATROOMMENBER_SEQ", allocationSize = 1)  
    private Long chatRoomMemberno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatRoomno")
    @JsonIgnore
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userno")
    @JsonIgnore
    private User user;

    @CreationTimestamp
    @Column(name="joined_at")
    private LocalDateTime joinedAt;


}