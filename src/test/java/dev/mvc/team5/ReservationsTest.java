//package dev.mvc.team5;
//
//
//
//import static org.assertj.core.api.Assertions.assertThat;
//
//import java.time.LocalDateTime;
//
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import dev.mvc.team5.places.Places;
//import dev.mvc.team5.places.PlacesRepository;
//import dev.mvc.team5.reservations.Reservations;
//import dev.mvc.team5.reservations.ReservationsRepository;
//import dev.mvc.team5.schoolgwan.SchoolGwan;
//import dev.mvc.team5.schoolgwan.SchoolGwanRepository;
//import dev.mvc.team5.user.User;
//import dev.mvc.team5.user.UserRepository;
//import jakarta.transaction.Transactional;
//
//@SpringBootTest
//@Transactional
//public class ReservationsTest {
//
//    @Autowired
//    private SchoolGwanRepository schoolGwanRepository;
//
//    @Autowired
//    private PlacesRepository placesRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private ReservationsRepository reservationsRepository;
//
//    @Test
//    public void testPlaceAndReservationSave() {
//        // 1. SchoolGwan 엔티티 생성 및 저장
//        SchoolGwan schoolGwan = new SchoolGwan();
//        schoolGwan.setSchoolgwanname("Main Campus");
//        schoolGwan = schoolGwanRepository.save(schoolGwan);
//
//        // 2. Places 엔티티 생성 및 저장
//        Places place = new Places(
//                schoolGwan,
//                "Lecture Room A",
//                "101",
//                null, // start_time 강의시간 고려하지 않음
//                null  // end_time 강의시간 고려하지 않음
//        );
//        place = placesRepository.save(place);
//
//        // 3. User 엔티티 생성 및 저장 (간단히)
//        User user = new User();
//        user.setUsername("testuser");
//        user = userRepository.save(user);
//
//        // 4. Reservations 엔티티 생성 및 저장
//        LocalDateTime now = LocalDateTime.now();
//        Reservations reservation = new Reservations(
//                user,
//                place,
//                now.plusDays(1),
//                now.plusDays(1).plusHours(2),
//                "Test reservation",
//                "PENDING"
//        );
//        reservation = reservationsRepository.save(reservation);
//
//        // 5. 저장된 데이터 조회 및 검증
//        Reservations findReservation = reservationsRepository.findById(reservation.getReservationno()).orElse(null);
//        assertThat(findReservation).isNotNull();
//        assertThat(findReservation.getPlace().getPlacename()).isEqualTo("Lecture Room A");
//        assertThat(findReservation.getUser().getUsername()).isEqualTo("testuser");
//        assertThat(findReservation.getStatus()).isEqualTo("PENDING");
//    }
//}
