package dev.mvc.team5.match.matchdto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class MatchListDTO {
    private Long matchno;
    private Long requestno;
    private String giverName;
    private String receiverName;
    private String talentTitle;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
