package dev.mvc.team5.talentcategrp;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.team5.talentcategory.TalentCategoryRepository;
import dev.mvc.team5.talentcategrp.talentcategrpdto.*;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/talent_cate_grp")
public class TalentCateGrpController {

  @Autowired
  private TalentCateGrpService service;
  
  @Autowired
  private TalentCategoryRepository cateRepository;
  
  @Autowired
  private TalentCateGrpRepository grpRepository;
  
  public TalentCateGrpController() {
    // 생성자 - 필요시 로깅 추가 가능
  }
  
  /**
   * 대분류 카테고리 등록
   * 
   * grpno가 없으면 신규 등록으로 처리됩니다.
   * 
   * @param dto 등록할 대분류 DTO
   * @return 등록된 대분류 정보를 담은 응답
   */
  @PostMapping("/save")
  public ResponseEntity<TalentCateGrpResponseDTO> createCateGrp(@RequestBody TalentCateGrpCreateDTO dto) {
    TalentCateGrpResponseDTO savedDto = service.save(dto);
    return ResponseEntity.ok(savedDto);
  }

  /**
   * 대분류 카테고리 수정
   * 
   * grpno가 있으면 해당 데이터 수정으로 처리됩니다.
   * 
   * @param dto 수정할 대분류 DTO
   * @return 수정된 대분류 정보를 담은 응답
   */
  @PutMapping("/update")
  public ResponseEntity<TalentCateGrpResponseDTO> updateType(@RequestBody TalentCateGrpUpdateDTO dto) {
    TalentCateGrpResponseDTO updateDto = service.update(dto);
    return ResponseEntity.ok(updateDto);
  }  

  /**
   * 해당 대분류에 속한 소분류 개수 조회
   * 
   * @param cateGrpno 대분류 번호
   * @return 해당 대분류에 속한 소분류 개수
   */
  @GetMapping("/check-deletable/{cateGrpno}")
  public ResponseEntity<Integer> checkDeletable(@PathVariable(name="cateGrpno") Long cateGrpno) {
    int count = cateRepository.countByCateGrpCateGrpno(cateGrpno);
    return ResponseEntity.ok(count);
  }
  
  /**
   * 대분류 및 해당하는 소분류 삭제
   * 
   * 1. 해당 대분류에 속한 소분류 먼저 삭제
   * 2. 대분류 삭제
   * 
   * @param cateGrpno 대분류 번호
   * @return 삭제 결과 메시지
   */
  @DeleteMapping("/delete/{cateGrpno}")
  public ResponseEntity<String> deleteCateGrp(@PathVariable(name="cateGrpno") Long cateGrpno) {
    int deletedCount = cateRepository.deleteByCateGrpCateGrpno(cateGrpno);
    grpRepository.deleteById(cateGrpno);
    return ResponseEntity.ok("대분류 및 소분류 " + deletedCount + "개 삭제 완료");
  }

  /**
   * 대분류 목록 조회 (검색, 페이징, 정렬 포함)
   * 
   * 기본 정렬: cateGrpno 내림차순
   * 
   * @param keyword 검색 키워드 (기본: "")
   * @param pageable 페이징 및 정렬 정보 (기본: size=5, cateGrpno desc)
   * @return 페이징된 대분류 목록 DTO 페이지
   */
  @GetMapping("/list")
  public ResponseEntity<Page<TalentCateGrpListDTO>> listTypes(
      @RequestParam(name = "keyword", defaultValue = "") String keyword,
      @PageableDefault(size = 5, sort = "cateGrpno", direction = Sort.Direction.DESC) Pageable pageable) {
    
    Page<TalentCateGrpListDTO> list = service.list(keyword, pageable);
    return ResponseEntity.ok(list);
  }
  
  /**
   * 대분류와 해당 중분류까지 포함된 전체 카테고리 구조 반환
   * - React 사이드바 등에 사용하기 적합
   * - 트리형 JSON 구조로 반환
   */
  @GetMapping("/all-with-sub")
  public ResponseEntity<List<TalentCateGrpWithSubDTO>> getAllWithSub() {
    List<TalentCateGrpWithSubDTO> result = service.getAllCateWithSub();
    return ResponseEntity.ok(result);
  }
}

