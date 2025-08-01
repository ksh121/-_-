package dev.mvc.team5.chatroom;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.mvc.team5.chatroommember.ChatRoomMember;
import dev.mvc.team5.chatroommember.ChatRoomMemberRepository;
import dev.mvc.team5.message.MessageRepository;
import dev.mvc.team5.notification.NotificationService;
import dev.mvc.team5.request.Request;
import dev.mvc.team5.request.RequestRepository;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.talents.TalentService;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * ChatRoom 관련 비즈니스 로직 처리 서비스 클래스
 */
@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final MessageRepository messageRepository;
    private final RequestRepository requestRepository;
    private final TalentService talentService;

    /**
     * 채팅방 저장
     * @param chatRoom 저장할 채팅방 객체
     * @return 저장된 ChatRoom
     */
    public ChatRoom save(ChatRoom chatRoom) {
        return chatRoomRepository.save(chatRoom);
    }

    /**
     * 채팅방 ID로 조회
     * @param id 채팅방 ID
     * @return 존재하는 ChatRoom 객체
     */
    public ChatRoom findById(Long id) {
        return chatRoomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("ChatRoom not found"));
    }

    /**
     * 특정 유저가 참여 중인 채팅방 전체 조회
     * @param userno 유저 고유 번호
     * @return 채팅방 리스트
     */
    public List<ChatRoom> findChatRoomsByUser(Long userno) {
        List<ChatRoomMember> members = chatRoomMemberRepository.findByUserUserno(userno);
        return members.stream()
                      .map(ChatRoomMember::getChatRoom)
                      .collect(Collectors.toList());
    }

    /**
     * 1:1 채팅방이 이미 존재하면 반환하고, 없으면 새로 생성
     * @param senderId 보낸 사람 ID
     * @param receiverId 받는 사람 ID
     * @param talentno 연결된 게시물 ID
     * @param title 게시물 제목
     * @return 기존 또는 새로 생성된 ChatRoom
     */
    @Transactional
    public ChatRoom findOrCreatePrivateChat(Long senderId, Long receiverId, Long talentno, String title) {
        Optional<ChatRoom> existingRoom = chatRoomRepository
            .findPrivateRoomByMembersAndTalent(senderId, receiverId, talentno);
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }

        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setRoomName("1:1 Chat");

        // ✅ 영속 엔티티로 변경
        Talent talent = talentService.getEntityById(talentno);
        chatRoom.setTalent(talent);

        // ✅ receiver는 잘 처리됨
        User receiver = userService.findById(receiverId);
        chatRoom.setReceiverno(receiver);

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        User sender = userService.findById(senderId);

        ChatRoomMember m1 = new ChatRoomMember();
        m1.setChatRoom(savedChatRoom);
        m1.setUser(sender);

        ChatRoomMember m2 = new ChatRoomMember();
        m2.setChatRoom(savedChatRoom);
        m2.setUser(receiver);

        chatRoomMemberRepository.save(m1);
        chatRoomMemberRepository.save(m2);

        notificationService.createNotification(
            receiverId,
            "chat",
            sender.getUsername() + "님이 [" + talent.getTitle() + "] 게시물에 대해 새 채팅을 시작했습니다.",
            savedChatRoom.getChatRoomno()
        );

        return savedChatRoom;
    }



    /**
     * 전체 공개 채팅방 목록 조회 (최신순)
     * @return 공개 채팅방 리스트
     */
    public List<ChatRoom> getAllPublicChatRooms() {
        return chatRoomRepository.findByPublicRoomTrueOrderByCreatedAtDesc();
    }

    /**
     * 채팅방 강제 삭제
     * - 요청에서 ChatRoom 참조 끊기
     * - 메시지/멤버는 Cascade 설정으로 함께 삭제됨
     * @param chatRoomno 삭제할 채팅방 번호
     */
    @Transactional
    public void forceDeleteChatRoom(Long chatRoomno) {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomno)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 채팅방입니다."));

        // 1. 연결된 요청 객체들에서 ChatRoom 참조 제거
        List<Request> requests = requestRepository.findByChatRoom(chatRoom);
        for (Request request : requests) {
            request.setChatRoom(null);
        }

        // 2. 채팅방 삭제 (Cascade 설정되어 있으면 자식들도 함께 삭제됨)
        chatRoomRepository.delete(chatRoom);
    }
} 
