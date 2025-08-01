package dev.mvc.team5.match.matchdto;

import dev.mvc.team5.match.Match;
import dev.mvc.team5.request.Request;
import dev.mvc.team5.reservations.Reservations;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.user.User;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MatchCreateDTO {
    private Long requestno;
    private Long giverno;
    private Long receiverno;
    private Long talentno;
    private Long reservationno;
    
}
