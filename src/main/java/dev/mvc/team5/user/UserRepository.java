package dev.mvc.team5.user;


import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;



@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUserId(String userId);

    Optional<User> findByUserIdAndPassword(String userId, String password);
    
    //아이디 찾기
    Optional<User> findByUsernameAndEmail(String username, String email);
    
    //비밀번호 찾기
    Optional<User> findByUsernameAndUserIdAndEmail(String username,String userId, String email);
    //  관리자 페이지 유저목록 검색 등등
    Page<User> findByUserIdContainingIgnoreCaseOrUsernameContainingIgnoreCase(String userId, String username, Pageable pageable);
    
    //사용자가 적은 리뷰
}
