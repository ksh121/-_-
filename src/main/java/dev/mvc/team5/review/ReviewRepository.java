package dev.mvc.team5.review;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
//특정 사용자가 작성한 리뷰 목록
  List<Review> findByGiverUserno(Long userno);

  // 특정 사용자가 받은 리뷰 목록
  List<Review> findByReceiverUserno(Long userno);
  // 그걸 페이징
  Page<Review> findByGiver_Userno(Long receiverUserno, Pageable pageable);
  
  //특정 재능 게시물에 대란 리뷰
  List<Review> findByTalent_Talentno(Long talentno);
  
  // 리뷰 평점 계산
  @Query("SELECT AVG(r.rating) FROM Review r WHERE r.talent.talentno = :talentno")
  Double findAverageRatingByTalentno(@Param("talentno") Long talentno);

  // 특정 재능 게시물에 대한 리뷰 목록 (페이징 버전)
  Page<Review> findByTalent_Talentno(Long talentno, Pageable pageable);

  int countByGiver_Userno(Long userno); 
  
  int countByReceiver_Userno(Long userno); // 사용자가 받은 리뷰 수
}
