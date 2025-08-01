package dev.mvc.team5.talentcategrp.talentcategrpdto;

import dev.mvc.team5.talentcategrp.TalentCateGrp;
import dev.mvc.team5.talenttype.TalentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentCateGrpCreateDTO {
    private String name;
    
    public TalentCateGrp toEntity() {
      TalentCateGrp grp = new TalentCateGrp();
      
      grp.setName(this.name);
      
      return grp;
    }
}
