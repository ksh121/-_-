package dev.mvc.team5.request;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.chatroom.ChatRoomRepository;
import dev.mvc.team5.message.Message;
import dev.mvc.team5.message.MessageRepository;
import dev.mvc.team5.message.messagedto.ChatMessageDTO;
import dev.mvc.team5.notification.NotificationService;
import dev.mvc.team5.request.requestdto.RequestCreateDTO;
import dev.mvc.team5.request.requestdto.RequestListDTO;
import dev.mvc.team5.request.requestdto.RequestResponseDTO;
import dev.mvc.team5.tool.RequestStatus;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.talents.TalentRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final TalentRepository talentRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket 메세지 전송용
    private final NotificationService notificationService;
    private final MessageRepository messageRepository;

    /**
     * Request 엔티티를 RequestResponseDTO로 변환하는 헬퍼 메서드
     * @param request 변환할 Request 엔티티
     * @return 응답용 DTO 객체
     */
    private RequestResponseDTO toRequestResponseDTO(Request request) {
      return new RequestResponseDTO(
          request.getRequestno(),
          request.getTalent() != null ? request.getTalent().getTalentno() : null,
          request.getTalent() != null ? request.getTalent().getTitle() : null,
          request.getGiver() != null ? request.getGiver().getUserno() : null,
          request.getGiver() != null ? request.getGiver().getName() : null,
          request.getReceiver() != null ? request.getReceiver().getUserno() : null,
          request.getReceiver() != null ? request.getReceiver().getName() : null,
          request.getStatus(),
          request.getMessage(),
          request.getCreatedAt(),
          request.getTalent() != null ? request.getTalent().getPrice() : null
      );
  }


    /**
     * 요청 등록
     */
    @Transactional
    public RequestResponseDTO save(RequestCreateDTO dto) {
        Talent talent = talentRepository.findById(dto.getTalentno())
            .orElseThrow(() -> new RuntimeException("해당 게시물이 존재하지 않습니다."));

        User giver = userRepository.findById(dto.getGiverno())
            .orElseThrow(() -> new RuntimeException("요청자 정보가 없습니다."));

        User receiver = userRepository.findById(dto.getReceiverno())
            .orElseThrow(() -> new RuntimeException("피요청자 정보가 없습니다."));

        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomno())
            .orElseThrow(() -> new RuntimeException("채팅방이 존재하지 않습니다."));

        // 요청 객체 생성 및 저장
        Request request = new Request(talent, giver, receiver, dto.getStatus(), dto.getMessage());
        request.setChatRoom(chatRoom);
        request.setPrice(dto.getPrice());

        Request saved = requestRepository.save(request);
        
        //ㅏㅇ릶 저돕
        

        //  WebSocket 시스템 메시지 전송
        String systemMessage = giver.getName() + "님이 [" + talent.getTitle() + "] 요청을 보냈습니다.";

        messagingTemplate.convertAndSend(
            "/topic/chatroom/" + chatRoom.getChatRoomno(),
            new ChatMessageDTO("system", systemMessage, "SYSTEM", chatRoom.getChatRoomno())
        );
        
     // 3. 알림 전송 (요청자에게)
        notificationService.createNotification(
            receiver.getUserno(),
            "request",
            "[" + talent.getTitle() + "] 요청이 왔습니다.",
            chatRoom.getChatRoomno()
        );
        
     // 요청 메시지를 DB에도 저장
        Message message = new Message();
        message.setChatRoom(chatRoom);
        message.setSender(null);  // 시스템이니까 null 또는 특별한 시스템 사용자로
        message.setContent(systemMessage);
        message.setType("SYSTEM");
        messageRepository.save(message);
        
     // 요청 정보도 전송 (버튼 띄우기용)
        messagingTemplate.convertAndSend(
            "/topic/chatroom/" + chatRoom.getChatRoomno(),
            toRequestResponseDTO(saved)
        );

        return toRequestResponseDTO(saved);
    }




    /**
     * 요청 삭제
     */
    public void delete(Long requestno) {
        if (!requestRepository.existsById(requestno)) {
            throw new RuntimeException("요청이 존재하지 않습니다.");
        }
        requestRepository.deleteById(requestno);
    }


    /**
     * 검색 유형(searchType)에 따라 keyword로 검색 + 페이징 + 정렬 후 RequestListDTO로 변환 반환
     * 
     * @param searchType 검색할 필드명 (예: "talentTitle", "userName", "status", "message")
     * @param keyword 검색어
     * @param pageable 페이징 + 정렬 정보
     * @return 검색 결과의 DTO 페이지 리스트
     */
    public Page<RequestListDTO> searchRequests(String searchType, String keyword, Pageable pageable) {
        Page<Request> page;

        if (keyword == null || keyword.trim().isEmpty()) {
            // 검색어 없으면 전체 리스트 조회
            page = requestRepository.findAll(pageable);
        } else {
            switch (searchType) {
                case "talentTitle":
                    page = requestRepository.findByTalent_TitleContaining(keyword, pageable);
                    break;
                case "userName":
                    page = requestRepository.findByGiver_NameContaining(keyword, pageable);
                    break;
                case "status":
                    page = requestRepository.findByStatusContaining(keyword, pageable);
                    break;
                case "message":
                    page = requestRepository.findByMessageContaining(keyword, pageable);
                    break;
                default:
                    // 기본 전체 조회 (또는 예외 처리)
                    page = requestRepository.findAll(pageable);
                    break;
            }
        }

        // Entity -> DTO 변환
        return page.map(r -> new RequestListDTO(
                r.getRequestno(),
                r.getTalent().getTalentno(),
                r.getTalent().getTitle(),
                r.getTalent().getUser().getUserno(), // receiverno로 보냄
                r.getStatus(),
                r.getCreatedAt()
        ));
    }
    
