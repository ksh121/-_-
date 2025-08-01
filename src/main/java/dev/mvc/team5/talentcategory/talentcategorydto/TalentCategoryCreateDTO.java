package dev.mvc.team5.talentcategory.talentcategorydto;

import dev.mvc.team5.talentcategory.TalentCategory;
import dev.mvc.team5.talentcategrp.TalentCateGrp;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentCategoryCreateDTO {
    private Long cateGrpno;
    private String name;
    
    public TalentCategory toEntity() {
      TalentCateGrp grp = new TalentCateGrp();
      grp.setCateGrpno(this.cateGrpno);  // 외래키 객체로 설정

      TalentCategory category = new TalentCategory();
      category.setName(this.name);      // 일반 필드 설정
      category.setCateGrp(grp);         // 외래키 객체 주입

      return category;
  }

    
}
