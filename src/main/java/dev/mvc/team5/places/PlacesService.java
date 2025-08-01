package dev.mvc.team5.places;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * PlacesService
 * 강의실(장소) 관련 기능들의 인터페이스 정의.
 * 컨트롤러는 이 인터페이스를 통해 서비스 계층을 호출함.
 */
public interface PlacesService {

    /**
     * 강의실 등록
     * @param dto 등록할 PlacesDTO 객체
     * @return 저장된 Places Entity
     */
    Places save(PlacesDTO dto); 

    /**
     * 특정 강의실 조회
     * @param placeId PK (장소 번호)
     * @return 해당 placeId에 대한 Places Entity (Optional)
     */
    Optional<Places> findById(Long placeId);

    /**
     * 전체 강의실 목록 조회
     * @return 모든 Places 리스트
     */
    List<Places> findAll();

    /**
     * 강의실 정보 수정
     * @param placeId 수정 대상 장소 번호
     * @param dto 수정할 데이터 DTO
     * @return 수정된 Places Entity
     */
    Places update(Long placeId, PlacesDTO dto);

    /**
     * 강의실 삭제
     * @param placeId 삭제할 장소 번호
     */
    void delete(Long placeId); 

    /**
     * 특정 강의실 이름으로 검색
     * @param keyword 검색어
     * @return 검색 결과 리스트
     */
    List<Places> searchByPlacename(String keyword);

    /**
     * 특정 학교관에 속한 강의실만 조회
     * @param schoolgwanno 학교관 번호
     * @return 해당 관에 속한 PlacesDTO 리스트
     */
    List<PlacesDTO> findBySchoolGwanNo(Long schoolgwanno);

    /**
     * 장소 상세보기 DTO
     * @param placeno 장소 번호
     * @return PlacesDTO (Optional)
     */
    Optional<PlacesDTO> findByPlaceno(Long placeno);

    /**
     * 학교 번호로 장소 찾기
     * @param schoolno 학교 번호
     * @return 해당 학교에 속한 PlacesDTO 리스트
     */
    List<PlacesDTO> findBySchoolno(Long schoolno);

    /**
     * 학교 + 학교관으로 장소 찾기
     * @param schoolno 학교 번호
     * @param schoolgwanno 학교관 번호
     * @return 해당 조건에 맞는 PlacesDTO 리스트
     */
    List<PlacesDTO> findBySchoolnoAndSchoolgwanno(Long schoolno, Long schoolgwanno);

    /**
     * 학교 번호 기반 페이징 조회
     */
    Page<Places> findPlacesBySchool(Long schoolno, Pageable pageable);

    /**
     * 학교 + 학교관 페이징 조회
     */
    Page<Places> findPlacesBySchoolAndGwan(Long schoolno, Long schoolgwanno, Pageable pageable);

    /**
     * 학교 + 학교관 + 검색 키워드 페이징 조회
     */
    Page<Places> searchPlacesBySchoolAndGwan(Long schoolno, Long schoolgwanno, String keyword, Pageable pageable);

    /**
     * 학교 + 검색 키워드 페이징 조회
     */
    Page<Places> searchPlacesBySchool(Long schoolno, String keyword, Pageable pageable);
}
