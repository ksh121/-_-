package dev.mvc.team5;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import dev.mvc.team5.school.School;
import dev.mvc.team5.school.SchoolRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;

@SpringBootTest
class UserTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Test
    void createUserWithSchoolTest() {
        // 1) 학교 먼저 저장
        School school = new School();
        school.setSchoolname("테스트학교");
        School savedSchool = schoolRepository.save(school);

        // 2) 유저 생성 + 학교 연결
        User user = new User("testId", "1234", "홍길동", savedSchool);

        // 3) 저장
        User savedUser = userRepository.save(user);

        // 4) 검증
        assertThat(savedUser.getUserno()).isNotNull();
        assertThat(savedUser.getSchool()).isNotNull();
        assertThat(savedUser.getSchool().getSchoolname()).isEqualTo("테스트학교");
        
        // 로그인
        Optional<User> userOpt = userRepository.findByUserIdAndPassword("testId", "1234");
        if (userOpt.isPresent()) {
          System.out.println("회원 존재");
          System.out.println(userOpt.get().toString());
        } else {
          System.out.println("해당하는 회원 없음");
        }
        
        
    }
}