package dev.mvc.team5.message;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.message.Message;
import dev.mvc.team5.message.MessageRepository;
import dev.mvc.team5.message.messagedto.LastMessageDTO;
import dev.mvc.team5.message.messagedto.MessageResponseDTO;
import dev.mvc.team5.user.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    // 메시지 저장
    public Message save(Message message) {
        return messageRepository.save(message);
    }

    // 채팅방 번호로 메시지 목록 조회 (시간 순서 오름차순)
    public List<MessageResponseDTO> findMessagesByChatRoomno(Long chatRoomno) {
//      List<Message> messages = messageRepository.findByChatRoom_ChatRoomnoOrderBySentAtAsc(chatRoomno);
      List<Message> messages = messageRepository.findByChatRoomWithSender(chatRoomno);
      return messages.stream()
                     .map(m -> new MessageResponseDTO(
                         m.getMessageno(),
                         m.getChatRoom().getChatRoomno(),
                         m.getSender() != null ? m.getSender().getUserno() : null,
                         m.getSender() != null ? m.getSender().getUsername() : "system",
                         m.getContent(),
                         m.getType(),
                         m.getSentAt()))
                     .collect(Collectors.toList());
  }
    
    public LastMessageDTO getLastMessage(Long chatRoomno) {
      Message m = messageRepository
              .findTopByChatRoom_ChatRoomnoOrderBySentAtDesc(chatRoomno);

      if (m == null) {
          return new LastMessageDTO("", "", null);
      }

      User sender = m.getSender();
      String senderName = (sender != null) ? sender.getUsername() : "system";

      return new LastMessageDTO(senderName, m.getContent(), m.getSentAt());
  }

}
