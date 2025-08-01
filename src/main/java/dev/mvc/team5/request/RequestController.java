package dev.mvc.team5.request;

import dev.mvc.team5.request.requestdto.RequestCreateDTO;
import dev.mvc.team5.request.requestdto.RequestListDTO;
import dev.mvc.team5.request.requestdto.RequestResponseDTO;
import dev.mvc.team5.tool.RequestStatus;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

/**
 * 요청 관련 API 컨트롤러
 * - 거래 요청 생성, 삭제, 상태 변경
 * - 검색 및 페이징 처리
 * - 채팅방 내 최근 요청 조회
 * - 사용자별 구매/판매 내역 조회
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/request")
public class RequestController {

    private final RequestService service;
    private final RequestRepository requestRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     *  거래 요청 생성
     *  요청 저장 후, 해당 채팅방 구독자에게 WebSocket 메시지 전송
     *
     * @param dto 요청 생성용 DTO
     * @return 저장된 요청 정보 DTO
     */
    @PostMapping(path="save")
    public ResponseEntity<RequestResponseDTO> createRequest(@RequestBody RequestCreateDTO dto) {
        System.out.println("받은 요청 DTO: " + dto);
        RequestResponseDTO savedDto = service.save(dto);

        // ✅ WebSocket: 채팅방 내 모든 사용자에게 실시간 요청 정보 전송
        messagingTemplate.convertAndSend(
            "/topic/chatroom/" + dto.getChatRoomno(),
            savedDto
        );

        return ResponseEntity.ok(savedDto);
    }

    /**
     *  요청 삭제
     * 
     * @param requestno 삭제할 요청 ID
     * @return 성공 메시지
     */
    @DeleteMapping("/delete/{requestno}")
    public ResponseEntity<String> deleteRequest(@PathVariable(name="requestno") Long requestno) {
        service.delete(requestno);
        return ResponseEntity.ok("삭제 성공");
    }

    /**
     *  요청 목록 조회 (검색 + 페이징 + 정렬 지원)
     *
     * @param searchType 검색 필드 (예: "talentTitle", "userName", "status", "message")
     * @param keyword 검색 키워드 (없으면 전체)
     * @param page 페이지 번호 (0부터 시작)
     * @param size 한 페이지당 요청 수
     * @param sort 정렬 기준 필드 (기본: requestno)
     * @param direction 정렬 방향 (ASC 또는 DESC)
     * @return 요청 리스트 페이지
     */
    @GetMapping("/list")
    public ResponseEntity<Page<RequestListDTO>> listRequests(
            @RequestParam(name="searchType", required = false) String searchType,
            @RequestParam(name="keyword", required = false) String keyword,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            @RequestParam(name="sort", defaultValue = "requestno") String sort,
            @RequestParam(name="direction", defaultValue = "DESC") String direction) {

        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<RequestListDTO> resultPage = service.searchRequests(searchType, keyword, pageable);
        return ResponseEntity.ok(resultPage);
    }

    /**
     *  요청 상태 수동 변경 (단일 요청)
     * 
     * @param requestno 요청 ID
     * @param status 변경할 상태 값 (예: "ACCEPTED", "REJECTED")
     * @return 성공 메시지
     */
    @PatchMapping("/status/{requestno}")
    public ResponseEntity<String> updateStatus(
            @PathVariable(name="requestno") Long requestno,
            @RequestParam(name="status") String status) {

        service.updateStatus(requestno, status);
        return ResponseEntity.ok("상태가 변경되었습니다.");
    }

    /**
     *  요청 수락 처리
     *
     * @param requestno 수락할 요청 번호
     * @return 200 OK
     */
    @PatchMapping("/{requestno}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable(name="requestno") Long requestno) {
        service.updateStatus(requestno, RequestStatus.ACCEPTED);
        return ResponseEntity.ok().build();
    }

    /**
     *  요청 거절 처리
     *
     * @param requestno 거절할 요청 번호
     * @return 200 OK
     */
    @PatchMapping("/{requestno}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable(name="requestno") Long requestno) {
        service.updateStatus(requestno, RequestStatus.REJECTED);
        return ResponseEntity.ok().build();
    }

    /**
     *  채팅방 번호 기준으로 최근 요청 1건 조회
     * 
     * @param chatRoomno 채팅방 ID
     * @return 가장 최근 요청 정보 or 204 No Content
     */
    @GetMapping("/chatroom/{chatRoomno}")
    public ResponseEntity<?> getLatestRequestByChatRoom(@PathVariable(name="chatRoomno") Long chatRoomno) {
        return requestRepository.findTopByChatRoom_ChatRoomnoOrderByCreatedAtDesc(chatRoomno)
            .map(request -> ResponseEntity.ok(new RequestResponseDTO(request)))
            .orElse(ResponseEntity.noContent().build());
    }

    /**
     *  구매 내역 조회
     *  내가 요청한 거래 내역 (giver 기준)
     *
     * @param userno 사용자 번호
     * @return 요청 리스트 (내가 요청한 것들)
     */
    @GetMapping("/purchases/{userno}")
    public List<RequestResponseDTO> getPurchases(@PathVariable(name="userno") Long userno) {
        List<Request> purchases = requestRepository.findByGiver_Userno(userno);
        return purchases.stream()
                        .map(RequestResponseDTO::new)
                        .collect(Collectors.toList());
    }

    /**
     *  판매 내역 조회
     *  내가 요청 받은 거래 내역 (receiver 기준)
     *
     * @param userno 사용자 번호
     * @return 요청 리스트 (내가 받은 요청들)
     */
    @GetMapping("/sales/{userno}")
    public List<RequestResponseDTO> getSales(@PathVariable("userno") Long userno) {
        List<Request> sales = requestRepository.findByReceiver_Userno(userno);
        return sales.stream()
                    .map(RequestResponseDTO::new)
                    .collect(Collectors.toList());
    }
}
