package dev.mvc.team5.talentcategory.talentcategorydto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TalentCategorySimpleDTO {
    private Long categoryno;
    private String name;
}