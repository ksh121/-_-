package dev.mvc.team5.talents.talentdto;


import java.util.List;
import java.util.stream.Collectors;

import dev.mvc.team5.file.FileUpload;
import dev.mvc.team5.file.FileUploadDTO;
import dev.mvc.team5.school.School;
import dev.mvc.team5.talentcategory.TalentCategory;
import dev.mvc.team5.talenttype.TalentType;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TalentCreateDTO {
    private Long userno;
    private Long schoolno;
    private Long typeno;
    private Long categoryno;
    private String title;
    private String description;
    private Long price;
    
    private List<FileUploadDTO> fileInfos;

    /**
     * 이 DTO 데이터를 기반으로 JPA 엔티티인 Talent 객체를 생성해서 반환한다.
     * 연관 관계가 있는 User, School, TalentType, TalentCategory 객체도 함께 생성하여 설정한다.
     * 
     * @return 변환된 Talent 엔티티 객체
     */
    public Talent toEntity() {
        Talent talent = new Talent();

        // 1. User 엔티티: 연관관계 설정 위해 userno만 세팅 (참고: 실제 DB에서는 userno만 있으면 연관관계 매핑 가능)
        User user = new User();
        user.setUserno(this.userno);
        talent.setUser(user);

        // 2. School 엔티티: schoolno를 세팅하여 연관관계 설정
        School school = new School();
        school.setSchoolno(this.schoolno);
        talent.setSchool(school);

        // 3. TalentType 엔티티: typeno 세팅
        TalentType type = new TalentType();
        type.setTypeno(this.typeno);
        talent.setType(type);

        // 4. TalentCategory 엔티티: categoryno 세팅
        TalentCategory category = new TalentCategory();
        category.setCategoryno(this.categoryno);
        talent.setCategory(category);

        // 필요하면 subcategory도 처리 가능 (예: category 내 하위 카테고리)
        // 만약 subcategory 엔티티가 별도로 있다면 생성 후 세팅

        // 5. 나머지 필드 세팅
        talent.setTitle(this.title);
        talent.setDescription(this.description);
        talent.setPrice(price);
        
     // -------------- 사진 파일 처리 추가 --------------
        if (this.fileInfos != null && !this.fileInfos.isEmpty()) {
            List<FileUpload> files = this.fileInfos.stream().map(fileDto -> {
                FileUpload file = new FileUpload();
                file.setOriginalFileName(fileDto.getOriginalFileName());
                file.setStoredFileName(fileDto.getStoredFileName());
                file.setFilePath(fileDto.getFilePath());
                file.setFileSize(fileDto.getFileSize());
                file.setTargetType(fileDto.getTargetType());
                file.setTalent(talent);
                file.setProfile(fileDto.getProfile());

                // Talent와 연관관계 설정
                file.setTalent(talent);
                return file;
            }).collect(Collectors.toList());

            talent.setFiles(files);
        }

        return talent;
    }
}
