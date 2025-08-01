package dev.mvc.team5.request;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.mvc.team5.chatroom.ChatRoom;


@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    
    // 게시물 제목으로 검색 + 페이징 + 정렬
    Page<Request> findByTalent_TitleContaining(String keyword, Pageable pageable);
    
    // 요청한 회원 이름으로 검색
    Page<Request> findByGiver_NameContaining(String keyword, Pageable pageable);
    
    // 요청 상태로 검색
    Page<Request> findByStatusContaining(String keyword, Pageable pageable);
    
    // 요청 내용으로 검색
    Page<Request> findByMessageContaining(String keyword, Pageable pageable);
    
    Optional<Request> findByChatRoom_ChatRoomno(Long chatRoomno);
    
    Optional<Request> findTopByChatRoom_ChatRoomnoOrderByCreatedAtDesc(Long chatRoomno);

    List<Request> findByChatRoom(ChatRoom chatRoom);

    List<Request> findByGiver_Userno(Long userno);  //구매
    
    List<Request> findByReceiver_Userno(Long userno); // 판매
}

