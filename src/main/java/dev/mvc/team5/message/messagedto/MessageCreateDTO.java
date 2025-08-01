package dev.mvc.team5.message.messagedto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.message.Message;
import dev.mvc.team5.user.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageCreateDTO {
    private Long chatRoomno;
    private Long userno;
    private String content;

    // DTO → Entity 변환 메서드
    // ChatRoom과 User는 서비스에서 미리 조회해서 넣어줘야 함
    public Message toEntity(ChatRoom chatRoom, User sender) {
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(sender);
        message.setContent(this.content);
        // sentAt은 엔티티에서 자동 생성됨
        return message;
    }
}
