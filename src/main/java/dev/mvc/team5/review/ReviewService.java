package dev.mvc.team5.review;

import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.talents.TalentRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repo;

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private TalentRepository talentRepo;

    // 전체 리뷰 목록 조회
    public List<Review> findAll() {
        return repo.findAll();
    }

    // 리뷰 ID로 단건 조회
    public Optional<Review> findById(Long id) {
        return repo.findById(id);
    }

    // 특정 작성자(giver)가 작성한 리뷰 목록
    public List<Review> findByGiver(Long userno) {
        return repo.findByGiverUserno(userno);
    }
    public Page<ReviewDTO> getReviewsByGiverUserno(Long userno, Pageable pageable) {
      Page<Review> reviews = repo.findByGiver_Userno(userno, pageable);
      return reviews.map(this::convertToDTO);  // ⭐ 변환
  }
    

    
 // DTO 변환 메서드
    public ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewno(review.getReviewno());
        dto.setGiver(review.getGiver().getUserno());
        dto.setGivername(review.getGiver().getUsername());
        dto.setReceiver(review.getReceiver().getUserno());
        dto.setRating(review.getRating());
        dto.setComments(review.getComments());
        dto.setCreatedAt(review.getCreatedAt().toString()); 
        
        // ⭐ Talent 정보가 있을 경우에만 DTO에 talentno 설정
        if (review.getTalent() != null) {
            dto.setTalentno(review.getTalent().getTalentno());
        }
        return dto;
    }
    
    // 특정 수신자(receiver)가 받은 리뷰 목록
    public List<Review> findByReceiver(Long userno) {
        return repo.findByReceiverUserno(userno);
    }
    
 // ⭐⭐ 새로 추가할 메서드: 특정 재능(talentno)에 대한 리뷰 목록 조회
    @Transactional
    public List<Review> findReviewsByTalent(Long talentno) {
        return repo.findByTalent_Talentno(talentno);
    }

    // ⭐⭐ 새로 추가할 메서드: 특정 재능(talentno)에 대한 리뷰 목록 (페이징)
    @Transactional
    public Page<ReviewDTO> getReviewsByTalentno(Long talentno, Pageable pageable) {
        Page<Review> reviews = repo.findByTalent_Talentno(talentno, pageable);
        return reviews.map(this::convertToDTO);
    }

    // ⭐⭐ 새로 추가할 메서드: 재능 게시물에 대한 리뷰 생성 (talentno를 필수로 받음)
    @Transactional
    public Review saveTalentReview(ReviewDTO dto) {
        User giver = userRepo.findById(dto.getGiver())
                             .orElseThrow(() -> new IllegalArgumentException("작성자(giver)를 찾을 수 없습니다: " + dto.getGiver()));
        User receiver = userRepo.findById(dto.getReceiver())
                               .orElseThrow(() -> new IllegalArgumentException("리뷰 대상자(receiver)를 찾을 수 없습니다: " + dto.getReceiver()));
        
        Talent talent = talentRepo.findById(dto.getTalentno())
                                 .orElseThrow(() -> new IllegalArgumentException("리뷰 대상 재능 게시물을 찾을 수 없습니다: " + dto.getTalentno()));

        Review r = new Review();
        r.setGiver(giver);
        r.setReceiver(receiver);
        r.setTalent(talent); // ⭐ 재능 게시물 연결
        r.setRating(dto.getRating());
        r.setComments(dto.getComments());

        return repo.save(r);
    }

    // 리뷰 생성 (DTO → Entity 변환 후 저장)
    public Review save(ReviewDTO dto) {
        // giver와 receiver는 userno 기준으로 User 엔티티 조회
        User giver = userRepo.findById(dto.getGiver()).orElseThrow();
        User receiver = userRepo.findById(dto.getReceiver()).orElseThrow();
        
        Review r = new Review();
        r.setGiver(giver);
        r.setReceiver(receiver);
        r.setRating(dto.getRating());
        r.setComments(dto.getComments());
        // createdAt은 @CreationTimestamp에 의해 자동 설정

        return repo.save(r);
    }

    // 리뷰 삭제
    public void delete(Long id) {
        repo.deleteById(id);
    }
    
    // 리뷰 평점만
    public double getAverageRatingForTalent(Long talentno) {
      Double avg = repo.findAverageRatingByTalentno(talentno);
      return avg != null ? avg : 0;
  }


}
