package dev.mvc.team5.chatroom;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.team5.chatroom.chatroomdto.ChatRoomCreateDTO;
import dev.mvc.team5.chatroom.chatroomdto.ChatRoomResponseDTO;
import dev.mvc.team5.chatroom.chatroomdto.OpenRoomCreateDTO;
import dev.mvc.team5.chatroom.chatroomdto.OpenRoomDetailDTO;
import dev.mvc.team5.chatroom.chatroomdto.OpenRoomResponseDTO;
import dev.mvc.team5.chatroommember.ChatRoomMember;
import dev.mvc.team5.chatroommember.ChatRoomMemberRepository;
import dev.mvc.team5.chatroommember.ChatRoomMemberService;
import dev.mvc.team5.chatroommember.chatroommemberdto.ChatRoomMemberResponseDTO;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserService;
import lombok.RequiredArgsConstructor;

/**
 * ChatRoomController
 * 채팅방 관련 API 컨트롤러
 */
@RestController
@RequestMapping("/chatroom")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;
    private final ChatRoomMemberService chatRoomMemberService;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final UserService userService;

    /**
     * [POST] 채팅방 생성 (1:1 또는 재능기반)
     */
    @PostMapping(path="/save")
    public ResponseEntity<ChatRoomResponseDTO> createRoom(@RequestBody ChatRoomCreateDTO dto) {
        ChatRoom savedRoom = chatRoomService.save(dto.toEntity());
        ChatRoomResponseDTO response = new ChatRoomResponseDTO(
            savedRoom.getChatRoomno(),
            savedRoom.getRoomName(),
            savedRoom.getCreatedAt(),
            savedRoom.getTalent().getTalentno(),
            savedRoom.getTalent().getTitle(),
            null,
            null,
            savedRoom.isPublicRoom(),
            savedRoom.getTalent() != null ? savedRoom.getTalent().getPrice() : null

        );
        return ResponseEntity.ok(response);
    }

    /**
     * [POST] 채팅방 입장 (사용자 - 채팅방 멤버 연결)
     */
    @PostMapping("/{roomId}/enter/{userId}")
    public ResponseEntity<String> enterRoom(
        @PathVariable(name="roomId") Long roomId,
        @PathVariable(name="userId") Long userId,
        @RequestParam(name="password", required = false) String password  // 비밀번호는 선택적으로 받음
    ) {
        ChatRoom room = chatRoomService.findById(roomId);

        // 공개방이고 비밀번호가 설정되어 있으면 비교
        if (room.isPublicRoom() && room.getPassword() != null && !room.getPassword().isBlank()) {
            if (password == null || !room.getPassword().equals(password)) {
                return ResponseEntity.status(403).body("비밀번호가 올바르지 않습니다.");
            }
        }

        User user = userService.findById(userId);
        ChatRoomMember member = chatRoomMemberService.enterChatRoomIfNotExists(room, user);
        return ResponseEntity.ok("입장 완료: memberNo = " + member.getChatRoomMemberno());
    }

    /**
     * [GET] 특정 유저가 참여 중인 채팅방 목록 조회
     */
    @GetMapping("/user/{userno}/chatlist")
    public List<ChatRoomResponseDTO> getChatListByUser(@PathVariable(name = "userno") Long userno) {
        return chatRoomService.findChatRoomsByUser(userno).stream()
            .map(room -> {
                Long talentno = room.getTalent() != null ? room.getTalent().getTalentno() : null;
                String title = room.getTalent() != null ? room.getTalent().getTitle() : null;
                Long price = room.getTalent() != null ? room.getTalent().getPrice() : null;
                return new ChatRoomResponseDTO(
                    room.getChatRoomno(),
                    room.getRoomName(),
                    room.getCreatedAt(),
                    talentno,
                    title,
                    room.getCreator() != null ? room.getCreator().getUserno() : null,
                    room.getCreator() != null ? room.getCreator().getUsername() : null,
                    room.isPublicRoom(),
                    price
                );
            })
            .collect(Collectors.toList());
    }

    /**
     * [POST] 1:1 채팅방 찾기 또는 없으면 생성
     * - 동일한 유저 조합 + 재능 게시글이면 재사용
     */
    @PostMapping("/findOrCreate")
    public ResponseEntity<ChatRoomResponseDTO> findOrCreateChatRoom(
        @RequestParam(name = "senderId") Long senderId,
        @RequestParam(name = "receiverId") Long receiverId,
        @RequestParam(name = "talentno") Long talentno,
        @RequestParam(name = "title") String title) {

        ChatRoom chatRoom = chatRoomService.findOrCreatePrivateChat(senderId, receiverId, talentno, title);

        // receiver 정보 조회 (receiverId를 기반으로)
        User receiver = userService.findById(receiverId);

        ChatRoomResponseDTO dto = new ChatRoomResponseDTO(
            chatRoom.getChatRoomno(),
            chatRoom.getRoomName(),
            chatRoom.getCreatedAt(),
            chatRoom.getTalent().getTalentno(),
            chatRoom.getTalent().getTitle(),
            chatRoom.getReceiverno() != null ? chatRoom.getReceiverno().getUserno() : null,
            chatRoom.getReceiverno() != null ? chatRoom.getReceiverno().getUsername() : null,     // receiverName
            chatRoom.isPublicRoom(),
            chatRoom.getTalent() != null ? chatRoom.getTalent().getPrice() : null

        );

        return ResponseEntity.ok(dto);
    }


    /**
     * [GET] 1:1 채팅방 상세 조회 (상대방 정보 포함)
     */
    @GetMapping("/{chatRoomno}")
    public ResponseEntity<ChatRoomResponseDTO> getChatRoom(
        @PathVariable(name = "chatRoomno") Long chatRoomno,
        @RequestParam(name = "loginUserno") Long loginUserno
    ) {
        ChatRoom chatRoom = chatRoomService.findById(chatRoomno);

        ChatRoomResponseDTO dto = new ChatRoomResponseDTO(
            chatRoom.getChatRoomno(),
            chatRoom.getRoomName(),
            chatRoom.getCreatedAt(),
            chatRoom.getTalent() != null ? chatRoom.getTalent().getTalentno() : null,
            chatRoom.getTalent() != null ? chatRoom.getTalent().getTitle() : null,
            chatRoom.getReceiverno() != null ? chatRoom.getReceiverno().getUserno() : null,
            chatRoom.getReceiverno() != null ? chatRoom.getReceiverno().getUsername() : null,
            chatRoom.isPublicRoom(),
            chatRoom.getTalent() != null ? chatRoom.getTalent().getPrice() : null

        );

        return ResponseEntity.ok(dto);
    }


    /**
     * [DELETE] 채팅방 삭제 (관리자 또는 강제 삭제)
     */
    @DeleteMapping("/{chatRoomno}")
    public ResponseEntity<Void> deleteChatRoom(@PathVariable(name = "chatRoomno") Long chatRoomno) {
        chatRoomService.forceDeleteChatRoom(chatRoomno);
        return ResponseEntity.noContent().build();
    }

    /**
     * [POST] 공개 채팅방 생성 (creator 포함, talent 없이 생성 가능)
     */
    @PostMapping("/open")
    public ResponseEntity<OpenRoomResponseDTO> createOpenChatRoom(@RequestBody OpenRoomCreateDTO dto) {
        User creator = userService.findById(dto.getCreatorId());
        ChatRoom room = dto.toEntity(creator);
        ChatRoom savedRoom = chatRoomService.save(room);

        ChatRoomMember member = new ChatRoomMember();
        member.setChatRoom(savedRoom);
        member.setUser(creator);
        chatRoomMemberService.save(member);

        OpenRoomResponseDTO response = new OpenRoomResponseDTO(
            savedRoom.getChatRoomno(),
            savedRoom.getRoomName(),
            savedRoom.getCreatedAt(),
            creator.getUserno(),
            creator.getUsername(),
            savedRoom.getPassword() != null && !savedRoom.getPassword().isBlank()
            
        );

        return ResponseEntity.ok(response);
    }

    /**
     * [GET] 전체 공개 채팅방 목록 조회
     */
    @GetMapping("/public")
    public List<OpenRoomResponseDTO> getPublicChatRooms() {
        List<ChatRoom> rooms = chatRoomService.getAllPublicChatRooms();
        return rooms.stream()
            .map(room -> new OpenRoomResponseDTO(
                room.getChatRoomno(),
                room.getRoomName(),
                room.getCreatedAt(),
                room.getCreator() != null ? room.getCreator().getUserno() : null,
                room.getCreator() != null ? room.getCreator().getUsername() : null,
                room.getPassword() != null && !room.getPassword().isBlank()
            ))
            .collect(Collectors.toList());
    }

    /**
     * [GET] 공개 채팅방 상세 조회 (참여자 리스트 포함)
     */
    @GetMapping("/open/{chatRoomno}")
    public ResponseEntity<OpenRoomDetailDTO> getOpenRoomDetail(@PathVariable(name = "chatRoomno") Long chatRoomno) {
        ChatRoom chatRoom = chatRoomService.findById(chatRoomno);

        // 공개방 여부 확인
        if (!chatRoom.isPublicRoom()) {
            return ResponseEntity.badRequest().build();
        }

        // 참여자 조회 및 DTO 변환
        List<ChatRoomMember> members = chatRoomMemberService.findByChatRoomno(chatRoomno);
        List<ChatRoomMemberResponseDTO> memberDTOs = members.stream()
            .map(m -> new ChatRoomMemberResponseDTO(
                m.getChatRoomMemberno(),
                m.getChatRoom().getChatRoomno(),
                m.getUser().getUserno(),
                m.getUser().getUsername(),
                m.getJoinedAt()
            ))
            .toList();

        // 응답 DTO 구성
        OpenRoomDetailDTO dto = new OpenRoomDetailDTO();
        dto.setChatRoomno(chatRoom.getChatRoomno());
        dto.setRoomName(chatRoom.getRoomName());
        dto.setCreatedAt(chatRoom.getCreatedAt());
        dto.setPublicRoom(true);
        dto.setMembers(memberDTOs);

        return ResponseEntity.ok(dto);
    }
} 
