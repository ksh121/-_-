package dev.mvc.team5.review;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reviews") // URL prefix
public class ReviewController {

    @Autowired
    private ReviewService service;
    
    private final RestTemplate restTemplate;

    public ReviewController() {
        this.restTemplate = new RestTemplate();
    }
    
    // 모든 리뷰 조회
    @GetMapping
    public List<ReviewDTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }
    
 //특정 재능(talentno)에 대한 리뷰 목록 조회 (페이징)
    @GetMapping("/talent/{talentno}")
    public Page<ReviewDTO> getReviewsForTalent(@PathVariable("talentno") Long talentno,
                                                    @PageableDefault(size = 5, sort = {"createdAt", "reviewno"}) Pageable pageable) {
        return service.getReviewsByTalentno(talentno, pageable);
    }
    // 재능 게시물에 대한 리뷰 작성
    //리뷰를 생성할 때 `talentno`를 필수로 전달.
    @PostMapping("/talent")
    public ResponseEntity<ReviewDTO> createTalentReview(@RequestBody ReviewDTO reviewDTO) {
        // ReviewDTO에 talentno가 포함되어야 합니다.
        if (reviewDTO.getTalentno() == null) {
            return ResponseEntity.badRequest().build(); // talentno가 없으면 오류 반환
        }
        Review savedReview = service.saveTalentReview(reviewDTO); // saveTalentReview를 호출해도 됨
        return ResponseEntity.ok(service.convertToDTO(savedReview));
    }

    // 특정 리뷰 ID 조회
    @GetMapping("/{id}")
    public ReviewDTO get(@PathVariable("id") Long id) {
        return toDTO(service.findById(id).orElseThrow());
    }

    // 특정 작성자(userno) 기준 리뷰 목록 조회
    @GetMapping("/giver/{userno}")
    public List<ReviewDTO> getByGiver(@PathVariable("userno") Long userno) {
        return service.findByGiver(userno).stream().map(this::toDTO).collect(Collectors.toList());
    }

    // 특정 대상자(userno) 기준 리뷰 목록 조회
