package dev.mvc.team5.request.requestdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import dev.mvc.team5.request.Request;

@Getter @Setter
@AllArgsConstructor
public class RequestResponseDTO {
    private Long requestno;
    private Long talentno;         // 게시물 번호 (추가됨)
    private String talentTitle;    // 게시물 제목
    private Long giverno;        // 요청자 번호
    private String givername;       // 요청자 이름
    private Long receiverno;        // 피요청자 번호
    private String receivername;       // 피요청자 이름
    private String status;         // 요청 상태
    private String message;        // 요청 메시지
    private LocalDateTime createdAt;      // 요청시간
    private Long price;

    
    private final String type = "REQUEST";  // ✅ WebSocket 메시지 분기용 타입 추가

    public RequestResponseDTO(Request request) {
      this.requestno = request.getRequestno();
      this.talentno = request.getTalent().getTalentno();
      this.talentTitle = request.getTalent().getTitle();
      this.giverno = request.getGiver().getUserno();
      this.givername = request.getGiver().getUsername();       // 사용자 이름 가져오는 방식 확인
      this.receiverno = request.getReceiver().getUserno();
      this.receivername = request.getReceiver().getUsername(); // 사용자 이름 가져오는 방식 확인
      this.status = request.getStatus();
      this.message = request.getMessage();
      this.createdAt = request.getCreatedAt();
      this.price = request.getTalent().getPrice();

  }

}
