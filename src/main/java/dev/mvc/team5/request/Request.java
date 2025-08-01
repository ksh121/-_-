package dev.mvc.team5.request;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.match.Match;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "requests")
public class Request {

    /**
     * 요청 게시물 고유 번호 (기본키)
     * 시퀀스(request_seq)를 통해 자동 생성됨
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "request_seq")
    @SequenceGenerator(name = "request_seq", sequenceName = "REQUEST_SEQ", allocationSize = 1)
    @Column(name = "requestno")
    private Long requestno;

    /**
     * 요청과 연관된 talent 정보
     * Talent 엔티티와 다대일 관계
     */
    @ManyToOne
    @JoinColumn(name = "talentno")
    private Talent talent;

    /**
     * 요청한 회원 정보
     * User 엔티티와 일대일 관계
     */
    @ManyToOne
    @JoinColumn(name = "giverno")
    private User giver;
    
    /**
     * 요청받은 회원 정보
     * User 엔티티와 일대일 관계
     */
    @ManyToOne
    @JoinColumn(name = "receiverno")
    private User receiver;
    
    @ManyToOne
    @JoinColumn(name = "chatroomno")  
    private ChatRoom chatRoom;

    /**

     * 요청 상태
     */
    private String status;
    
    /**
     * 요청 시 가격
     */
    private Long price;

    /**
     * 요청 메세지
     */
    private String message;

    /**
     * 게시물 등록 일시
     * 엔티티 생성 시 자동으로 현재 시간 저장
     */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // 양방향: Request ↔ Match
    @OneToMany(mappedBy = "request", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> matches = new ArrayList<>();
    
    /**
     * 생성자
     * 시퀀스, 요청 시간은 자동 처리되므로 포함하지 않음
     * @param talent 요청 게시물 Talent 객체
     * @param user 요청 회원 User 객체
     * @param status 요청 상태
     * @param message 요청 메세지
     */
    public Request(Talent talent, User giver, User receiver,
        String status, String message) {
      this.talent = talent;
      this.giver = giver;
      this.receiver = receiver;
      this.status = status;
      this.message = message;
  }
    
}
