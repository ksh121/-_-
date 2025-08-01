package dev.mvc.team5.user;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Where;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import dev.mvc.team5.activitylog.ActivityLog;
import dev.mvc.team5.block.Block;
import dev.mvc.team5.chatroommember.ChatRoomMember;
import dev.mvc.team5.loginlog.LoginLog;
import dev.mvc.team5.match.Match;
import dev.mvc.team5.message.Message;
import dev.mvc.team5.notification.Notification;
import dev.mvc.team5.report.Report;
import dev.mvc.team5.request.Request;
import dev.mvc.team5.reservations.Reservations;
import dev.mvc.team5.review.Review;
import dev.mvc.team5.school.School;
import dev.mvc.team5.talents.Talent;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Where(clause = "is_deleted = false") // 탈퇴한 유저는 쿼리에서 자동 제외
@Data // Getter, Setter, toString, equals, hashCode 등 자동 생성
public class User {

    /** 사용자 고유 번호 (기본키), 시퀀스로 자동 생성 */
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="user_seq")
    @SequenceGenerator(name="user_seq", sequenceName="USER_SEQ", allocationSize=1)
    private Long userno;

    /** 학교 정보와 다대일 연관관계 (Lazy 로딩) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schoolno") // 외래키 컬럼명
    private School school;

    /** 사용자 아이디 (최대 30자) */
    @Column(name = "user_id", length = 30)
    private String userId;

    /** 비밀번호 (최대 255자) */
    @Column(length = 255)
    private String password;

    /** 닉네임 (최대 100자) */
    @Column(length = 100)
    private String username;

    /** 사용자 이름 (닉네임, 최대 50자) */
    @Column(length = 50)
    private String name;

    /** 이메일 (최대 100자) */
    @Column(length = 100)
    private String email;

    /** 전화번호 (최대 20자) */
    @Column(length = 20)
    private String phone;

    /** 우편번호 (최대 10자) */
    @Column(length = 10)
    private String zipcode;

    /** 주소 (최대 200자) */
    @Column(length = 200)
    private String address;

    /** 사용하는 언어 (최대 20자) */
    @Column(length = 20)
    private String language;

    /** 위치 (최대 100자) */
    @Column(length = 100)
    private String location;

    /** 자기소개 등 긴 글(텍스트) 저장용 */
    @Lob
    private String bio;

    /** 사용자 역할 (최대 20자) */
    @Column(length = 20)
    private String role;
    
    /** 프로필 사진 저장된 파일명 or 경로*/
    @Column(name="profileImage",length = 255)
    private String profileImage;  
    
    /** 회원가입 시간, 엔티티가 생성될 때 자동 저장 */
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /** 탈퇴 여부 (기본 false) */
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

    /** 탈퇴 일시 */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
    
    // --------------------
    // 양방향 연관관계 리스트
    // --------------------
    
    /** 활동 로그 - User가 주체인 일대다 관계 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ActivityLog> activityLogs = new ArrayList<>();
    
    /** 로그인 내역 - User가 주체인 일대다 관계 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoginLog> loginLogs = new ArrayList<>();
    
    /** 알림 - User가 주체인 일대다 관계 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    /** 차단한 사용자 목록 - User가 차단자(blocker)인 일대다 관계 */
    @OneToMany(mappedBy = "blocker", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Block> blocksCreated = new ArrayList<>();

    /** 차단당한 사용자 목록 - User가 차단당한 대상(blocked)인 일대다 관계 */
    @OneToMany(mappedBy = "blocked", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Block> blocksReceived = new ArrayList<>();

    /** 신고한 내역 - User가 신고자(reporter)인 일대다 관계 */
    @OneToMany(mappedBy = "reporter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Report> reportsCreated = new ArrayList<>();

    /** 신고당한 내역 - User가 신고당한 대상(reported)인 일대다 관계 */
    @OneToMany(mappedBy = "reported", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Report> reportsReceived = new ArrayList<>();
    
    /** 매칭 준 내역 - User가 매칭 제공자(giver)인 일대다 관계 */
    @OneToMany(mappedBy = "giver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> givenMatches = new ArrayList<>();

    /** 매칭 받은 내역 - User가 매칭 수신자(receiver)인 일대다 관계 */
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Match> receivedMatches = new ArrayList<>();
    
    /** 준 리뷰 - User가 리뷰 작성자(giver)인 일대다 관계 */
    @OneToMany(mappedBy = "giver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> givenReviews = new ArrayList<>();

    /** 받은 리뷰 - User가 리뷰 수신자(receiver)인 일대다 관계 */
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> receivedReviews = new ArrayList<>();
    
    /** 채팅방 멤버 목록 - User가 속한 채팅방과 일대다 관계 */
    @OneToMany(mappedBy = "user" , cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ChatRoomMember> chatRoomMembers = new ArrayList<>();

    /** 보낸 메시지 목록 - User가 메시지 송신자(sender)인 일대다 관계 */
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Message> messages = new ArrayList<>();
    
    /** 요청 - User가 리뷰 작성자(user)인 일대다 관계  */
    @OneToMany(mappedBy = "giver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Request> giverRequests = new ArrayList<>();
    
    /** 요청 - User가 리뷰 작성자(user)인 일대다 관계  */
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Request> receiverRequests = new ArrayList<>();
    
    /** 게시물(Talent) - User가 작성자(user)인 일대다 관계  */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Talent> talents = new ArrayList<>();
    
    /** 예약 목록 - User가 예약자(user)인 일대다 관계 */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Reservations> reservations = new ArrayList<>();
    
    // --------------------
    // 생성자
    // --------------------
    
    /**
     * 사용자 아이디, 비밀번호, 이름, 학교를 초기화하는 생성자
     * @param userId 사용자 아이디
     * @param password 비밀번호
     * @param name 이름
     * @param school 소속 학교 객체
     */
    public User(String userId, String password, String name, School school) {
      this.userId = userId;
      this.password = password;
      this.name = name;
      this.school = school;
    }

}

