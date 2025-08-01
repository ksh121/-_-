package dev.mvc.team5.chatroom.chatroomdto;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.user.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpenRoomCreateDTO {

    private String roomName;
    private String password; // optional
    private Long creatorId;  // 사용자 ID

    public ChatRoom toEntity(User creator) {
        ChatRoom room = new ChatRoom();
        room.setRoomName(this.roomName);
        room.setPassword(this.password);
        room.setPublicRoom(true); // 공개방으로 설정
        room.setCreator(creator);
        return room;
    }
}
