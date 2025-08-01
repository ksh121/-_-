package dev.mvc.team5.chatroommember;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.team5.chatroom.ChatRoom;
import dev.mvc.team5.chatroommember.chatroommemberdto.ChatRoomMemberResponseDTO;
import dev.mvc.team5.user.User;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/chatmember")
@RequiredArgsConstructor
public class ChatRoomMemberController {
  
    private final ChatRoomMemberRepository chatMemberRepository;

    //중복 입장 여부 확인
    public boolean isAlreadyMember(ChatRoom chatRoom, User user) {
       return chatMemberRepository.existsByChatRoomAndUser(chatRoom, user);
    }
    
    //중복 체크 + 자동 입장 처리
    @Transactional
    public ChatRoomMember enterChatRoomIfNotExists(ChatRoom chatRoom, User user) {
       if (isAlreadyMember(chatRoom, user)) {
           return chatMemberRepository.findFirstByChatRoomAndUser(chatRoom, user)
               .orElseThrow(() -> new IllegalStateException("이미 멤버인데 멤버 정보가 없음"));
       }
    
       ChatRoomMember member = new ChatRoomMember();
       member.setChatRoom(chatRoom);
       member.setUser(user);
       return chatMemberRepository.save(member);
    }
    
    @GetMapping("/chatroom/{id}/members")
    public List<ChatRoomMemberResponseDTO> getChatRoomMembers(@PathVariable(name="id") Long id) {
        List<ChatRoomMember> members = chatMemberRepository.findByChatRoomChatRoomno(id);

        return members.stream().map(member -> {
            ChatRoomMemberResponseDTO dto = new ChatRoomMemberResponseDTO();
            dto.setChatRoomMemberno(member.getChatRoomMemberno());
            dto.setChatRoomno(member.getChatRoom().getChatRoomno());
            dto.setUserno(member.getUser().getUserno());
            dto.setUsername(member.getUser().getUsername()); 
            dto.setJoinedAt(member.getJoinedAt());
            return dto;
        }).toList();
    }



}
