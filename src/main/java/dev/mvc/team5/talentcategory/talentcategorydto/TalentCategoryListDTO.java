package dev.mvc.team5.talentcategory.talentcategorydto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentCategoryListDTO {
    private Long categoryno;
    private String name;
    private String cateGrpName;
}
