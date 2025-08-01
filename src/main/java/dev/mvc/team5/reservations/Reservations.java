package dev.mvc.team5.reservations;

import dev.mvc.team5.match.Match;
import dev.mvc.team5.places.Places;
import dev.mvc.team5.tool.ReservationStatus;
import dev.mvc.team5.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"user", "place", "matches"})
public class Reservations {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reservation_seq")
    @SequenceGenerator(name = "reservation_seq", sequenceName = "RESERVATION_SEQ", allocationSize = 1)
    private Long reservationno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userno", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placeno", nullable = false)
    private Places place;

    /**
     * 예약 시작 시간 (사용자가 직접 입력)
     */
    private LocalDateTime start_time;

    /**
     * 예약 종료 시간 (사용자가 직접 입력)
     */
    private LocalDateTime end_time;

    @Column(name = "purpose", length = 100)
    private String purpose;

    /**
     * 예약 상태 (예: 예약됨, 취소됨, 승인대기 등)
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ReservationStatus status;

    /**
     * 예약과 연결된 매치 리스트 (양방향)
     */
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matches = new ArrayList<>();

    /** 생성일*/
    @Column(name = "created_at", updatable = false)
    @CreationTimestamp // Hibernate 자동 생성일자 주입
    private LocalDateTime createdAt;
    
    /**
     * 생성자: DTO → Entity 변환 시 사용
     */
    public Reservations(User user, Places place, LocalDateTime start_time, LocalDateTime end_time, String purpose, ReservationStatus  status) {
        this.user = user;
        this.place = place;
        this.start_time = start_time;
        this.end_time = end_time;
        this.purpose = purpose;
        this.status = status;
    }
}