//    // 요청 상태 변경 메서드
//    public void updateStatus(Long requestno, String status) {
//        Request request = requestRepository.findById(requestno)
//            .orElseThrow(() -> new RuntimeException("요청을 찾을 수 없습니다."));
//
//        // 상태 변경
//        request.setStatus(status);
//
//        // 변경된 엔티티 저장
//        requestRepository.save(request);
//    }
    
    // 요청 상태 변경 + 알림 + WebSocket 메시지 전송
    public void updateStatus(Long requestno, String status) {
      Request request = requestRepository.findById(requestno)
          .orElseThrow(() -> new RuntimeException("요청을 찾을 수 없습니다."));

      request.setStatus(status);
      requestRepository.save(request);

      // 정보 추출
      Long receiverUserno = request.getReceiver().getUserno();
      Long giverUserno = request.getGiver().getUserno();
      String giverName = request.getGiver().getName();
      String talentTitle = request.getTalent().getTitle();
      Long chatRoomno = request.getChatRoom().getChatRoomno();

      // 💬 메시지 내용
      String resultMessage = switch (status.toLowerCase()) {
          case "accepted" -> giverName + "님의 요청이 수락되었습니다.";
          case "rejected" -> giverName + "님의 요청이 거절되었습니다.";
          default -> "요청 상태가 변경되었습니다.";
      };

      // 1. WebSocket 전송
      messagingTemplate.convertAndSend(
          "/topic/chatroom/" + chatRoomno,
          new ChatMessageDTO("system", resultMessage, "SYSTEM", chatRoomno)
      );

      // ✅ 2. DB에도 SYSTEM 메시지 저장
      Message message = new Message();
      message.setChatRoom(request.getChatRoom());
      message.setSender(null); // 시스템이므로 sender는 null
      message.setContent(resultMessage);
      message.setType("SYSTEM");
      messageRepository.save(message);

      // 3. 알림 전송 (요청자에게)
      notificationService.createNotification(
          giverUserno,
          "request",
          "[" + talentTitle + "] 요청이 " + (status.equals("accepted") ? "수락" : "거절") + "되었습니다.",
          chatRoomno
      );
  }

    
}
