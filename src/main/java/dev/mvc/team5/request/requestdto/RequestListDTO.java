package dev.mvc.team5.request.requestdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestListDTO {
    private Long requestno;       // 요청 번호
    private Long talentno;        // 게시물 번호
    private String talentTitle;   // 게시물 제목
    private Long receiverno; // 게시물 작성 유저 번호
    private String status;        // 요청 상태
    private LocalDateTime createdAt; // 요청 시간
}
