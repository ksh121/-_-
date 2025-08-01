package dev.mvc.team5.message.websocket;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.chatroom.ChatRoomService;
import dev.mvc.team5.message.Message;
import dev.mvc.team5.message.MessageService;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserService;
import dev.mvc.team5.message.websocket.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RealtimeChatService {

    private final ChatRoomService chatRoomService;
    private final UserService userService;
    private final MessageService messageService;

    // WebSocket으로 들어온 메시지를 DB에 저장
    public Message saveMessage(RealtimeMessageDTO dto) {
      if (dto.getChatRoomno() == null) {
        throw new IllegalArgumentException("ChatRoomno가 null입니다.");
    }else if (dto.getSenderno() == null) {
      throw new IllegalArgumentException("Senderno가 null입니다.");
    }
      
        ChatRoom chatRoom = chatRoomService.findById(dto.getChatRoomno());
        User sender = userService.findById(dto.getSenderno());
        if (chatRoom == null || sender == null) {
          throw new IllegalArgumentException("ChatRoom 또는 User 정보를 찾을 수 없습니다.");
      }
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(dto.getContent());

        return messageService.save(message);
    }
}
