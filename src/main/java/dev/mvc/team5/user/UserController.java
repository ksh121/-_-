package dev.mvc.team5.user;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.univcert.api.UnivCert;

import dev.mvc.team5.activitylog.ActivityLogService;
import dev.mvc.team5.review.Review;
import dev.mvc.team5.review.ReviewDTO;
import dev.mvc.team5.review.ReviewService;
import dev.mvc.team5.school.SchoolDTO;
import dev.mvc.team5.school.SchoolService;
import dev.mvc.team5.school.SchoolServiceImpl;
import dev.mvc.team5.tool.MailService;
import dev.mvc.team5.tool.UniversityEmailService;
import dev.mvc.team5.user.UserDTO.MailRequestDto;
import dev.mvc.team5.user.UserDTO.UserDetailDTO;
import dev.mvc.team5.user.UserDTO.UserReviewInfoDTO;
import dev.mvc.team5.user.UserDTO.UserUpdateDTO;
import dev.mvc.team5.user.UserDTO.VerifyCodeDto;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private  ReviewService reviewService;
    @Autowired
    private SchoolServiceImpl schoolService;
    
    @Autowired
    private MailService mailService;
    @Autowired
    private UniversityEmailService universityEmailService;
    @Autowired
    private ActivityLogService activityLogService; // 로그 기록용
    
