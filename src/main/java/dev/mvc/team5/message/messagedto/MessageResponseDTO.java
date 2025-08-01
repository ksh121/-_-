package dev.mvc.team5.message.messagedto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MessageResponseDTO {
    private Long messageno;
    private Long chatRoomno;
    private Long senderno;
    private String userName;
    private String content;
    private String type;
    private LocalDateTime sentAt;
}
