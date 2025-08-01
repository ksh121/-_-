package dev.mvc.team5.reservations;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.team5.places.Places;
import dev.mvc.team5.places.PlacesRepository;
import lombok.RequiredArgsConstructor;

// 📌 AI 챗봇 또는 프론트엔드에서 사용하는 예약 관련 REST API 컨트롤러
@RestController
@RequestMapping("/reservations/api")
@RequiredArgsConstructor
public class ReservationsChatBotController {

    private final ReservationsService reservationsService;
    private final PlacesRepository placesRepository;

    /**
     * 📍 장소 이름(placename)으로 장소 번호(placeno)를 조회하는 API
     * 예: GET /reservations/api/placeno?placename=강남 풋살장
     * 응답: { "placeno": 3 }
     */
    @GetMapping("/placeno")
    public ResponseEntity<Map<String, Object>> getPlaceNo(@RequestParam(name="placename") String placename) {
        if (placename == null || placename.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "placename 파라미터가 필요합니다."));
        }

        Places place = placesRepository.findByPlacenameIgnoreCase(placename.trim());
        if (place == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("error", "해당 장소를 찾을 수 없습니다.", "placeno", null));
        }

        return ResponseEntity.ok(Map.of("placeno", place.getPlaceno()));
    }

    /**
     * 📍 특정 시간에 장소가 예약 가능한지 확인하는 API
     * 예: GET /reservations/api/conflict?placeno=3&start=2025-08-02T15:00&end=2025-08-02T17:00
     * 응답: { "conflict": true }  → 겹치는 예약 있음
     */
    @GetMapping("/conflict")
    public ResponseEntity<Map<String, Object>> checkConflict(
            @RequestParam(name = "placeno") Long placeno,
            @RequestParam(name = "start") LocalDateTime start,
            @RequestParam(name = "end") LocalDateTime end
    ) {
        if (start == null || end == null || placeno == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "placeno, start, end는 필수 파라미터입니다."));
        }

        if (!start.isBefore(end)) {
            return ResponseEntity.badRequest().body(Map.of("error", "시작 시간은 종료 시간보다 빨라야 합니다."));
        }

        List<Reservations> conflicts = reservationsService.findChatConflict(placeno, start, end);
        boolean hasConflict = !conflicts.isEmpty();

        return ResponseEntity.ok(Map.of(
                "conflict", hasConflict,
                "message", hasConflict ? "해당 시간대에 이미 예약이 있습니다." : "예약 가능합니다."
        ));
    }

    /**
     * 📍 예약 생성 API
     * 예: POST /reservations/api/create
     * 요청 바디:
     * {
     *   "userno": 1,
     *   "placeno": 3,
     *   "start_time": "2025-08-02T15:00:00",
     *   "end_time": "2025-08-02T17:00:00",
     *   "placesinfo": "강남 풋살장",
     *   "status": "예약됨"
     * }
     * 응답: 예약 결과 DTO
     */
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody ReservationsRequestDTO dto) {
        System.out.println("🧪 받은 DTO: " + dto);  // toString()이 잘 되도록 Lombok @ToString 있으면 좋음
        // 기본 유효성 검증
        if (dto.getUserno() == null || dto.getPlaceno() == null ||
            dto.getStart_time() == null || dto.getEnd_time() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "필수 필드가 누락되었습니다."));
        }

        if (!dto.getStart_time().isBefore(dto.getEnd_time())) {
            return ResponseEntity.badRequest().body(Map.of("error", "시작 시간은 종료 시간보다 빨라야 합니다."));
        }

        try {
            ReservationsResponseDTO result = reservationsService.create(dto);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("error", "예약 중 오류가 발생했습니다."));
        }
    }
    
}
