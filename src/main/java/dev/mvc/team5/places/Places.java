package dev.mvc.team5.places;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.mvc.team5.reservations.Reservations;
import dev.mvc.team5.schoolgwan.SchoolGwan;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "places")
@Data
@NoArgsConstructor
public class Places {
  
  /** 강의실 번호 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "places_seq")
  @SequenceGenerator(name = "places_seq", sequenceName = "PLACES_SEQ", allocationSize = 1)
  @Column(name = "placeno")
  private Long placeno;

  /** 소속 건물 (SchoolGwan) - 지연로딩 */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "schoolgwanno", nullable = false)
  @JsonIgnore
  private SchoolGwan schoolGwan;

  /** 강의실 이름 */
  @Column(name = "placename", length = 100, nullable = false)
  private String placename;

  /** 강의실 호수 */
  @Column(name = "hosu", length = 100)
  private String hosu;

  /** 예약 목록 - 양방향 연관관계 */
  @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
  @JsonIgnore
  private List<Reservations> reservations = new ArrayList<>();

  // 강의 시간 관련 필드는 별도 엔티티(ClassSchedule)에서 관리하기 때문에 제거

  public Places(SchoolGwan schoolGwan, String placename, String hosu) {
    this.schoolGwan = schoolGwan;
    this.placename = placename;
    this.hosu = hosu;
  }
  
  // 클래스 스케줄에 쓸 것
	//“이 객체는 placeno만 있고 나머지 필드는 몰라도 되니까,
	//  JPA 너가 DB에서 외래키만 써서 연관관계 연결해줘~” 라는 뜻
	public Places(Long placeno) {
	   this.placeno = placeno;
}


}
