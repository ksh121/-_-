package dev.mvc.team5.talentcategrp;

import java.util.ArrayList;
import java.util.List;

import dev.mvc.team5.talentcategory.TalentCategory;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "talent_categrp")
public class TalentCateGrp {

    /** 카테고리 그룹 고유 번호 (기본키) */
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="talent_cateGrp_seq")
    @SequenceGenerator(name="talent_cateGrp_seq", sequenceName="TALENT_CATEGRP_SEQ", allocationSize=1)
    private Long cateGrpno;
    
    /** 카테고리 그룹 이름 */
    private String name;

    
    /** 
     * 카테고리 목록과 일대다 양방향 관계
     * mappedBy="cateGrp"는 TalentCategory 엔티티 내 cateGrp 필드와 연관됨
     * cascade = ALL : 그룹 삭제 시 관련 카테고리도 함께 삭제
     * orphanRemoval = true : 그룹에서 제거된 카테고리는 DB에서 삭제 
     */
    @OneToMany(mappedBy = "cateGrp", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TalentCategory> categories = new ArrayList<>();
    
    /** 
     * 기본 생성자 외에,
     * 그룹 이름과 카테고리 개수를 초기화하는 생성자 
     */
    public TalentCateGrp(String name) {
      this.name = name;
    }
    
}

