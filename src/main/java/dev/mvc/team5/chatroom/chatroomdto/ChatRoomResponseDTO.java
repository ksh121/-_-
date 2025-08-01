package dev.mvc.team5.chatroom.chatroomdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ChatRoomResponseDTO {
    private Long chatRoomno;
    private String roomName;
    private LocalDateTime createdAt;

    private Long talentno;       // 게시글 번호 (optional)
    private String title;        // 게시글 제목 (optional)

    private Long receiverno;     // 상대방 유저 번호 (1:1 채팅에서만)
    private String receiverName; // 상대방 이름
    
    private boolean publicRoom; // 공개 채팅방 여부
    
    private Long price;


    // 게시글 기반 채팅방 생성 응답용 (상대방 정보 제외)
    public ChatRoomResponseDTO(Long chatRoomno, String roomName, LocalDateTime createdAt,
                               Long talentno, String title, boolean publicRoom, Long price) {
        this.chatRoomno = chatRoomno;
        this.roomName = roomName;
        this.createdAt = createdAt;
        this.talentno = talentno;
        this.title = title;
        this.publicRoom = publicRoom;
        this.price = price;
    }
}
