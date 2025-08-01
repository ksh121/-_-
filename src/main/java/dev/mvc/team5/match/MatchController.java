package dev.mvc.team5.match;

import dev.mvc.team5.match.matchdto.MatchCreateDTO;
import dev.mvc.team5.match.matchdto.MatchListDTO;
import dev.mvc.team5.match.matchdto.MatchResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/match")
public class MatchController {

    @Autowired
    private MatchService service;

    /**
     * 매칭 등록
     */
    @PostMapping(path="/save")
    public ResponseEntity<MatchResponseDTO> createMatch(@RequestBody MatchCreateDTO dto) {
        MatchResponseDTO response = service.save(dto);
        return ResponseEntity.ok(response);
    }

    /**
     * 매칭 삭제
     */
    @DeleteMapping("/delete/{matchno}")
    public ResponseEntity<String> deleteMatch(@PathVariable Long matchno) {
        service.deleteMatch(matchno);
        return ResponseEntity.ok("삭제 성공"); // 응답 반환
    }

    /**
     * 매칭 목록 조회 (검색 + 페이징 + 정렬)
     * 기본 정렬은 matchno 내림차순
     */
    @GetMapping("/list")
    public ResponseEntity<Page<MatchListDTO>> listMatches(
            @RequestParam(required = false) String searchType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "matchno") String sort,
            @RequestParam(defaultValue = "DESC") String direction
    ) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

        Page<MatchListDTO> resultPage = service.searchMatches(searchType, keyword, pageable);
        return ResponseEntity.ok(resultPage);
    }

//    /**
//     *  매칭 단건 조회
//     */
//    @GetMapping("/{matchno}")
//    public ResponseEntity<MatchResponseDTO> getMatch(@PathVariable Long matchno) {
//        MatchResponseDTO response = matchService.getMatch(matchno);
//        return ResponseEntity.ok(response);
//    }
    
}
