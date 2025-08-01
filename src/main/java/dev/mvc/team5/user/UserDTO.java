package dev.mvc.team5.user;

import java.time.LocalDateTime;
import java.util.List;

import dev.mvc.team5.match.Match;
import dev.mvc.team5.request.Request;
import dev.mvc.team5.school.School;
import dev.mvc.team5.talentcategory.TalentCategory;
import dev.mvc.team5.talenttype.TalentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userno;      // 회원 번호 (PK)
    private String userId;  //아이디
    private String password; // 비밀번호
    private String name; // 이름
    private String username;  //닉네임
    private String email;    //이메일
    private String phone;   //폰번호
    private String zipcode;   // 우편번호
    private String address;  // 주소 
    private String language; // 사용 언어
    private String location;   // 위치 
    private String bio;   // 자기소개
    private String role;    // 역할(ADMIN, USER)
    private Boolean isDeleted; // 탈퇴여부
    private LocalDateTime createdAt;   // 가입일 
    private Long schoolno;   // 학교 번호  
    private String schoolname; // 학교이름
    private String profileImage;  // 프로필 사진
    
    @Data
    public static class SchoolInfo{
      private Long schoolno;
      private String schoolName;
    }    
    @Data
    public static class MailRequestDto{
      private String email;
      private String schoolName;
    }
    
    @Data
    public static class VerifyCodeDto {
        private String email;
        private String schoolName;
        private int code;
    }
    
    @Data
    public static class ResetPasswordDto {
        private String email;
        private String schoolName;
        private int code; // 인증번호
        private String newPassword; // 새 비밀번호
    }
    @Data
    public static class UserUpdateDTO {
        private String username;
        private String name;
        private String email;
        private String phone;
        private String zipcode;
        private String address;
        private String language;
        private String location;
        private String bio;
    }
    
    @Data
    public static class UserSimpleDTO {
      private Long userno;
      private String username;

      public UserSimpleDTO(User user) {
          this.userno = user.getUserno();
          this.username = user.getUsername();
      }
  }
    
    @Data
    public static class UserDetailDTO {
        private Long userno;
        private String userId;
        private String username;
        private String email;
        private String name;
        private String role;
        private String schoolname;
        private LocalDateTime createdAt;
        private LocalDateTime lastLoginAt;
        private boolean isDeleted;

        private int reportCount;
        private int reviewCount;
        private List<String> loginLog;
        private List<String> activity;
        
        private String profileImage;
    }
    
    @Data
    public static class UserReviewInfoDTO {
        private Long userno;
        private String userId;
        private String name;
        private String username;
        private String email;
        private int reviewWrittenCount;
        private int reviewReceivedCount;
    }
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserAdminDTO  {
        private Long userno;
        private String userId;
        private String name;
        private String email;
        private String username;
        private String role;
        private LocalDateTime createdAt;
        private int givenReviewCount; 
    }
    
    public UserDTO(User user) {
      this.userno = user.getUserno();
      this.userId = user.getUserId();
      this.username = user.getUsername();
      this.name = user.getName();
      this.email = user.getEmail();
      this.phone = user.getPhone();
      this.role = user.getRole();
      this.isDeleted = user.getIsDeleted();
      this.createdAt = user.getCreatedAt();
      if (user.getSchool() != null) {
        this.schoolname = user.getSchool().getSchoolname();
    } else {
        this.schoolname = "미등록"; // 또는 null, 빈 문자열 등
    }
      // 필요한 필드 추가
  }
    
    
}