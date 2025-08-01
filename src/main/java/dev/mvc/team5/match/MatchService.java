package dev.mvc.team5.match;

import dev.mvc.team5.match.matchdto.MatchResponseDTO;
import dev.mvc.team5.match.matchdto.MatchCreateDTO;
import dev.mvc.team5.match.matchdto.MatchListDTO;
import dev.mvc.team5.match.MatchRepository;
import dev.mvc.team5.reservations.Reservations;
import dev.mvc.team5.reservations.ReservationsRepository;
import dev.mvc.team5.request.Request;
import dev.mvc.team5.request.RequestRepository;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.talents.TalentRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;
    private final ReservationsRepository reservationsRepository;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final TalentRepository talentRepository;
   
    private final ReservationsRepository reservationRepository;
    
 // Entity -> DTO 변환 헬퍼 메서드
    private MatchResponseDTO toMatchResponseDTO(Match match) {
        return new MatchResponseDTO(
            match.getMatchno(),
            match.getRequest().getRequestno(),
            match.getReservation() != null ? match.getReservation().getReservationno() : null,
            match.getGiver().getName(),
            match.getReceiver().getName(),
            match.getTalent().getTitle(),
            match.getReservation() != null ? match.getReservation().getStart_time() : null,
            match.getReservation() != null ? match.getReservation().getEnd_time() : null
        );
    }

    // 매칭 생성
    public MatchResponseDTO save(MatchCreateDTO dto) {
      Request request = requestRepository.findById(dto.getRequestno())
          .orElseThrow(() -> new RuntimeException("해당 요청이 존재하지 않습니다."));
      User giver = userRepository.findById(dto.getGiverno())
          .orElseThrow(() -> new RuntimeException("해당 요청 회원ID가 존재하지 않습니다."));
      User receiver = userRepository.findById(dto.getReceiverno())
          .orElseThrow(() -> new RuntimeException("해당 요청받은 회원ID 존재하지 않습니다."));
      Talent talent = talentRepository.findById(dto.getTalentno())
          .orElseThrow(() -> new RuntimeException("해당 게시물이 존재하지 않습니다."));
      Reservations reservation = reservationRepository.findById(dto.getReservationno())
          .orElseThrow(() -> new RuntimeException("해당 예약이 존재하지 않습니다."));

      Match match = new Match(request, giver, receiver, talent, reservation);

      Match saved = matchRepository.save(match);

      return toMatchResponseDTO(saved);
  }


//    // 단건 조회
//    public MatchResponseDTO getMatch(Long matchno) {
//        Match match = matchRepository.findById(matchno)
//            .orElseThrow(() -> new RuntimeException("매칭이 존재하지 않습니다."));
//
//        return toMatchResponseDTO(match);
//    }

    // 삭제
    public void deleteMatch(Long matchno) {
        if (!matchRepository.existsById(matchno)) {
            throw new RuntimeException("삭제할 매칭이 없습니다.");
        }
        matchRepository.deleteById(matchno);
    }
    
    // 검색+페이징+정렬
    public Page<MatchListDTO> searchMatches(
            String searchType,
            String keyword,
            Pageable pageable) {

        Page<Match> page;

        if (keyword == null || keyword.trim().isEmpty()) {
            page = matchRepository.findAll(pageable);
        } else {
            switch (searchType) {
                case "requestno":
                    // requestno는 Long 타입이므로 변환 필요
                    try {
                        Long requestno = Long.parseLong(keyword);
                        page = matchRepository.findByRequest_Requestno(requestno, pageable);
                    } catch (NumberFormatException e) {
                        page = Page.empty(pageable);
                    }
                    break;
                case "giverName":
                    page = matchRepository.findByGiver_NameContainingIgnoreCase(keyword, pageable);
                    break;
                case "receiverName":
                    page = matchRepository.findByReceiver_NameContainingIgnoreCase(keyword, pageable);
                    break;
                case "talentTitle":
                    page = matchRepository.findByTalent_TitleContainingIgnoreCase(keyword, pageable);
                    break;
                default:
                    page = matchRepository.findAll(pageable);
                    break;
            }
        }

        // Entity -> DTO 변환
        return page.map(m -> new MatchListDTO(
                m.getMatchno(),
                m.getRequest().getRequestno(),
                m.getGiver().getName(),
                m.getReceiver().getName(),
                m.getTalent().getTitle(),
                m.getReservation().getStart_time(),
                m.getReservation().getEnd_time()
        ));
    }

    
}