//    /** 대학 인증 보내기 */
//    @PostMapping("/univ/sendCode")
//    public ResponseEntity<String> sendUnivCertMail(@RequestBody MailRequestDto dto) throws IOException {
//      String UNIV_KEY = "5d57fdce-3a2d-43ad-9aed-fc23369462e2";
//      // 기존 인증 제거
//      UnivCert.clear(UNIV_KEY, dto.getEmail());
//      // 학교 유효성 확인
//      boolean univ_check = false;
//      Map<String,Object> check = UnivCert.check(dto.getSchoolName());
//      boolean success = (boolean) check.get("success");
//      if(success) univ_check = true;
//      // 인증 코드 발송 요청
//      Map<String, Object> result = UnivCert.certify(UNIV_KEY, dto.getEmail(), dto.getSchoolName(), univ_check);
//
//      if ((boolean) result.get("success")) {
//        userService.updateSchool(dto.getSchoolName());
//        return ResponseEntity.ok("이메일이 성공적으로 보내졌습니다.");
//    } else {
//        return ResponseEntity
//            .status(HttpStatus.BAD_REQUEST)
//            .body("이메일 인증 실패 ");
//    }
//    }
//    
//    @PostMapping("/univ/verifyCode")
//    public ResponseEntity verifyCode(@RequestBody VerifyCodeDto dto) throws IOException {
//        String UNIV_KEY = "5d57fdce-3a2d-43ad-9aed-fc23369462e2";
//        
//        Map<String, Object> result = UnivCert.certifyCode(UNIV_KEY, dto.getEmail(), dto.getSchoolName(), dto.getCode());
//        
//        if ((boolean) result.get("success")) {
//            return ResponseEntity.ok(" 인증에 성공했습니다.");
//        } else {
//            return ResponseEntity
//                .status(HttpStatus.BAD_REQUEST)
//                .body("인증 실패: " + result.get("message"));
//        }
//    }
    // 회원가입전  대학교 이메일 인증번호 보내기
    @PostMapping("/univ/sendCode")
    public ResponseEntity<String> sendCode(@RequestBody Map<String, String> request,  HttpSession session) {
      String email = request.get("email");
      String schoolName = request.get("schoolName");

      if (email == null || schoolName == null) {
          return ResponseEntity.badRequest().body("이메일과 학교 이름을 모두 입력해주세요.");
      }

      // 학교 이름과 이메일 도메인 매치 확인
      String universityByEmail = universityEmailService.getUniversityByEmail(email);
      if (!schoolName.equals(universityByEmail)) {
          return ResponseEntity.badRequest().body("학교 이름과 이메일 도메인이 일치하지 않습니다.");
      }

      // 이메일이 대학교 이메일인지 추가로 확인 (필요시)
      if (!mailService.isUniversityEmail(email)) {
          return ResponseEntity.badRequest().body("대학교 이메일만 가능합니다.");
      }

   // 인증번호 생성 및 메일 발송 (generateAndSendAuthCode가 인증번호를 반환한다고 가정)
      String authCode = mailService.generateAndSendAuthCode(email);

      // 세션에 인증번호, 이메일 저장
      session.setAttribute("verify_code", authCode);
      session.setAttribute("verify_email", email);

      return ResponseEntity.ok("인증번호를 전송했습니다.");
  }
    @PostMapping("/univ/verifyCode")
    public ResponseEntity<Map<String, Object>> verifySignupCode(@RequestBody Map<String, String> payload, HttpSession session) {
        String code = payload.get("code");
        String email = payload.get("email");

        String sessionCode = (String) session.getAttribute("verify_code");
        String sessionEmail = (String) session.getAttribute("verify_email");

        Map<String, Object> result = new HashMap<>();

        if (sessionCode != null && sessionCode.equals(code) && sessionEmail != null && sessionEmail.equals(email)) {
            result.put("sw", true);
            result.put("msg", "성공");
        } else {
            result.put("sw", false);
            result.put("msg", "인증번호 불일치 또는 만료");
        }

        return ResponseEntity.ok(result);
    }


    /** 회원가입 */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserDTO userDTO) {
        Map<String, Object> result = new HashMap<>();
        if (userService.checkID(userDTO.getUserId())) {
            result.put("sw", false);
            result.put("msg", "중복된 ID입니다.");
        } else {
            userService.create(userDTO);
            result.put("sw", true);
            result.put("msg", "회원가입 완료!");
        }
        return result;
    }

    /** 아이디 중복확인 */
    @GetMapping("/checkId")
    public ResponseEntity<Map<String, Object>> checkId(@RequestParam(name = "userId", defaultValue = "") String userId) {
        boolean isDuplicated = userService.checkID(userId);
        Map<String, Object> result = new HashMap<>();
        if (isDuplicated) {
            result.put("sw", false);
            result.put("msg", "중복된 ID입니다.");
        } else {
            result.put("sw", true);
            result.put("msg", "사용 가능한 ID입니다.");
        }
        return ResponseEntity.ok(result);
    }

    /** 로그인 */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody UserDTO userDTO, HttpSession session, HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        boolean success = userService.login(userDTO, session);

        if (success) {
            UserDTO loginUser = userService.getUserById(userDTO.getUserId());
            System.out.println(loginUser);
            session.setAttribute("userno", loginUser.getUserno());
            session.setAttribute("username", loginUser.getUsername());
            session.setAttribute("schoolno", loginUser.getSchoolno());
            
         // IP & User-Agent
            String ip = request.getHeader("X-Forwarded-For");
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
                ip = request.getHeader("Proxy-Client-IP");  
            }  
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
                ip = request.getHeader("WL-Proxy-Client-IP");  
            }  
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
                ip = request.getHeader("HTTP_CLIENT_IP");  
            }  
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
                ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
            }  
            if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
                ip = request.getRemoteAddr();  
            }
            
            String detail = "로그인 성공 | IP: " + ip;
            // 로그인 로그
            activityLogService.logLogin(loginUser.getUserno(), detail);

