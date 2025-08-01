package dev.mvc.team5.chatroommember;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.chatroom.chatroomdto.ChatRoomResponseDTO;
import dev.mvc.team5.chatroommember.ChatRoomMember;
import dev.mvc.team5.chatroommember.ChatRoomMemberRepository;
import dev.mvc.team5.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatRoomMemberService {

    private final ChatRoomMemberRepository chatRoomMemberRepository;

//    // 채팅방 멤버 입장 처리 (멤버 생성)
//    public ChatRoomMember enterChatRoom(ChatRoom chatRoom, User user) {
//        ChatRoomMember member = new ChatRoomMember();
//        member.setChatRoom(chatRoom);
//        member.setUser(user);
//        // joinedAt는 @CreationTimestamp로 자동 입력
//        return chatRoomMemberRepository.save(member);
//    }

    public Collection<ChatRoomResponseDTO> findChatRoomsByUser(Long userno) {
      List<ChatRoomMember> members = chatRoomMemberRepository.findByUserUserno(userno);
      if (members == null || members.isEmpty()) {
          return Collections.emptyList();
      }
      return members.stream()
          .map(member -> {
              ChatRoom room = member.getChatRoom();

              // 현재 유저를 제외한 상대방 찾기
              List<ChatRoomMember> allMembers = chatRoomMemberRepository.findByChatRoomChatRoomno(room.getChatRoomno());
              ChatRoomMember other = allMembers.stream()
                  .filter(m -> !m.getUser().getUserno().equals(userno))
                  .findFirst()
                  .orElseThrow(() -> new IllegalStateException("상대방이 존재하지 않습니다."));

              return new ChatRoomResponseDTO(
                  room.getChatRoomno(),
                  room.getRoomName(),
                  room.getCreatedAt(),
                  room.getTalent().getTalentno(),
                  room.getTalent().getTitle(),                  
                  other.getUser().getUserno(),     // receiverno
                  other.getUser().getUsername(),    // receiverName
                  room.isPublicRoom(),
                  room.getTalent().getPrice()
              );
          })
          .collect(Collectors.toList());


  }
    
    // 삭제 메서드
    @Transactional
    public void deleteByChatRoom(ChatRoom chatRoom) {
        chatRoomMemberRepository.deleteByChatRoom(chatRoom);
    }


    // 멤버 조회 등 필요하면 추가
    public List<ChatRoomMember> findByChatRoomno(Long chatRoomno) {
      return chatRoomMemberRepository.findByChatRoomChatRoomno(chatRoomno);
   }
    
    public boolean isAlreadyMember(ChatRoom chatRoom, User user) {
      return chatRoomMemberRepository.existsByChatRoomAndUser(chatRoom, user);
  }
    
    public ChatRoomMember save(ChatRoomMember member) {
      System.out.println("중복 멤버 체크: " +
          member.getChatRoom().getChatRoomno() + ", " +
          member.getUser().getUserno());
      return chatRoomMemberRepository.save(member);
      
  }

    // 입장 인원 중복 방지 
    @Transactional
    public ChatRoomMember enterChatRoomIfNotExists(ChatRoom chatRoom, User user) {
        if (isAlreadyMember(chatRoom, user)) {
            // 이미 멤버일 경우 기존 객체 반환
            return chatRoomMemberRepository.findFirstByChatRoomAndUser(chatRoom, user)
                .orElseThrow(() -> new IllegalStateException("이미 참여 중인데 멤버가 없습니다."));
        }

        // 새 멤버 등록
        ChatRoomMember member = new ChatRoomMember();
        member.setChatRoom(chatRoom);
        member.setUser(user);
        return chatRoomMemberRepository.save(member);
    }


}
