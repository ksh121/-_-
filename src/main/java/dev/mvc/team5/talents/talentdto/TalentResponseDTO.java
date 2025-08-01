package dev.mvc.team5.talents.talentdto;

import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryResponseDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeResponseDTO;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentResponseDTO {

    private Long talentno;
    private Long userno;
    private Long schoolno;
    private String title;
    private String description;
    private Long price;
    private int viewCount;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd HH:mm")
    private LocalDateTime createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd HH:mm")
    private LocalDateTime updatedAt;
    private Long typeno;
    private Long categoryno;
    
    

//    public TalentResponseDTO(Long talentno, Long userno, Long schoolno, String title, String description,
//                             String language, LocalDateTime createdAt, LocalDateTime updatedAt,
//                             TalentTypeResponseDTO type, TalentCategoryResponseDTO category) {
//        this.talentno = talentno;
//        this.userno = userno;
//        this.schoolno = schoolno;
//        this.title = title;
//        this.description = description;
//        this.language = language;
//        this.createdAt = createdAt;
//        this.updatedAt = updatedAt;
//        this.type = type;
//        this.category = category;
//    }
}

