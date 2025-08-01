//package dev.mvc.team5;
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import java.util.List;
//
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//
//import dev.mvc.team5.request.Request;
//import dev.mvc.team5.request.RequestRepository;
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
//import dev.mvc.team5.talenttype.TalentType;
//import dev.mvc.team5.talenttype.TalentTypeRepository;
//import dev.mvc.team5.tool.RequestStatus;
//import dev.mvc.team5.user.User;
//import dev.mvc.team5.user.UserRepository;
//
//@DataJpaTest
//public class RequestRepositoryTest {
//
//    @Autowired
//    private RequestRepository requestRepository;
//
//    @Autowired
//    private TalentRepository talentRepository;
//
//    @Autowired
//    private UserRepository userRepository;
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
//    @Test
//    @DisplayName("특정 Talent에 대한 요청 저장 및 상태별 조회 테스트")
//    void testSaveAndFindByStatus() {
//        // 학교 저장
//        School school = schoolRepository.save(new School("테스트 학교"));
//
//        // 사용자 저장
//        User giver = userRepository.save(new User("giver@example.com", "giver123", "기버", school));
//        User requester = userRepository.save(new User("requester@example.com", "req123", "요청자", school));
//        
//        // 대분류 그룹
//        TalentCateGrp cateGrp = talentCateGrpRepository.save(new TalentCateGrp("음악"));
//        
//        // 카테고리 
//        TalentCategory category = talentCategoryRepository.save(new TalentCategory(cateGrp, "기타"));
//        
//        // 재능기부/교환
//        TalentType talentType = talentTypeRepository.save(new TalentType("기부"));
//
//        // 재능 저장
//        Talent talent = talentRepository.save(new Talent(giver, school, talentType, category,
//            "기타 레슨", "자세히 알려드려요", "Korean"));
//
//
//        // 요청 저장
//        Request request1 = new Request(talent, requester, RequestStatus.PENDING, "첫번째 요청 메시지");
//        Request request2 = new Request(talent, requester, RequestStatus.ACCEPTED, "두번째 요청 메시지");
//
//        requestRepository.save(request1);
//        requestRepository.save(request2);
//
//        // 상태별 조회
//        List<Request> pendingRequests = requestRepository.findByStatus(RequestStatus.PENDING);
//        assertThat(pendingRequests).hasSize(1);
//        assertThat(pendingRequests.get(0).getMessage()).isEqualTo("첫번째 요청 메시지");
//
//        // Talent 기준 조회
//
//        List<Request> requestsByTalent = requestRepository.findByTalent_talentno(talent.getTalentno());
//        assertThat(requestsByTalent).hasSize(2);
//    }


//}
