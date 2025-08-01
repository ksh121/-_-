package dev.mvc.team5.talenttype.talenttypedto;

import dev.mvc.team5.talenttype.TalentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentTypeCreateDTO {
    private String name;
    
    public TalentType toEntity() {
      TalentType type = new TalentType();
      
      type.setName(this.name);
      
      return type;
    }
}
