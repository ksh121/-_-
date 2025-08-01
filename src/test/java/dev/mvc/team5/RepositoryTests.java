//package dev.mvc.team5;
//
//import dev.mvc.team5.entity.*;
//import dev.mvc.team5.repository.*;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.time.LocalDateTime;
//
//@SpringBootTest(classes = MyApplication.class)
//public class RepositoryTests {
//
//    @Autowired
//    private SchoolRepository schoolRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private TalentTypeRepository talentTypeRepository;
//
//    @Autowired
//    private TalentCateGrpRepository cateGrpRepository;
//
//    @Autowired
//    private TalentCategoryRepository categoryRepository;
//
//    @Autowired
//    private TalentRepository talentRepository;
//
//    @Test
//    public void testSaveAndFindTalent() {
//        // 학교
//        School school = new School(1L, "테스트대학교");
//        schoolRepository.save(school);
//
//        // 사용자
//        User user = new User(1L, school);
//        userRepository.save(user);
//
//        // 재능 유형
//        TalentType type = new TalentType(1L, "음악", 0);
//        talentTypeRepository.save(type);
//
//        // 카테고리 그룹
//        TalentCateGrp grp = new TalentCateGrp(1L, "악기", 0, "예술");
//        cateGrpRepository.save(grp);
//
//        // 카테고리
//        TalentCategory category = new TalentCategory(1L, grp, "기타", 0);
//        categoryRepository.save(category);
//
//        // 재능
//        Talent talent = new Talent(
//                1L, user, type, category, school,
//                "기타 수업", "1시간 기타 강의", "Korean", null, null
//        );
//        talentRepository.save(talent);
//
//        // 조회
//        Talent result = talentRepository.findById(1L).orElse(null);
//        System.out.println("조회 결과: " + result);
//    }
//}
