package dev.mvc.team5.classschedule;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.mvc.team5.places.Places;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "class_schedule")
@Data
@NoArgsConstructor
public class ClassSchedule {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "class_schedule_seq")
  @SequenceGenerator(name = "class_schedule_seq", sequenceName = "CLASS_SCHEDULE_SEQ", allocationSize = 1)
  @Column(name = "scheduleno")
  private Long scheduleno;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "placeno", nullable = false)
  @JsonIgnore
  private Places place;

  /** 요일 (ex: MONDAY, TUESDAY 등) */
  @Enumerated(EnumType.STRING)
  @Column(name = "day", length = 10, nullable = false)
  private DayOfWeekKor day;
  
  /** 시작 시간 (HH:mm 형식으로 저장, 혹은 LocalTime) */
  @Column(name = "start_time", nullable = false)
  private LocalTime startTime;

  /** 종료 시간 */
  @Column(name = "end_time", nullable = false)
  private LocalTime endTime;


  public ClassSchedule(Places place, DayOfWeekKor day, LocalTime startTime, LocalTime endTime) {
    this.place = place;
    this.day = day;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