//            result.put("sw", true);
//            result.put("msg", "로그인 성공!");
//            result.put("userno", loginUser.getUserno());
//            result.put("username", loginUser.getUsername());
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userno", loginUser.getUserno());
            userInfo.put("username", loginUser.getUsername());
            
            result.put("sw", true);
            result.put("msg", "로그인 성공!");
            result.put("user", userInfo); 
        } else {
            result.put("sw", false);
            result.put("msg", "로그인 실패!");
        }

        return result;
    }

    /** 세션 확인 */
    @GetMapping("/session")
    public Map<String, Object> getSessionUser(HttpSession session) {
        Map<String, Object> result = new HashMap<>();
        Long userno = (Long) session.getAttribute("userno");

        if (userno == null) {
            result.put("sw", false);
            result.put("msg", "로그인 상태가 아닙니다.");
        } else {
          UserDTO userDTO = userService.getUserByNo(userno);
          result.put("sw", true);
          result.put("user", userDTO); //  DTO 사용 → 직렬화 안전
        }
        return result;
    }

    /** 로그아웃 */
    @GetMapping("/logout")
    public Map<String, Object> logout(HttpSession session, HttpServletRequest request) {
       // 세션 없애기전에 로그
        Long userno = (Long) session.getAttribute("userno");
        if (userno != null) {
          // IP & User-Agent
          String ip = request.getHeader("X-Forwarded-For");
          if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
              ip = request.getHeader("Proxy-Client-IP");  
          }  
          if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
              ip = request.getHeader("WL-Proxy-Client-IP");  
          }  
          if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
              ip = request.getHeader("HTTP_CLIENT_IP");  
          }  
          if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
              ip = request.getHeader("HTTP_X_FORWARDED_FOR");  
          }  
          if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {  
              ip = request.getRemoteAddr();  
          }
          String detail = "로그아웃 | IP: " + ip ;
          // 로그아웃 기록
          activityLogService.logLogout(userno, detail);
        }
      
        session.invalidate();
        Map<String, Object> result = new HashMap<>();
        result.put("sw", false);
        result.put("msg", "로그아웃 완료!");
        return result;
    }

    /** 회원 정보 수정 */
