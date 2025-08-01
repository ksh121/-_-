package dev.mvc.team5.talentcategrp.talentcategrpdto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
public class TalentCateGrpResponseDTO {
    private Long cateGrpno;
    private String name;
    
    public TalentCateGrpResponseDTO(Long grpno, String name) {
      this.cateGrpno = grpno;
      this.name = name;
    }
}
