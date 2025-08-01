package dev.mvc.team5.match;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
  //요청번호(requestno)로 검색
  Page<Match> findByRequest_Requestno(Long requestno, Pageable pageable);

  // 주는 사람 이름(giver name)으로 검색 (Like 검색)
  Page<Match> findByGiver_NameContainingIgnoreCase(String giverName, Pageable pageable);

  // 받는 사람 이름(receiver name)으로 검색 (Like 검색)
  Page<Match> findByReceiver_NameContainingIgnoreCase(String receiverName, Pageable pageable);

  // 재능 제목(talent title)으로 검색 (Like 검색)
  Page<Match> findByTalent_TitleContainingIgnoreCase(String talentTitle, Pageable pageable);
}
