package dev.mvc.team5.talents;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.team5.talents.talentdto.TalentCreateDTO;
import dev.mvc.team5.talents.talentdto.TalentDetailDTO;
import dev.mvc.team5.talents.talentdto.TalentListDTO;
import dev.mvc.team5.talents.talentdto.TalentResponseDTO;
import dev.mvc.team5.talents.talentdto.TalentUpdateDTO;

import jakarta.servlet.http.HttpSession;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/talent")
public class TalentController {

    @Autowired
    private TalentService service;

    /**
     *  재능 등록 (Create)
     * TalentCreateDTO: 제목, 설명, 가격, 타입, 카테고리, 파일 정보 등 포함
     *  등록된 재능의 TalentResponseDTO 반환
     */
    @PostMapping("/save")
    public ResponseEntity<TalentResponseDTO> createTalent(@RequestBody TalentCreateDTO dto) {
        TalentResponseDTO savedDto = service.save(dto);
        return ResponseEntity.ok(savedDto);
    }

    /**
     *  전체 재능 목록 조회
     * List<TalentListDTO>: 모든 재능 요약 리스트 반환
     */
    @GetMapping("/list")
    public ResponseEntity<List<TalentListDTO>> getAllTalents() {
        List<TalentListDTO> list = service.findAll();
        return ResponseEntity.ok(list);
    }

