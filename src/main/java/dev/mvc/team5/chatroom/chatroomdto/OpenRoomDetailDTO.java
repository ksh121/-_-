package dev.mvc.team5.chatroom.chatroomdto;

import java.time.LocalDateTime;
import java.util.List;

import dev.mvc.team5.chatroommember.chatroommemberdto.ChatRoomMemberResponseDTO;
import dev.mvc.team5.user.UserDTO.UserSimpleDTO;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpenRoomDetailDTO {
  
  private Long chatRoomno;
  private String roomName;
  private LocalDateTime createdAt;
  private boolean publicRoom;
  
  private List<ChatRoomMemberResponseDTO> members;
  
  
  
}
