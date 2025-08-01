package dev.mvc.team5.talentcategrp.talentcategrpdto;

import java.util.List;

import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategorySimpleDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TalentCateGrpWithSubDTO {
    private Long cateGrpno;
    private String cateGrpName;
    private List<TalentCategorySimpleDTO> categories;
}