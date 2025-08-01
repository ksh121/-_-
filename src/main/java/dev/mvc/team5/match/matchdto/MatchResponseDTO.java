package dev.mvc.team5.match.matchdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class MatchResponseDTO {
    private Long matchno;
    private Long requestno;
    private Long reservationno;        // Optional: 예약 상세페이지 이동 등에 필요
    private String giverName;
    private String receiverName;
    private String talentTitle;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}

