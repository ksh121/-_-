package dev.mvc.team5.message.websocket;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RealtimeMessageDTO {
    private Long chatRoomno;  // 채팅방 번호
    private Long senderno;    // 보낸 사람 번호 (엔티티 필드명이랑 꼭 맞출 필요 없음)
    private String userName; // 보낸 사람 닉네임
    private String content;   // 메시지 내용
    private String type;       // 메시지 타입 ("CHAT", "SYSTEM", "REQUEST" 등)
}
