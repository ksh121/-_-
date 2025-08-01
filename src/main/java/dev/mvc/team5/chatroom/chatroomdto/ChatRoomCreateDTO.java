package dev.mvc.team5.chatroom.chatroomdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import dev.mvc.team5.chatroom.ChatRoom;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomCreateDTO {
    private String roomName;

    // DTO → Entity 변환 메서드
    public ChatRoom toEntity() {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomName(this.roomName);
        // createdAt은 엔티티에서 @CreationTimestamp로 자동 생성됨
        return chatRoom;
    }
}
