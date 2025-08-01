package dev.mvc.team5.message;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

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
@Table(name = "message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "message_seq")
    @SequenceGenerator(name = "message_seq", sequenceName = "MESSAGES_SEQ", allocationSize = 1)   
    private Long messageno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatRoomno")
    @JsonIgnore
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userno")
    private User sender;

    private String content;
    
    @Column(name = "type")
    private String type; // "SYSTEM" or "CHAT"

    @CreationTimestamp
    @Column(name="sent_at")
    private LocalDateTime sentAt;

}