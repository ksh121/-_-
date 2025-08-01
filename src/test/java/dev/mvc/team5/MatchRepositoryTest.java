//
//package dev.mvc.team5;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import java.time.LocalDateTime;
//
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//
//import dev.mvc.team5.match.Match;
//import dev.mvc.team5.match.MatchRepository;
//import dev.mvc.team5.school.School;
//import dev.mvc.team5.school.SchoolRepository;
//import dev.mvc.team5.talentcategrp.TalentCateGrp;
//import dev.mvc.team5.talentcategrp.TalentCateGrpRepository;
//import dev.mvc.team5.talentcategory.TalentCategory;
//import dev.mvc.team5.talentcategory.TalentCategoryRepository;
//import dev.mvc.team5.talenttype.TalentType;
//import dev.mvc.team5.talenttype.TalentTypeRepository;
//import dev.mvc.team5.talents.Talent;
//import dev.mvc.team5.talents.TalentRepository;
//import dev.mvc.team5.user.User;
//import dev.mvc.team5.user.UserRepository;
//
//@DataJpaTest
//public class MatchRepositoryTest {
//
//    @Autowired
//    private MatchRepository matchRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private TalentRepository talentRepository;
//
//    @Autowired
//    private SchoolRepository schoolRepository;
//    
//    @Autowired
//    private TalentCateGrpRepository talentCateGrpRepository;
//    
//    @Autowired
//    private TalentCategoryRepository talentCategoryRepository;
//    
//    @Autowired
//    private TalentTypeRepository talentTypeRepository;
//
//    private User giver;
//    private User receiver;
//    private Talent talent;
//    private School school;
//    private TalentCateGrp cateGrp;
//    private TalentCategory category;
//    private TalentType talentType;
//
//    @BeforeEach
//    void setup() {
//        // 학교 저장
//        school = schoolRepository.save(new School("테스트 학교"));
//
//        // 유저 저장 (필요한 생성자 만들어야 함)
//        giver = userRepository.save(new User("giver@example.com", "giver123", "기버", school));
//        receiver = userRepository.save(new User("receiver@example.com", "recv123", "리시버", school));
//        
//        // 대분류 그룹
//        cateGrp = talentCateGrpRepository.save(new TalentCateGrp("음악"));
//        
//        // 카테고리 
//        category = talentCategoryRepository.save(new TalentCategory(cateGrp, "기타"));
//        
//        // 재능기부/교환
//        talentType = talentTypeRepository.save(new TalentType("기부"));
//
//        // Talent 저장 (user, school 필수)
//        talent = talentRepository.save(new Talent(giver, school, talentType, category,
//                "기타 레슨", "자세히 알려드려요", "Korean"));
//    }
//
////package dev.mvc.team5;
////
////import static org.assertj.core.api.Assertions.assertThat;
////
////import java.time.LocalDateTime;
////
////import org.junit.jupiter.api.BeforeEach;
////import org.junit.jupiter.api.DisplayName;
////import org.junit.jupiter.api.Test;
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
////
////import dev.mvc.team5.match.Match;
////import dev.mvc.team5.match.MatchRepository;
////import dev.mvc.team5.school.School;
////import dev.mvc.team5.school.SchoolRepository;
////import dev.mvc.team5.talentcategrp.TalentCateGrp;
////import dev.mvc.team5.talentcategrp.TalentCateGrpRepository;
////import dev.mvc.team5.talentcategory.TalentCategory;
////import dev.mvc.team5.talentcategory.TalentCategoryRepository;
////import dev.mvc.team5.talenttype.TalentType;
////import dev.mvc.team5.talenttype.TalentTypeRepository;
////import dev.mvc.team5.talents.Talent;
////import dev.mvc.team5.talents.TalentRepository;
////import dev.mvc.team5.user.User;
////import dev.mvc.team5.user.UserRepository;
////
////@DataJpaTest
////public class MatchRepositoryTest {
////
////    @Autowired
////    private MatchRepository matchRepository;
////
////    @Autowired
////    private UserRepository userRepository;
////
////    @Autowired
////    private TalentRepository talentRepository;
////
////    @Autowired
////    private SchoolRepository schoolRepository;
////    
////    @Autowired
////    private TalentCateGrpRepository talentCateGrpRepository;
////    
////    @Autowired
////    private TalentCategoryRepository talentCategoryRepository;
////    
////    @Autowired
////    private TalentTypeRepository talentTypeRepository;
////
////    private User giver;
////    private User receiver;
////    private Talent talent;
////    private School school;
////    private TalentCateGrp cateGrp;
////    private TalentCategory category;
////    private TalentType talentType;
////
////    @BeforeEach
////    void setup() {
////        // 학교 저장
////        school = schoolRepository.save(new School("테스트 학교"));
////
////        // 유저 저장 (필요한 생성자 만들어야 함)
////        giver = userRepository.save(new User("giver@example.com", "giver123", "기버", school));
////        receiver = userRepository.save(new User("receiver@example.com", "recv123", "리시버", school));
////        
////        // 대분류 그룹
////        cateGrp = talentCateGrpRepository.save(new TalentCateGrp("음악"));
////        
////        // 카테고리 
////        category = talentCategoryRepository.save(new TalentCategory(cateGrp, "기타"));
////        
////        // 재능기부/교환
////        talentType = talentTypeRepository.save(new TalentType("기부"));
////
////        // Talent 저장 (user, school 필수)
////        talent = talentRepository.save(new Talent(giver, school, talentType, category,
////                "기타 레슨", "자세히 알려드려요", "Korean"));
////    }
//
////
////    @Test
////    @DisplayName("매칭 생성 및 저장 테스트")
////    void testSaveMatch() {
////        LocalDateTime completedTime = LocalDateTime.now();
////        Match match = new Match(giver, receiver, talent, completedTime);
////
////        Match saved = matchRepository.save(match);
////
////        assertThat(saved.getMatchno()).isNotNull();
////        assertThat(saved.getGiver().getUserno()).isEqualTo(giver.getUserno());
////        assertThat(saved.getReceiver().getUserno()).isEqualTo(receiver.getUserno());
////        assertThat(saved.getTalent().getTalentno()).isEqualTo(talent.getTalentno());
////        
////        Match saved1 = matchRepository.saveAndFlush(match);  // saveAndFlush로 즉시 DB 반영
////        assertThat(saved1.getStartedAt()).isNotNull(); // @CreationTimestamp 확인
////        
////        assertThat(saved.getCompletedAt()).isEqualTo(completedTime);        
////    }
//
//}
//
////}
//
