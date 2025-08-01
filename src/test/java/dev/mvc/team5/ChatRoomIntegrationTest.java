package dev.mvc.team5;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.chatroom.ChatRoomRepository;
import dev.mvc.team5.chatroommember.ChatRoomMember;
import dev.mvc.team5.chatroommember.ChatRoomMemberRepository;
import dev.mvc.team5.message.Message;
import dev.mvc.team5.message.MessageRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;

@SpringBootTest
@Transactional
public class ChatRoomIntegrationTest {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ChatRoomRepository chatRoomRepository;

    @Autowired
    ChatRoomMemberRepository chatRoomMemberRepository;

    @Autowired
    MessageRepository messageRepository;

    @Test
    void ChatRoomIntegrationTest() {
        // 1) 유저 생성
        User user1 = new User();
        user1.setUsername("Alice");
        userRepository.save(user1);

        User user2 = new User();
        user2.setUsername("Bob");
        userRepository.save(user2);

        // 2) 채팅방 생성
        ChatRoom room = new ChatRoom();
        room.setRoomName("Test Room");
        chatRoomRepository.save(room);

        // 3) 멤버 추가
        ChatRoomMember member1 = new ChatRoomMember();
        member1.setChatRoom(room);
        member1.setUser(user1);
        member1.setJoinedAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member1);

        ChatRoomMember member2 = new ChatRoomMember();
        member2.setChatRoom(room);
        member2.setUser(user2);
        member2.setJoinedAt(LocalDateTime.now());
        chatRoomMemberRepository.save(member2);

        // 4) 메시지 보내기
        Message message = new Message();
        message.setChatRoom(room);
        message.setSender(user1);
        message.setContent("Hello, Bob!");
        message.setSentAt(LocalDateTime.now());
        messageRepository.save(message);

        // 5) 메시지 조회
        List<Message> messages = messageRepository.findByChatRoomChatRoomno(room.getChatRoomno());
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0).getContent()).isEqualTo("Hello, Bob!");

        // 6) 멤버 조회
        List<ChatRoomMember> members = chatRoomMemberRepository.findByChatRoomChatRoomno(room.getChatRoomno());
        assertThat(members).hasSize(2);
    }
}