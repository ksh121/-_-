package dev.mvc.team5.match;

import dev.mvc.team5.request.Request;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.user.User;
import dev.mvc.team5.reservations.Reservations;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "matches")
public class Match {

    /** 매칭 고유 번호 (기본키) */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "match_seq")
    @SequenceGenerator(name = "match_seq", sequenceName = "match_seq", allocationSize = 1)
    @Column(name = "matchno")
    private Long matchno;

    /** 요청 외래키 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requestno")
    private Request request;

    /** 주는 사람 (giver, 외래키) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giverno")
    private User giver;

    /** 받는 사람 (receiver, 외래키) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiverno")
    private User receiver;

    /** 재능 게시물 외래키 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talentno")
    private Talent talent;

    /** 예약 정보 외래키 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservationno")
    private Reservations reservation;
    
    public Match(Request request, User giver, User receiver, Talent talent, Reservations reservation) {
      this.request = request;
      this.giver = giver;
      this.receiver = receiver;
      this.talent = talent;
      this.reservation = reservation;
  }
    
    

}
