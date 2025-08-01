package dev.mvc.team5.chatroommember.chatroommemberdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ChatRoomMemberResponseDTO {
    private Long chatRoomMemberno;
    private Long chatRoomno;
    private Long userno;
    private String username;
    private LocalDateTime joinedAt;
}
