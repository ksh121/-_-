package dev.mvc.team5.talentcategory;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryCreateDTO;
import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryListDTO;
import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryResponseDTO;
import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryUpdateDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeCreateDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeListDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeResponseDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeUpdateDTO;

@RestController
@RequestMapping("/talent_category")
public class TalentCategoryController {

  @Autowired
  private TalentCategoryService service;
  
  
  public TalentCategoryController() {
    // System.out.println("-> TalentCateGrpController created.");
  }
  
  /**
   * 카테고리 타입 등록
   * 
   * cateo가 없는 상태로 전달되면 새로운 데이터로 인식되어 INSERT 쿼리가 실행됩니다.
   *
   * @param entity 등록할 TalentCate 객체 (요청 본문에 포함됨)
   * @return 등록된 TalentType 객체를 포함한 HTTP 200 응답
   */
  @PostMapping(path="/save")
  public ResponseEntity<TalentCategoryResponseDTO> createCategory(@RequestBody TalentCategoryCreateDTO dto) {
      // System.out.println("-> 카테고리 대분류 추가: " + entity.getName());
    TalentCategoryResponseDTO savedDto = service.save(dto);
      return ResponseEntity.ok(savedDto);
  }

  /**
   * 카테고리 타입 수정
   * 
   * cateno가 포함된 상태로 전달되면 기존 데이터로 인식되어 UPDATE 쿼리가 실행됩니다.
   *
   * @param entity 수정할 TalentCategory 객체 (요청 본문에 포함됨)
   * @return 수정된 TalentCategory 객체를 포함한 HTTP 200 응답
   */
  @PutMapping("/update")
  public ResponseEntity<TalentCategoryResponseDTO> updateCategory(@RequestBody TalentCategoryUpdateDTO dto) {
      // System.out.println("-> 카테고리 대분류 수정: " + entity.getName());

    TalentCategoryResponseDTO updateDto = service.update(dto);
      return ResponseEntity.ok(updateDto);
  }
  
  /**
   * 주어진 cateno를 가진 TalentCategory 데이터를 삭제하는 컨트롤러 메서드
   *
   * @param typeno 삭제할 TalentCategory의 고유 번호 (경로 변수로 전달됨)
   * @return 삭제 성공 메시지를 포함한 HTTP 200 응답
   */
  @DeleteMapping("/delete/{cateno}")
  public ResponseEntity<String> deleteCategory(@PathVariable(name="cateno") Long cateno) {
      service.delete(cateno); // 서비스에서 삭제 처리
      return ResponseEntity.ok("삭제 성공"); // 응답 반환
  }
  
  
  /**
   * 전체 목록 조회 (검색 + 정렬 + 페이징 처리)
   * 
   * 기본 정렬은 cateno 내림차순 (최근순)
   * 
   * @param keyword 검색 키워드 (기본: "")
   * @param pageable 페이지/정렬 정보 (기본: size=10, cateno desc)
   */
  @GetMapping("/list")
  public ResponseEntity<Page<TalentCategoryListDTO>> listTypes(
      @RequestParam(name="keyword", defaultValue = "") String keyword,
      @PageableDefault(size = 5, sort = "categoryno", direction = Sort.Direction.DESC)
      Pageable pageable
  ) {
      Page<TalentCategoryListDTO> list = service.list(keyword, pageable);
      return ResponseEntity.ok(list);
  }
  
  @GetMapping("/list-by-categrp/{cateGrpno}")
  public ResponseEntity<List<TalentCategoryResponseDTO>> listByCateGrp(@PathVariable(name="cateGrpno") Long cateGrpno) {
      List<TalentCategoryResponseDTO> list = service.findByCateGrpno(cateGrpno);
      return ResponseEntity.ok(list);
  }
  
  

  
  
}
