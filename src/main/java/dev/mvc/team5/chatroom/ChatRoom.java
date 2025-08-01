package dev.mvc.team5.chatroom;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import dev.mvc.team5.chatroommember.ChatRoomMember;
import dev.mvc.team5.message.Message;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chatRoom_seq")
    @SequenceGenerator(name = "chatRoom_seq", sequenceName = "CHATROOM_SEQ", allocationSize = 1)
    private Long chatRoomno;

    private String roomName;
    
    // 공개방 여부
    @Column(nullable = false)
    private boolean publicRoom = false;
    
    // 비밀번호 (nullable)
    private String password;
    
    // 방 만든 사람
    @ManyToOne
    @JoinColumn(name = "creator_id")
    private dev.mvc.team5.user.User creator;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiverno")
    private User receiverno;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // === 연관 관계 ===
    @ManyToOne
    @JoinColumn(name = "talentno")
    private Talent talent; // 채팅방이 어떤 게시물과 관련돼 있는지
    
    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatRoomMember> chatRoomMembers = new ArrayList<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages = new ArrayList<>();

    // === 생성자, getter, setter ===
}