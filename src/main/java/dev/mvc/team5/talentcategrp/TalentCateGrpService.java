package dev.mvc.team5.talentcategrp;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import dev.mvc.team5.talentcategory.TalentCategoryRepository;
import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategorySimpleDTO;
import dev.mvc.team5.talentcategrp.talentcategrpdto.TalentCateGrpCreateDTO;
import dev.mvc.team5.talentcategrp.talentcategrpdto.TalentCateGrpListDTO;
import dev.mvc.team5.talentcategrp.talentcategrpdto.TalentCateGrpResponseDTO;
import dev.mvc.team5.talentcategrp.talentcategrpdto.TalentCateGrpUpdateDTO;
import dev.mvc.team5.talentcategrp.talentcategrpdto.TalentCateGrpWithSubDTO;
import dev.mvc.team5.talenttype.TalentType;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeCreateDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeListDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeResponseDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeUpdateDTO;
import jakarta.transaction.Transactional;

@Service
public class TalentCateGrpService {

  @Autowired
  private TalentCateGrpRepository grpRepository;
  
  @Autowired
  private TalentCategoryRepository cateRepository;
  
  /**
   * TalentCateGrp 엔티티를 TalentCateGrpResponseDTO로 변환하는 헬퍼 메서드
   * @param t 변환할 TalentCateGrp 엔티티
   * @return 응답용 DTO 객체
   */
  private TalentCateGrpResponseDTO toCateGrpResponseDTO(TalentCateGrp t) {
    return new TalentCateGrpResponseDTO(
        t.getCateGrpno() != null ? t.getCateGrpno() : null, // null 체크 후 grpno 반환
        t.getName() // 엔티티의 name 필드 값 반환
        );
  }
  
  /**
   * 타입 정보를 저장하는 메서드
   * @param dto 클라이언트로부터 전달받은 생성용 DTO (TalentTypeCreateDTO)
   * @return 저장된 엔티티를 응답용 DTO로 변환하여 반환
   */
  public TalentCateGrpResponseDTO save(TalentCateGrpCreateDTO dto) {
    if (grpRepository.existsByName(dto.getName())) {
      throw new IllegalArgumentException("이미 존재하는 카테고리입니다.");
  }
    TalentCateGrp grp = dto.toEntity(); // DTO를 엔티티로 변환
    TalentCateGrp saved = grpRepository.save(grp); // 변환된 엔티티를 DB에 저장   
    
    return toCateGrpResponseDTO(saved); // 저장된 엔티티를 응답 DTO로 변환하여 반환
  }
  
  /**
   * TalentCateGrp 엔티티를 수정하는 메서드
   * 
   * @param dto 수정할 데이터를 담고 있는 TalentCateGrpUpdateDTO 객체
   * @return 수정된 내용을 반영한 TalentCateGrpResponseDTO 객체
   * @throws RuntimeException grpno에 해당하는 기존 데이터가 없을 경우 발생
   */
  public TalentCateGrpResponseDTO update(TalentCateGrpUpdateDTO dto) {
    // typeno로 기존 데이터 조회
    TalentCateGrp existing = grpRepository.findById(dto.getCateGrpno())
                               .orElseThrow(() -> new RuntimeException("해당 타입이 존재하지 않습니다."));

    // 변경할 값만 업데이트
    existing.setName(dto.getName());
    // 저장
    TalentCateGrp updated = grpRepository.save(existing);
    // DTO로 변환해서 반환
    return toCateGrpResponseDTO(updated);
}
  
  
  /**
   * 주어진 grpno를 가진 TalentCateGrp 데이터를 삭제하는 메서드
   *
   * grpno로 해당 데이터가 존재하는지 먼저 확인하고,
   * 존재하면 삭제하고, 존재하지 않으면 예외를 던진다.
   *
   * @param grpno 삭제할 TalentCateGrp의 고유 번호
   * @throws RuntimeException 삭제 대상이 존재하지 않을 경우 예외 발생
   */
  @Transactional
  public void delete(Long grpno) {
      // 1) 해당 grpno가 DB에 존재하는지 확인 (선택 사항)
      boolean exists = grpRepository.existsById(grpno);
      if (!exists) {
          throw new RuntimeException("삭제할 타입이 존재하지 않습니다.");
      }      
      // 2) 자식 소분류부터 모두 삭제
      cateRepository.deleteByCateGrpCateGrpno(grpno);
      // 3) 부모 대분류 삭제
      grpRepository.deleteById(grpno);
      
  }
  
  public List<TalentCateGrpListDTO> list() {
    List<TalentCateGrp> entityList = grpRepository.findAll(); // DB에서 전체 조회

    // 람다식으로 DTO 변환
    return entityList.stream()
        .map(t -> new TalentCateGrpListDTO(t.getCateGrpno(), t.getName()))
        .collect(Collectors.toList());
}
  
  /**
   * 검색어가 있으면 name 기준 필터링,
   * 없으면 전체 목록 가져오되 grpno 기준 정렬 + 페이징
   */
  public Page<TalentCateGrpListDTO> list(String keyword, Pageable pageable) {
      Page<TalentCateGrp> entityPage = grpRepository.findByNameContaining(keyword, pageable);

      // Entity → DTO 변환
      return entityPage.map(t -> new TalentCateGrpListDTO(t.getCateGrpno(), t.getName()));
  }
  
  /**
   * 대분류 + 해당하는 중분류들을 함께 반환하는 메서드
   * @return List<TalentCateGrpWithSubDTO> - 트리형 카테고리 구조
   */
  public List<TalentCateGrpWithSubDTO> getAllCateWithSub() {
    return grpRepository.findAll().stream()
        .map(grp -> new TalentCateGrpWithSubDTO(
            grp.getCateGrpno(),
            grp.getName(), 
            grp.getCategories().stream()
                .map(cat -> new TalentCategorySimpleDTO(cat.getCategoryno(), cat.getName()))
                .collect(Collectors.toList())
        ))
        .collect(Collectors.toList());
  }
  
}