//    @GetMapping("/receiver/{userno}")
//    public List<ReviewDTO> getByReceiver(@PathVariable("userno") Long userno) {
//        return service.findByReceiver(userno).stream().map(this::toDTO).collect(Collectors.toList());
//    }
    
    // 정 대상자(userno) 기준 리뷰 목록 조회 ,페이징
    @GetMapping("/receiver/{userno}")
    public List<ReviewDTO> getByReceiver(@PathVariable("userno") Long userno,
                                    @PageableDefault(size = 5, sort = {"createdAt", "reviewno"}) Pageable pageable) {
        return service.findByReceiver(userno).stream().map(this::toDTO).collect(Collectors.toList());
    }

    // 리뷰 생성
    @PostMapping
    public ReviewDTO create(@RequestBody ReviewDTO dto) {
        // ① service.save(dto)는 Review 엔티티를 리턴하도록
        Review saved = service.save(dto);
        // ② 엔티티 → DTO 변환
        return service.convertToDTO(saved);
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Long id) {
        service.delete(id);
    }

    // Review 엔티티 → DTO로 변환
    private ReviewDTO toDTO(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewno(r.getReviewno());
        dto.setGiver(r.getGiver().getUserno());
        dto.setGivername(r.getGiver().getName());
        dto.setReceiver(r.getReceiver().getUserno());
        dto.setRating(r.getRating());
        dto.setComments(r.getComments());
        dto.setCreatedAt(r.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return dto;
    }
 // ⭐ 기존 review_ai_server.py의 엔드포인트에 맞게 URL 업데이트 ⭐
    @PostMapping("/summary/receiver")
    public ResponseEntity<Map<String, String>> getReviewSummary(@RequestBody Map<String, Object> requestBody) {
        // receiverNo를 Map에서 추출 (프런트에서 함께 보내줘야 함)
        // Integer 타입으로 캐스팅
        Integer receiverNo = (Integer) requestBody.get("receiverNo"); 
        
        // reviewComments를 List<String> 타입으로 캐스팅
        @SuppressWarnings("unchecked")
        List<String> reviewComments = (List<String>) requestBody.get("reviewComments");
        
        // ⭐ 로그 추가: 프런트엔드에서 받은 데이터 확인 ⭐
        System.out.println("Spring Boot - 받은 receiverNo: " + receiverNo);
        System.out.println("Spring Boot - 받은 reviewComments: " + reviewComments);

        if (receiverNo == null || reviewComments == null || reviewComments.isEmpty()) {
            System.out.println("Spring Boot - receiverNo 또는 reviewComments가 유효하지 않습니다.");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "유효한 요청 데이터(receiverNo, reviewComments)가 필요합니다.");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        // ⭐ Python AI 서버의 요약 API URL ⭐
        String pythonApiUrl = "http://localhost:5001/summarize-reviews"; // review_ai_server.py의 엔드포인트

        try {
            // Python API에 보낼 요청 바디 생성
            // Python 서버는 reviewComments만 필요하므로 이 필드만 보냅니다.
            Map<String, List<String>> requestToPython = new HashMap<>();
            requestToPython.put("reviewComments", reviewComments); 
            
            // ⭐ 로그 추가: Python으로 전송할 데이터 확인 ⭐
            System.out.println("Spring Boot - Python으로 전송할 데이터: " + requestToPython);

            // Python AI 서버 호출
            // 캐싱을 사용한다면 reviewService.getAiReviewSummary(receiverNo, reviewComments, reviewsHashCode) 호출
            ResponseEntity<Map> pythonResponse = restTemplate.postForEntity(pythonApiUrl, requestToPython, Map.class);

            if (pythonResponse.getStatusCode() == HttpStatus.OK && pythonResponse.getBody() != null) {
                String summary = (String) pythonResponse.getBody().get("summary");
                Map<String, String> successResponse = new HashMap<>();
                successResponse.put("summary", summary);
                return new ResponseEntity<>(successResponse, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "AI 서버에서 요약을 가져오는 데 실패했습니다.");
                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            System.err.println("AI 서버 호출 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "AI 서버와 통신 중 오류가 발생했습니다: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 프로필카드에서 띄울 짧은 요약
    @PostMapping("/summary/receiver_profile")
    public ResponseEntity<Map<String, String>> getReviewProfileSummary(@RequestBody Map<String, Object> requestBody) {
        // receiverNo를 Map에서 추출 (프런트에서 함께 보내줘야 함)
        // Integer 타입으로 캐스팅
        Integer receiverNo = (Integer) requestBody.get("receiverNo"); 
        
        // reviewComments를 List<String> 타입으로 캐스팅
        @SuppressWarnings("unchecked")
        List<String> reviewComments = (List<String>) requestBody.get("reviewComments");
        
        // ⭐ 로그 추가: 프런트엔드에서 받은 데이터 확인 ⭐
        System.out.println("Spring Boot - 받은 receiverNo: " + receiverNo);
        System.out.println("Spring Boot - 받은 reviewComments: " + reviewComments);

        if (receiverNo == null || reviewComments == null || reviewComments.isEmpty()) {
            System.out.println("Spring Boot - receiverNo 또는 reviewComments가 유효하지 않습니다.");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "유효한 요청 데이터(receiverNo, reviewComments)가 필요합니다.");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        // ⭐ Python AI 서버의 요약 API URL ⭐
        String pythonApiUrl = "http://localhost:5001/summarize-reviews-profile"; // review_ai_server.py의 엔드포인트

        try {
            // Python API에 보낼 요청 바디 생성
            // Python 서버는 reviewComments만 필요하므로 이 필드만 보냅니다.
            Map<String, List<String>> requestToPython = new HashMap<>();
            requestToPython.put("reviewComments", reviewComments); 
            
            // ⭐ 로그 추가: Python으로 전송할 데이터 확인 ⭐
            System.out.println("Spring Boot - Python으로 전송할 데이터: " + requestToPython);

            // Python AI 서버 호출
            // 캐싱을 사용한다면 reviewService.getAiReviewSummary(receiverNo, reviewComments, reviewsHashCode) 호출
            ResponseEntity<Map> pythonResponse = restTemplate.postForEntity(pythonApiUrl, requestToPython, Map.class);

            if (pythonResponse.getStatusCode() == HttpStatus.OK && pythonResponse.getBody() != null) {
                String summary = (String) pythonResponse.getBody().get("summary");
                Map<String, String> successResponse = new HashMap<>();
                successResponse.put("summary", summary);
                return new ResponseEntity<>(successResponse, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "AI 서버에서 요약을 가져오는 데 실패했습니다.");
                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            System.err.println("AI 서버 호출 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "AI 서버와 통신 중 오류가 발생했습니다: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PostMapping("/summary/talent") // 새로운 엔드포인트 경로
    public ResponseEntity<Map<String, String>> getReviewSummaryByTalent(@RequestBody Map<String, Object> requestBody) {
        Long talentNo = null;
        Object talentNoObj = requestBody.get("talentNo");
        if (talentNoObj instanceof Integer) {
            talentNo = ((Integer) talentNoObj).longValue();
        } else if (talentNoObj instanceof Long) {
            talentNo = (Long) talentNoObj;
        }

        @SuppressWarnings("unchecked")
        List<String> reviewComments = (List<String>) requestBody.get("reviewComments");

        System.out.println("Spring Boot - [By Talent] 받은 talentNo: " + talentNo);
        System.out.println("Spring Boot - [By Talent] 받은 reviewComments: " + reviewComments);

        if (talentNo == null || reviewComments == null || reviewComments.isEmpty()) {
            System.out.println("Spring Boot - [By Talent] talentNo 또는 reviewComments가 유효하지 않습니다.");
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "유효한 요청 데이터(talentNo, reviewComments)가 필요합니다.");
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        String pythonApiUrl = "http://localhost:5001/summarize-reviews"; // AI 서버 URL

        try {
            Map<String, Object> requestToPython = new HashMap<>();
            requestToPython.put("reviewComments", reviewComments);
            requestToPython.put("talentNo", talentNo); // AI 서버로 talentNo 전달

            System.out.println("Spring Boot - [By Talent] Python으로 전송할 데이터: " + requestToPython);

            ResponseEntity<Map> pythonResponse = restTemplate.postForEntity(pythonApiUrl, requestToPython, Map.class);

            if (pythonResponse.getStatusCode() == HttpStatus.OK && pythonResponse.getBody() != null) {
                String summary = (String) pythonResponse.getBody().get("summary");
                Map<String, String> successResponse = new HashMap<>();
                successResponse.put("summary", summary);
                return new ResponseEntity<>(successResponse, HttpStatus.OK);
            } else {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "[By Talent] AI 서버에서 요약을 가져오는 데 실패했습니다.");
                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            System.err.println("[By Talent] AI 서버 호출 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "[By Talent] AI 서버와 통신 중 오류가 발생했습니다: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // 리뷰 평점만 가져오기
    @GetMapping("/average-rating/{talentno}")
    public double getAverageRating(@PathVariable(name="talentno") Long talentno) {
        return service.getAverageRatingForTalent(talentno);
    }

}