package dev.mvc.team5.talentcategory;

import java.util.ArrayList;
import java.util.List;


import dev.mvc.team5.talentcategrp.*;
import dev.mvc.team5.talentcategrp.TalentCateGrp;
import dev.mvc.team5.talents.Talent;
import jakarta.persistence.CascadeType;
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
@Table(name = "talent_category")
public class TalentCategory {

    /** 카테고리 고유 번호 (기본키) */
    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="category_seq")
    @SequenceGenerator(name="category_seq", sequenceName="CATEGORY_SEQ", allocationSize=1)
    private Long categoryno;

    /** 카테고리 그룹과 다대일 관계 (FK: cateGrp) */
    @ManyToOne
    @JoinColumn(name = "cate_Grpno")
    private TalentCateGrp cateGrp;

    /** 카테고리 이름 */
    private String name;


    /** 
     * 재능 목록과 일대다 양방향 관계
     * mappedBy="category"는 Talent 엔티티 내 category 필드와 연관됨
     * cascade = ALL : 카테고리 삭제 시 관련된 재능들도 함께 삭제
     * orphanRemoval = true : 카테고리에서 제거된 재능은 DB에서 삭제 
     */
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Talent> talents = new ArrayList<>();

    /** 
     * 기본 생성자 외에,
     * 카테고리 그룹, 이름, 재능 개수를 초기화하는 생성자 
     */
    public TalentCategory(TalentCateGrp cateGrp, String name) {
      this.cateGrp = cateGrp;
      this.name = name;
    }

}