    /**
     *  재능 단건 조회
     *  talentno: PathVariable (재능 번호)
     *  해당 재능의 TalentResponseDTO, 없으면 404
     */
    @GetMapping("/{talentno}")
    public ResponseEntity<TalentResponseDTO> getTalent(@PathVariable(name="talentno") Long talentno) {
        Optional<TalentResponseDTO> optionalDto = service.findById(talentno);
        return optionalDto.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     *  재능 삭제
     *  talentno: PathVariable
     *  HttpSession: 현재 로그인 사용자 확인
     *  삭제 결과 문자열 응답 ("삭제 완료" or 에러 메시지)
     *  비로그인 시 401, 권한 없을 시 403, 존재하지 않으면 404
     */
    @DeleteMapping("/delete/{talentno}")
    public ResponseEntity<String> deleteTalent(@PathVariable(name="talentno") Long talentno, HttpSession session) {
        Long loggedInUserNo = (Long) session.getAttribute("userno");
        if (loggedInUserNo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용해주세요.");
        }

        try {
            service.delete(talentno, loggedInUserNo);
            return ResponseEntity.ok("삭제 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    /**
     *  특정 학교의 재능 목록 조회
     *  schoolno: PathVariable
     *  해당 학교의 재능 리스트
     */
    @GetMapping("/list-by-school/{schoolno}")
    public ResponseEntity<List<TalentListDTO>> getTalentsBySchool(@PathVariable(name="schoolno") Long schoolno) {
        return ResponseEntity.ok(service.findBySchoolno(schoolno));
    }

    /**
     *  특정 학교 + 카테고리 재능 목록 조회
     *  schoolno, categoryno: QueryParam
     *  조건에 맞는 재능 리스트
     */
    @GetMapping("/list-by-school-and-category")
    public ResponseEntity<List<TalentListDTO>> getTalentsBySchoolAndCategory(
            @RequestParam(name="schoolno") Long schoolno,
            @RequestParam(name="categoryno") Long categoryno) {
        return ResponseEntity.ok(service.findBySchoolnoAndCategoryno(schoolno, categoryno));
    }

    /**
     *  상세 페이지 조회 (파일 포함)
     *  talentno: PathVariable
     *  TalentDetailDTO: 작성자 정보, 파일 리스트, 조회수 포함
     * ⚠️ 존재하지 않으면 404
     */
    @GetMapping("/detail/{talentno}")
    public ResponseEntity<TalentDetailDTO> getTalentDetail(@PathVariable(name="talentno") Long talentno) {
        try {
            TalentDetailDTO dto = service.getTalentDetailWithFiles(talentno);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     *  재능 검색 (필터 + 페이징)
     *  keyword: 제목/설명 검색 키워드
     *  cateGrpno, categoryno: 대/소분류
     *  schoolno: 학교 번호
     *  page, size: 페이징
     *  session: 로그인 사용자(userno)를 차단 필터링용으로 사용
     *  Page<TalentListDTO>: 필터링된 재능 결과
     */
    @GetMapping("/search")
    public ResponseEntity<Page<TalentListDTO>> searchTalents(
            @RequestParam(name="keyword", required = false) String keyword,
            @RequestParam(name="cateGrpno", required = false) Long cateGrpno,
            @RequestParam(name="categoryno", required = false) Long categoryno,
            @RequestParam(name="schoolno", required = false) Long schoolno,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            HttpSession session) {

        Long loggedInUserno = (Long) session.getAttribute("userno");
        Page<TalentListDTO> resultPage = service.searchTalents(keyword, cateGrpno, categoryno, schoolno, page, size, loggedInUserno);
        return ResponseEntity.ok(resultPage);
    }

    /**
     *  재능 수정
     *  talentno: PathVariable
     *  dto: 수정 내용
     *  session: 현재 로그인 유저 정보
     *  수정된 TalentResponseDTO 또는 에러 메시지
     *  권한 없거나 존재하지 않을 경우 적절한 에러 반환
     */
    @PutMapping("/update/{talentno}")
    public ResponseEntity<?> updateTalent(@PathVariable(name="talentno") Long talentno, @RequestBody TalentUpdateDTO dto, HttpSession session) {
        Long loggedInUserNo = (Long) session.getAttribute("userno");

        if (loggedInUserNo == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용해주세요.");
        }

        dto.setTalentno(talentno);  // 강제로 ID 세팅 (보안상 더 안전)

        try {
            TalentResponseDTO updatedDto = service.update(dto, loggedInUserNo);
            return ResponseEntity.ok(updatedDto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    /**
     *  마이페이지 - 내 게시글 목록 (필터 + 검색 + 페이징)
     *  keyword, categoryno, schoolno: 검색 조건
     *  page, size: 페이징
     *  session: 로그인 사용자 확인용
     *  내 재능 글 목록 (Page<TalentListDTO>)
     *  로그인 필수
     */
    @GetMapping("/my-talents")
    public ResponseEntity<Page<TalentListDTO>> getMyTalents(
            @RequestParam(name="keyword",required = false) String keyword,
            @RequestParam(name="categoryno", required = false) Long categoryno,
            @RequestParam(name="schoolno",required = false) Long schoolno,
            @RequestParam(name="page", defaultValue = "0") int page,
            @RequestParam(name="size", defaultValue = "10") int size,
            HttpSession session) {

        Long loggedInUserno = (Long) session.getAttribute("userno");
        if (loggedInUserno == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Page<TalentListDTO> resultPage = service.searchMyTalents(keyword, categoryno, schoolno, page, size, loggedInUserno);
        return ResponseEntity.ok(resultPage);
    }

    /**
     *  특정 유저가 작성한 모든 게시글 목록 조회 (공개 프로필용)
     *  userno: PathVariable
     *  List<TalentListDTO>: 해당 유저가 작성한 게시글 리스트
     */
    @GetMapping("/user/{userno}/posts")
    public ResponseEntity<List<TalentListDTO>> getTalentsByUser(@PathVariable(name="userno")  Long userno) {
        return ResponseEntity.ok(service.findTalentsByUserno(userno));
    }

    /**
     *  특정 유저의 게시글 수 조회 (프로필 요약 등에서 사용)
     *  userno: QueryParam
     *  long: 총 게시글 수
     */
    @GetMapping("/count-by-user")
    public ResponseEntity<Long> getTalentCountByUser(@RequestParam(name="userno") Long userno) {
        return ResponseEntity.ok(service.countTalentsByUserno(userno));
    }
}
