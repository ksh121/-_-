//package dev.mvc.team5;
//
//import dev.mvc.team5.entity.School;
//import dev.mvc.team5.entity.User;
//import dev.mvc.team5.repository.SchoolRepository;
//import dev.mvc.team5.repository.UserRepository;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//@SpringBootTest
//class SchoolUserRelationTest {
//
//    @Autowired
//    private SchoolRepository schoolRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    @Transactional
//    void testSchoolAndUserRelation() {
//        // 1. 학교 생성
//        School school = new School();
//        school.setSchoolname("테스트 학교");
//
//        // 2. 학생(User) 2명 생성 & 편의 메서드로 쌍방 연결
//        User user1 = new User();
//        user1.setName("홍길동");
//
//        User user2 = new User();
//        user2.setName("김철수");
//
//        school.addUser(user1);
//        school.addUser(user2);
//
//        // 부모만 save -> 자식도 자동 save
//        schoolRepository.save(school);
//
//        // 3. School -> Users 양방향 조회
//        School savedSchool = schoolRepository.findById(school.getSchoolno()).orElseThrow();
//        List<User> users = savedSchool.getUsers();
//
//        assertThat(users).hasSize(2);
//        assertThat(users).extracting(User::getName).containsExactlyInAnyOrder("홍길동", "김철수");
//
//        // 4. User -> School 단방향 조회
//        User savedUser = userRepository.findById(user1.getUserno()).orElseThrow();
//        assertThat(savedUser.getSchool().getSchoolname()).isEqualTo("테스트 학교");
//    }
//
//}
