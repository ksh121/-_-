package dev.mvc.team5.talents.talentdto;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import dev.mvc.team5.file.FileUploadDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentDetailDTO {
    private Long talentno;
    private Long userno;
    private Long typeno;
    private String typeName;
    private Long cateGrpno;
    private String cateGrpName;
    private Long categoryno;
    private String categoryName;    
    private String title;
    private String description;
    private Long price;
    private int viewCount;
    private String userName; // 게시물 작성자 닉네임
    private String name; // 게시물 작성자 이름 
    private String email; // 작성자 이메일 
    private String profileImage; // 작성자 프로필 사진
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd HH:mm")
    private LocalDateTime createdAt;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy/MM/dd HH:mm")
    private LocalDateTime updatedAt;    
    private List<FileUploadDTO> fileInfos;
    
    public TalentDetailDTO(Long talentno, Long userno, String typeName, String cateGrpName, String categoryName, String title,
        String description, Long price, int viewCount, String userName,
        LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.talentno = talentno;
        this.userno = userno;
        this.typeName = typeName;
        this.cateGrpName = cateGrpName;
        this.categoryName = categoryName;
        this.title = title;
        this.description = description;
        this.price = price;
        this.viewCount = viewCount;
        this.userName = userName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        // fileInfos는 JPQL select 구문에 없으므로 null 처리 가능
        this.fileInfos = fileInfos;
    }

    
}
