package dev.mvc.team5.message.messagedto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO for WebSocket system message

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String userName;
    private String content;
    private String type; // ex: "SYSTEM", "CHAT"
    private Long chatRoomno;


}
