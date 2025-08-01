//package dev.mvc.team5;
//
//import java.util.Optional;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import dev.mvc.team5.places.Places;
//import dev.mvc.team5.places.PlacesRepository;
//import dev.mvc.team5.school.School;
//import dev.mvc.team5.school.SchoolRepository;
//import dev.mvc.team5.schoolgwan.SchoolGwan;
//import dev.mvc.team5.schoolgwan.SchoolGwanRepository;
//
//
//
//
//@SpringBootTest
//public class PlacesTest {
//
//    @Autowired
//    private SchoolRepository schoolRepository;
//
//    @Autowired
//    private SchoolGwanRepository schoolGwanRepository;
//
//    @Autowired
//    private PlacesRepository placesRepository;
//
//    @Test
//    void createPlaceWithSchoolAndSchoolGwan() {
//        // 1. School 생성 및 저장
//        School school = new School("테스트 학교");
//        School savedSchool = schoolRepository.save(school);
//        System.out.println("✅ 저장된 학교 ID: " + savedSchool.getSchoolno());
//
//        // 2. SchoolGwan 생성 및 저장 (위에서 저장한 School 참조)
//        SchoolGwan schoolGwan = new SchoolGwan(savedSchool, "테스트 학관");
//        SchoolGwan savedGwan = schoolGwanRepository.save(schoolGwan);
//        System.out.println("✅ 저장된 학관 ID: " + savedGwan.getSchoolgwanno());
//
//        // 3. Places 생성 및 저장 (위에서 저장한 SchoolGwan 참조)
//        Places place = new Places(savedGwan, "강의실 101", "A-101", null, null);
//        Places savedPlace = placesRepository.save(place);
//        System.out.println("✅ 저장된 장소 ID: " + savedPlace.getPlace());
//
//        // 4. 저장한 Places 다시 조회
//        Optional<Places> retrievedPlaceOpt = placesRepository.findById(savedPlace.getPlace());
//        retrievedPlaceOpt.ifPresentOrElse(
//            p -> System.out.println("✅ 조회된 장소명: " + p.getPlacename()),
//            () -> System.out.println("❌ 장소 조회 실패")
//        );
//    }
//}