//    @PutMapping("/update")
//    public Map<String, Object> update(@RequestBody UserDTO userDTO, HttpSession session) {
//        Long userno = (Long) session.getAttribute("userno");
//        userService.updateProfile(userno, userDTO);
//        User updatedUser = userService.findByIdOrThrow(userno);
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("sw", true);
//        result.put("msg", "회원정보 수정 완료!");
//        result.put("user", updatedUser);  // 엔티티 통째로 반환
//
//        return result;
//    }
    @PostMapping("/update")
    public ResponseEntity<?> updateUserWithProfile(
            @ModelAttribute UserUpdateDTO userDTO,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            HttpSession session) {

        Long userno = (Long) session.getAttribute("userno");
        try {
            userService.updateUserWithProfile(userno, userDTO, profileImage);
            UserDTO updatedUser = userService.getUserByNo(userno);

            return ResponseEntity.ok(Map.of(
                "sw", true,
                "msg", "회원 정보 수정 완료",
                "user", updatedUser
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "sw", false,
                "msg", e.getMessage()
            ));
        }
    }
    
    /** 아이디 찾기*/
    @PostMapping("/findId")
    public Map<String, Object> findId(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email"); // 또는 phone

        UserDTO user = userService.findByUsernameAndEmail(username, email);

        Map<String, Object> result = new HashMap<>();
        if (user != null) {
            result.put("sw", true);
            result.put("msg", "아이디 찾기 성공");
            result.put("userId", user.getUserId());
        } else {
            result.put("sw", false);
            result.put("msg", "일치하는 정보가 없습니다.");
        }
        return result;
    }
    
    // 1) 인증번호 발송
    @PostMapping("/sendCode")
    public Map<String, Object> sendVerificationCode(@RequestBody Map<String, String> payload, HttpSession session) {
        String username = payload.get("username");
        String email = payload.get("email");

        String code = String.valueOf((int) (Math.random() * 900000) + 100000); // 6자리 인증번호

        // 이메일 전송
        boolean sent = mailService.sendAuthCode(email, code);

        Map<String, Object> result = new HashMap<>();
        if (sent) {
            // 세션에 인증정보 저장
            session.setAttribute("verify_code", code);
            session.setAttribute("verify_username", username);
            session.setAttribute("verify_email", email);

            result.put("sw", true);
            result.put("msg", "인증번호가 이메일로 발송되었습니다.");
        } else {
            result.put("sw", false);
            result.put("msg", "인증번호 전송 실패 (메일 오류)");
        }

        return result;
    }

    // 2) 인증번호 확인 + 아이디 찾기
    @PostMapping("/verifyCode")
    public Map<String, Object> verifyCode(@RequestBody Map<String, String> payload, HttpSession session) {
        String code = payload.get("code");
        String username = payload.get("username");
        String email = payload.get("email");

        String sessionCode = (String) session.getAttribute("verify_code");
        String sessionUsername = (String) session.getAttribute("verify_username");
        String sessionEmail = (String) session.getAttribute("verify_email");

        Map<String, Object> result = new HashMap<>();
        if (sessionCode != null && sessionCode.equals(code)
                && sessionUsername.equals(username)
                && sessionEmail.equals(email)) {

            UserDTO user = userService.findByUsernameAndEmail(username, email);
            if (user != null) {
                result.put("sw", true);
                result.put("msg", "인증 성공");
                result.put("userId", user.getUserId());
            } else {
                result.put("sw", false);
                result.put("msg", "일치하는 사용자 없음");
            }
        } else {
            result.put("sw", false);
            result.put("msg", "인증번호 불일치 또는 만료");
        }

        return result;
    }
    //1 
    @PostMapping("/verifyCodePwd")
    public Map<String, Object> verifyCodeForPwd(@RequestBody Map<String, String> payload, HttpSession session) {
        String code = payload.get("code");
        String username = payload.get("username");
        String userId = payload.get("userId");  // 추가
        String email = payload.get("email");

        String sessionCode = (String) session.getAttribute("verify_code");
        String sessionUsername = (String) session.getAttribute("verify_username");
        String sessionUserId = (String) session.getAttribute("verify_userId");
        String sessionEmail = (String) session.getAttribute("verify_email");

        Map<String, Object> result = new HashMap<>();
        if (sessionCode != null && sessionCode.equals(code)
                && sessionUsername.equals(username)
                && sessionUserId.equals(userId)
                && sessionEmail.equals(email)) {
            result.put("sw", true);
            result.put("msg", "비밀번호 찾기 인증 성공");
        } else {
            result.put("sw", false);
            result.put("msg", "인증 실패");
        }

        return result;
    }
    //2 
    @PostMapping("/sendCodePwd")
    public Map<String, Object> sendCodeForPwd(@RequestBody Map<String, String> payload, HttpSession session) {
        String username = payload.get("username");
        String userId = payload.get("userId");
        String email = payload.get("email");

        String code = String.valueOf((int) (Math.random() * 900000) + 100000);

        boolean sent = mailService.sendAuthCode(email, code);

        Map<String, Object> result = new HashMap<>();
        if (sent) {
            session.setAttribute("verify_code", code);
            session.setAttribute("verify_username", username);
            session.setAttribute("verify_userId", userId);
            session.setAttribute("verify_email", email);
            result.put("sw", true);
            result.put("msg", "비밀번호 찾기용 인증번호 발송");
        } else {
            result.put("sw", false);
            result.put("msg", "인증번호 전송 실패");
        }

        return result;
    }
 // 3) 비밀번호 재설정 - 인증 후 새로운 비밀번호 등록
    @PostMapping("/resetPwd")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> payload, HttpSession session) {
        String code = payload.get("code");
        String username = payload.get("username");
        String userId = payload.get("userId");
        String email = payload.get("email");
        String newPassword = payload.get("newPassword");

        String sessionCode = (String) session.getAttribute("verify_code");
        String sessionUsername = (String) session.getAttribute("verify_username");
        String sessionEmail = (String) session.getAttribute("verify_email");
        String sessionId = (String) session.getAttribute("verify_userId");

        Map<String, Object> result = new HashMap<>();
        if (sessionCode != null && sessionCode.equals(code)
                && sessionUsername.equals(username)
                && sessionEmail.equals(email)
                && sessionId.equals(userId)){

            boolean updated = userService.updatePassword(username, userId,email, newPassword);

            if (updated) {
                result.put("sw", true);
                result.put("msg", "비밀번호가 성공적으로 변경되었습니다.");
            } else {
                result.put("sw", false);
                result.put("msg", "사용자 정보가 일치하지 않습니다.");
            }
        } else {
            result.put("sw", false);
            result.put("msg", "인증번호 불일치 또는 만료됨");
        }

        return result;
    }
    /** 회원 탈퇴 */
    @DeleteMapping("/delete")
    public Map<String, Object> delete(HttpSession session) {
        Long userno = (Long) session.getAttribute("userno");
        userService.delete(userno);
        session.invalidate();

        Map<String, Object> result = new HashMap<>();
        result.put("sw", true);
        result.put("msg", "회원 탈퇴 완료!");
        return result;
    }
    
    /**
     * 유저 소프트 삭제 (탈퇴 처리)
     * DELETE /users/{userno}/soft-delete
     */
    @PatchMapping("/{userno}/deactivate")
    public ResponseEntity<?> softDeleteUser(@PathVariable(name="userno") Long userno) {
        userService.softDeleteUser(userno);
        return ResponseEntity.ok("탈퇴 처리 완료");
    }
    
    // 관리자 페이지용 유저 불러오기 페이징 검색기능 추가
    @GetMapping("/admin/users")
    public Page<UserDTO> getUsers(
        @RequestParam(name="keyword", defaultValue ="") String keyword,
        @PageableDefault(size = 5, sort = {"userno"}) Pageable pageable
    ) {
        Page<User> userPage = userService.findByKeyword(keyword, pageable);
        return userPage.map(user -> new UserDTO(user)); // DTO 변환
    }
    /** 관리자용 회원 정보 수정 */
    @PutMapping("/admin/update/{userno}")
    public ResponseEntity<?> adminUpdateUser(@PathVariable(name="userno") Long userno, @RequestBody UserDTO userDTO) {
        try {
            userService.adminUpdateUser(userno, userDTO);
            return ResponseEntity.ok(Map.of("sw", true, "msg", "회원 정보 수정 완료"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("sw", false, "msg", e.getMessage()));
        }
    }

    /** 관리자용 회원 삭제 */
    @DeleteMapping("/admin/delete/{userno}")
    public ResponseEntity<Map<String, Object>> adminDeleteUser(@PathVariable(name="userno") Long userno) {
        Map<String, Object> result = new HashMap<>();
        try {
            userService.deleteUserByUserno(userno);
            result.put("sw", true);
            result.put("msg", "사용자 삭제 완료");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("sw", false);
            result.put("msg", "삭제 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }       
    }
   // 사용자 상세
    @GetMapping("/admin/detail/{userno}")
    public ResponseEntity<UserDetailDTO> getUserDetail(@PathVariable(name="userno") Long userno) {
        UserDetailDTO detail = userService.getUserDetail(userno);
        return ResponseEntity.ok(detail);
    }
    
    //사용자 리뷰
    @GetMapping("/admin/{userno}/reviews")
    public Page<ReviewDTO> getUserGivenReviews(@PathVariable(name="userno")  Long userno, Pageable pageable) {
        return reviewService.getReviewsByGiverUserno(userno, pageable);
    }
    
 // 공개 사용자 프로필 조회 (비로그인도 접근 가능)
    @GetMapping("/public/detail/{userno}")
    public ResponseEntity<UserDetailDTO> getPublicUserDetail(@PathVariable(name = "userno") Long userno) {
        UserDetailDTO detail = userService.getUserDetail(userno);
        return ResponseEntity.ok(detail);
    }

    
    
}