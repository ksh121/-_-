package dev.mvc.team5.talenttype;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service; 

import dev.mvc.team5.talenttype.talenttypedto.TalentTypeCreateDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeListDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeResponseDTO;
import dev.mvc.team5.talenttype.talenttypedto.TalentTypeUpdateDTO;

@Service 
public class TalentTypeService {

  @Autowired 
  private TalentTypeRepository typeRepository;
  
  /**
   * TalentType 엔티티를 TalentTypeResponseDTO로 변환하는 헬퍼 메서드
   * @param t 변환할 TalentType 엔티티
   * @return 응답용 DTO 객체
   */
  private TalentTypeResponseDTO toTypeResponseDTO(TalentType t) {
    return new TalentTypeResponseDTO(
        t.getTypeno() != null ? t.getTypeno() : null, // null 체크 후 typeno 반환
        t.getName() // 엔티티의 name 필드 값 반환
        );
  }
  
  /**
   * 타입 정보를 저장하는 메서드
   * @param dto 클라이언트로부터 전달받은 생성용 DTO (TalentTypeCreateDTO)
   * @return 저장된 엔티티를 응답용 DTO로 변환하여 반환
   */
  public TalentTypeResponseDTO save(TalentTypeCreateDTO dto) {
    TalentType type = dto.toEntity(); // DTO를 엔티티로 변환
    TalentType saved = typeRepository.save(type); // 변환된 엔티티를 DB에 저장
    
    return toTypeResponseDTO(saved); // 저장된 엔티티를 응답 DTO로 변환하여 반환
  }
  
  /**
   * TalentType 엔티티를 수정하는 메서드
   * 
   * @param dto 수정할 데이터를 담고 있는 TalentTypeUpdateDTO 객체
   * @return 수정된 내용을 반영한 TalentTypeResponseDTO 객체
   * @throws RuntimeException typeno에 해당하는 기존 데이터가 없을 경우 발생
   */
  public TalentTypeResponseDTO update(TalentTypeUpdateDTO dto) {
    // typeno로 기존 데이터 조회
    TalentType existing = typeRepository.findById(dto.getTypeno())
                               .orElseThrow(() -> new RuntimeException("해당 타입이 존재하지 않습니다."));

    // 변경할 값만 업데이트
    existing.setName(dto.getName());
    // 저장
    TalentType updated = typeRepository.save(existing);
    // DTO로 변환해서 반환
    return toTypeResponseDTO(updated);
}
  
  
  /**
   * 주어진 typeno를 가진 TalentType 데이터를 삭제하는 메서드
   *
   * typeno로 해당 데이터가 존재하는지 먼저 확인하고,
   * 존재하면 삭제하고, 존재하지 않으면 예외를 던진다.
   *
   * @param typeno 삭제할 TalentType의 고유 번호
   * @throws RuntimeException 삭제 대상이 존재하지 않을 경우 예외 발생
   */
  public void delete(Long typeno) {
      // 1) 해당 typeno가 DB에 존재하는지 확인 (선택 사항)
      boolean exists = typeRepository.existsById(typeno);
      if (!exists) {
          throw new RuntimeException("삭제할 타입이 존재하지 않습니다.");
      }

      // 2) 삭제 수행
      typeRepository.deleteById(typeno);
  }
  
  public List<TalentTypeListDTO> list() {
    List<TalentType> entityList = typeRepository.findAll(); // DB에서 전체 조회

    // 람다식으로 DTO 변환
    return entityList.stream()
        .map(t -> new TalentTypeListDTO(t.getTypeno(), t.getName()))
        .collect(Collectors.toList());

    /*
    // 전통적인 for문 방식
    List<TalentTypeListDTO> dtoList = new ArrayList<>();
    for (TalentType t : entityList) {
        TalentTypeListDTO dto = new TalentTypeListDTO(t.getTypeno(), t.getName());
        dtoList.add(dto);
    }
    return dtoList;
    */
}
  
  /**
   * 검색어가 있으면 name 기준 필터링,
   * 없으면 전체 목록 가져오되 typeno 기준 정렬 + 페이징
   */
  public Page<TalentTypeListDTO> list(String keyword, Pageable pageable) {
      Page<TalentType> entityPage = typeRepository.findByNameContaining(keyword, pageable);

      // Entity → DTO 변환
      return entityPage.map(t -> new TalentTypeListDTO(t.getTypeno(), t.getName()));
  }


  
  
}
