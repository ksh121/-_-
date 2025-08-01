package dev.mvc.team5.talentcategory;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryCreateDTO;
import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryListDTO;
import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryResponseDTO;
import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryUpdateDTO;
import dev.mvc.team5.talentcategrp.TalentCateGrp;
import dev.mvc.team5.talenttype.TalentType;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeCreateDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeListDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeResponseDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeUpdateDTO;
import jakarta.transaction.Transactional;

@Service
public class TalentCategoryService {

  @Autowired
  private TalentCategoryRepository cateRepository;
  
  /**
   * TalentCategory 엔티티를 TalentCategoryResponseDTO로 변환하는 헬퍼 메서드
   * @param t 변환할 TalentCategory 엔티티
   * @return 응답용 DTO 객체
   */
  private TalentCategoryResponseDTO toCategoryResponseDTO(TalentCategory t) {
    return new TalentCategoryResponseDTO(
        t.getCategoryno() != null ? t.getCategoryno() : null,
        t.getName(),
        t.getCateGrp() != null ? t.getCateGrp().getCateGrpno() : null,  // 외래키 ID만
        t.getCateGrp() != null ? t.getCateGrp().getName() : null
    );
  }
  
  /**
   * 타입 정보를 저장하는 메서드
   * @param dto 클라이언트로부터 전달받은 생성용 DTO (TalentCategoryCreateDTO)
   * @return 저장된 엔티티를 응답용 DTO로 변환하여 반환
   */
  public TalentCategoryResponseDTO save(TalentCategoryCreateDTO dto) {
    TalentCategory cate = dto.toEntity(); // DTO를 엔티티로 변환
    TalentCategory saved = cateRepository.save(cate); // 변환된 엔티티를 DB에 저장
    
    return toCategoryResponseDTO(saved); // 저장된 엔티티를 응답 DTO로 변환하여 반환
  }
  
  /**
   * TalentCategory 엔티티를 수정하는 메서드
   * 
   * @param dto 수정할 데이터를 담고 있는 TalentCategoryUpdateDTO 객체
   * @return 수정된 내용을 반영한 TalentCategoryResponseDTO 객체
   * @throws RuntimeException cateno에 해당하는 기존 데이터가 없을 경우 발생
   */
  public TalentCategoryResponseDTO update(TalentCategoryUpdateDTO dto) {
    TalentCategory existing = cateRepository.findById(dto.getCategoryno())
                               .orElseThrow(() -> new RuntimeException("해당 타입이 존재하지 않습니다."));

    existing.setName(dto.getName());

    if (dto.getCateGrpno() != null) {
        TalentCateGrp grp = new TalentCateGrp();
        grp.setCateGrpno(dto.getCateGrpno());
        existing.setCateGrp(grp);
    }

    TalentCategory updated = cateRepository.save(existing);
    return toCategoryResponseDTO(updated);
  }

  
  
  /**
   * 주어진 cateno를 가진 TalentCategory 데이터를 삭제하는 메서드
   *
   * cateno로 해당 데이터가 존재하는지 먼저 확인하고,
   * 존재하면 삭제하고, 존재하지 않으면 예외를 던진다.
   *
   * @param cateno 삭제할 TalentCategory의 고유 번호
   * @throws RuntimeException 삭제 대상이 존재하지 않을 경우 예외 발생
   */
  @Transactional
  public void delete(Long cateno) {
      // 1) 해당 cateno가 DB에 존재하는지 확인 (선택 사항)
      boolean exists = cateRepository.existsById(cateno);
      if (!exists) {
          throw new RuntimeException("삭제할 타입이 존재하지 않습니다.");
      }
      // 2) 삭제 수행
      cateRepository.deleteById(cateno);
  }
  
  public List<TalentCategoryListDTO> list() {
    List<TalentCategory> entityList = cateRepository.findAllWithGroup(); // 대분류 join 해서 가져오기

    return entityList.stream()
        .map(t -> new TalentCategoryListDTO(
            t.getCategoryno(),
            t.getName(),
            t.getCateGrp() != null ? t.getCateGrp().getName() : ""))  // 대분류 이름 추가
        .collect(Collectors.toList());
  }

  /**
   * 검색어가 있으면 name 기준 필터링,
   * 없으면 전체 목록 가져오되 cateno 기준 정렬 + 페이징
   */
  public Page<TalentCategoryListDTO> list(String keyword, Pageable pageable) {
      Page<TalentCategory> entityPage = cateRepository.findByNameContainingWithGroup(keyword, pageable);
  
      return entityPage.map(t -> new TalentCategoryListDTO(
          t.getCategoryno(),
          t.getName(),
          t.getCateGrp() != null ? t.getCateGrp().getName() : ""));
  }

  public List<TalentCategoryResponseDTO> findByCateGrpno(Long cateGrpno) {
    List<TalentCategory> list = cateRepository.findByCateGrpCateGrpno(cateGrpno);

    return list.stream()
        .map(category -> new TalentCategoryResponseDTO(
            category.getCategoryno(),
            category.getName(),
            category.getCateGrp().getCateGrpno(),
            category.getCateGrp().getName()
        ))
        .toList();
}



  
}
