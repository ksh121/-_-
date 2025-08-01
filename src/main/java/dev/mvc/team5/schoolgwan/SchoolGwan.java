package dev.mvc.team5.schoolgwan;

import java.util.ArrayList;
import java.util.List;

import dev.mvc.team5.places.Places;
import dev.mvc.team5.school.School;
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
@Table(name = "schoolgwan")
@Data
@NoArgsConstructor
public class SchoolGwan {
	
  
  // 양방향: schoolgwan ↔ places
  @OneToMany(mappedBy = "schoolGwan", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Places> places  = new ArrayList<>();
  
  /**
   * 학교관 번호
   * @param schoolgwanno 
   */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schoolgwan_seq")
    @SequenceGenerator(name = "schoolgwan_seq", sequenceName = "SCHOOLGWAN_SEQ", allocationSize = 1)
    @Column(name = "schoolgwanno")
    private Long schoolgwanno;


    /**
     * 학교번호 학교정보 테이블 다
     * @param schoolno
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schoolno", nullable = false)
    private School school;

   /**
     * 학교관 이름
     * @param schoolgwanname
     */
    @Column(name = "schoolgwanname")
    private String schoolgwanname;
    
    
    
    // 생성자
    public SchoolGwan(School school, String schoolgwanname) {
        this.school = school;
        this.schoolgwanname = schoolgwanname;
    }
    
}
