package dev.mvc.team5.user;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import dev.mvc.team5.fileupload.FileUpload1;
import dev.mvc.team5.fileupload.FileUpload1Service;
import dev.mvc.team5.report.ReportRepository;
import dev.mvc.team5.review.ReviewRepository;
import dev.mvc.team5.tool.Security;
import dev.mvc.team5.user.UserDTO.UserAdminDTO;
import dev.mvc.team5.user.UserDTO.UserDetailDTO;
import dev.mvc.team5.user.UserDTO.UserReviewInfoDTO;
import dev.mvc.team5.user.UserDTO.UserUpdateDTO;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private FileUpload1Service fileUploadService;
    

    @Autowired
    private dev.mvc.team5.school.SchoolRepository schoolRepository; // 선택: School 엔티티 주입

    @Autowired
    private Security security;
    
    //엔티티 > DTO변환
    private UserDTO toDTO(User user) {
      UserDTO dto = new UserDTO();
      dto.setUserno(user.getUserno());
      dto.setUserId(user.getUserId());
      dto.setUsername(user.getUsername());
      dto.setEmail(user.getEmail());
      // 필요한 필드 추가
      return dto;
  }

 // 아이디 중복 확인
    public boolean checkID(String userId) {
        return userRepository.findByUserId(userId) != null;
    }

     // userno로 사용자 찾기
    public User findById(Long userno) {
      return userRepository.findById(userno)
          .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
  }
    public UserDTO getUserByNo(Long userno) {
      User user = userRepository.findById(userno).orElse(null);
      if (user == null) return null;

      UserDTO dto = new UserDTO();
      dto.setUserno(user.getUserno());
      dto.setUserId(user.getUserId());
      dto.setName(user.getName());
      dto.setUsername(user.getUsername());
      dto.setEmail(user.getEmail());
      dto.setPhone(user.getPhone());
      dto.setZipcode(user.getZipcode());
      dto.setAddress(user.getAddress());
      dto.setLanguage(user.getLanguage());
      dto.setLocation(user.getLocation());
      dto.setBio(user.getBio());
      dto.setRole(user.getRole());
      dto.setSchoolno(user.getSchool().getSchoolno());
      dto.setSchoolname(user.getSchool().getSchoolname());
      dto.setProfileImage(user.getProfileImage());
      return dto;
  }

    // 회원가입
    public void create(UserDTO userDTO) {
        User user = new User();
        user.setUserId(userDTO.getUserId());
        user.setPassword(security.aesEncode(userDTO.getPassword()));
        user.setUsername(userDTO.getUsername());
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());
        user.setZipcode(userDTO.getZipcode());
        user.setAddress(userDTO.getAddress());
        user.setLanguage(userDTO.getLanguage());
        user.setLocation(userDTO.getLocation());
        user.setBio(userDTO.getBio());
        user.setRole(userDTO.getRole());
        // 학교 연관관계 처리
        // if (dto.getSchoolId() != null) {
        //   user.setSchool(schoolRepository.findById(dto.getSchoolId()).orElse(null));
        // }
        userRepository.save(user);
      }
    //로그인
    public boolean login(UserDTO userDTO, HttpSession session) {
      User user = userRepository.findByUserId(userDTO.getUserId());
      if (user != null) {
          String encodedPw = security.aesEncode(userDTO.getPassword());
          if (user.getPassword().equals(encodedPw)) {
              session.setAttribute("userno", user.getUserno());   // userno 저장
              session.setAttribute("username", user.getUsername());   // username 저장
              session.setAttribute("userId", user.getUserId());
              session.setAttribute("schoolname", user.getSchool().getSchoolname());
              session.setAttribute("role", user.getRole());
              return true;
          }
      }
      return false;
  }
    // 세션
    public UserDTO getUserById(String userId) {
      User user = userRepository.findByUserId(userId);
      if (user == null) return null;

      UserDTO dto = new UserDTO();
      dto.setUserno(user.getUserno());   // User 엔티티에 userno 필드가 있어야 합니다.
      dto.setUserId(user.getUserId());
      dto.setName(user.getName());
      dto.setUsername(user.getUsername());
      dto.setEmail(user.getEmail());
      dto.setPhone(user.getPhone());
      dto.setZipcode(user.getZipcode());
      dto.setAddress(user.getAddress());
      dto.setLanguage(user.getLanguage());
      dto.setLocation(user.getLocation());
      dto.setBio(user.getBio());
      dto.setRole(user.getRole());
      dto.setSchoolno(user.getSchool() != null ? user.getSchool().getSchoolno() : null);
      dto.setSchoolname(user.getSchool().getSchoolname());
      dto.setProfileImage(user.getProfileImage());
      return dto;
  }
    // 로그아웃
    public void logout(HttpSession session) {
        session.invalidate();
    }

    // 권한 확인: 회원 or 관리자
    public boolean isMember(HttpSession session) {
        String role = (String) session.getAttribute("role");
        return role != null && (role.equals("member") || role.equals("admin"));
    }

    public boolean isAdmin(HttpSession session) {
        String role = (String) session.getAttribute("role");
        return "admin".equals(role);
    }

    // 비밀번호 변경 (패턴 동일)
    public void passwdUpdate(Long userno, String newPassword) {
        User user = userRepository.findById(userno).orElseThrow();
        user.setPassword(security.aesEncode(newPassword));
        userRepository.save(user);
    }
    
    // 사용자 정보 불러오기
    public User findByIdOrThrow(Long userno) {
      return userRepository.findById(userno)
                           .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다."));
    }
    
    
    // 회원정보 업데이트
    public void updateProfile(Long userno, UserDTO userDTO) {
      User user = userRepository.findById(userno).orElseThrow();
      user.setUsername(userDTO.getUsername());  // 이름
      user.setName(userDTO.getName());          // 닉네임
      user.setEmail(userDTO.getEmail());
      user.setPhone(userDTO.getPhone());
      user.setZipcode(userDTO.getZipcode());
      user.setAddress(userDTO.getAddress());
      user.setLanguage(userDTO.getLanguage());
      user.setLocation(userDTO.getLocation());
      user.setBio(userDTO.getBio());
      user.setRole(userDTO.getRole());
      user.setProfileImage(userDTO.getProfileImage());
      userRepository.save(user);
  }
    // 비밀번호 변경
    public boolean updatePassword(String username,String userId, String email, String newPassword) {
      Optional<User> userOpt = userRepository.findByUsernameAndUserIdAndEmail(username,userId, email);
      if (userOpt.isPresent()) {
          User user = userOpt.get();

          // 비밀번호 암호화 (반드시 해야 함)
          String encodedPassword = security.aesEncode(newPassword);
          user.setPassword(encodedPassword);

          userRepository.save(user);
          return true;
      }
      return false;
  }
    // 회원 탈퇴
    public void delete(Long userno) {
      userRepository.deleteById(userno);
  }
    
    //아이디 찾기
    public UserDTO findByUsernameAndEmail(String username, String email) {
      Optional<User> userOpt = userRepository.findByUsernameAndEmail(username, email);
      return userOpt.map(this::toDTO).orElse(null);
  }

    public void updateSchool(String schoolName) {
      
      
    }
    // 유저정보 검색 페이징
    public Page<User> findByKeyword(String keyword, Pageable pageable) {
      if (keyword != null && !keyword.isEmpty()) {
          return userRepository.findByUserIdContainingIgnoreCaseOrUsernameContainingIgnoreCase(keyword, keyword, pageable);
      }
      return userRepository.findAll(pageable);
  }
    
    public void adminUpdateUser(Long userno, UserDTO userDTO) {
      User user = userRepository.findById(userno).orElseThrow(() -> new RuntimeException("사용자 없음"));
      user.setUsername(userDTO.getUsername());  // 이름
      user.setName(userDTO.getName());          // 닉네임
      user.setEmail(userDTO.getEmail());   //이메일
      user.setPhone(userDTO.getPhone()); //휴대폰번호
      user.setZipcode(userDTO.getZipcode()); // 우편번호
      user.setAddress(userDTO.getAddress()); // 주소
      user.setLanguage(userDTO.getLanguage());  //언어 
      user.setBio(userDTO.getBio());   // 설명
      user.setRole(userDTO.getRole());  // 역할 admin , user 

     
      userRepository.save(user);
  }
    // 관리자 유저 삭제
    public void deleteUserByUserno(Long userno) {
      // 예: 존재 여부 체크 후 삭제
      User user = userRepository.findById(userno)
                  .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
      userRepository.delete(user);
  }
    // 유저를 탈퇴 처리 
    @Transactional
    public void softDeleteUser(Long userno) {
        User user = userRepository.findById(userno)
                     .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));
        
        user.setIsDeleted(true);
        user.setDeletedAt(LocalDateTime.now());

        userRepository.save(user);  // 실제 삭제되지 않음
    }
    
    // 유저 프로필에 사진 올리기
    @Transactional
    public void updateUserWithProfile(Long userno, UserUpdateDTO dto, MultipartFile profileImage) throws IOException {
        User user = userRepository.findById(userno)
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        user.setUsername(dto.getUsername());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setZipcode(dto.getZipcode());
        user.setAddress(dto.getAddress());
        user.setLanguage(dto.getLanguage());
        user.setLocation(dto.getLocation());
        user.setBio(dto.getBio());
        

        if (profileImage != null && !profileImage.isEmpty()) {
            FileUpload1 uploaded = fileUploadService.uploadFile(profileImage, "PROFILE", "USER", userno);
            user.setProfileImage(uploaded.getStoredFileName()); //  여기가 핵심
        }

        userRepository.save(user);
    }
    
  

    
    public UserDetailDTO getUserDetail(Long userno) {
      User user = userRepository.findById(userno)
          .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다."));

      UserDetailDTO dto = new UserDetailDTO();
      dto.setUserno(user.getUserno());
      dto.setUserId(user.getUserId());
      dto.setUsername(user.getUsername());
      dto.setEmail(user.getEmail());
      dto.setName(user.getName());
      dto.setRole(user.getRole());
      dto.setSchoolname(user.getSchool().getSchoolname());
      dto.setCreatedAt(user.getCreatedAt());
      dto.setDeleted(user.getIsDeleted());

      // 🔽 아래는 더미/예시 - 나중에 실제 테이블에서 가져오도록 수정 가능
      dto.setReportCount(reportRepository.countByTargetId(userno)); // 예시
      dto.setReviewCount(reviewRepository.countByGiver_Userno(userno));       // 예시
      dto.setLoginLog(List.of("2024-07-09 11:00", "2024-07-08 13:25")); // 예시
      dto.setActivity(List.of("2024-07-06: 리뷰 작성", "2024-07-05: 재능 등록")); // 예시
      
      dto.setProfileImage(user.getProfileImage()); // 프로필 이미지 가져오기

      return dto;
  }
    
}
