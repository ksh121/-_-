package dev.mvc.team5.message.messagedto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class LastMessageDTO {
  private String senderName;
    private String content;
    private LocalDateTime sentAt;
}