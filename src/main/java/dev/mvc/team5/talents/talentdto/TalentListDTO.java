package dev.mvc.team5.talents.talentdto;

import java.util.List;

import dev.mvc.team5.file.FileUploadDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentListDTO {
    private Long talentno;
    private String title;
    private String description;
    private Long price;
    private int viewCount;
    private String cateGrpName;
    private String categoryName;
    private String typeName;
    private Long userno; // 게시물 작성자
    private String userName;
    private List<FileUploadDTO> fileInfos;
    private boolean blocked; //이 재능 글 작성자가 로그인한 사용자에게 차단되었는지 여부

}
