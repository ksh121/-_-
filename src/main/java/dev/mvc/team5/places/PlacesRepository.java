package dev.mvc.team5.places;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PlacesRepository extends JpaRepository<Places, Long> {


    // 2. 이름 키워드 검색
    List<Places> findByPlacenameContaining(String keyword);

    // 3. 학교관 번호로 강의실 조회
    List<Places> findBySchoolGwan_Schoolgwanno(Long schoolgwanno);
    
    // 상세보기
    Optional<Places> findByPlaceno(Long placeno);
    
    
 // 특정 학교번호에 해당하는 모든 장소 가져오기 (관까지 탐색)
    List<Places> findBySchoolGwan_School_Schoolno(Long schoolno);
    
    // 특정 학교번호에 해당하는 특정 관 번호의 장소들 조회  ( 카테고리같은거
    List<Places> findBySchoolGwan_School_SchoolnoAndSchoolGwan_Schoolgwanno(Long schoolno, Long schoolgwanno);
    
    
    // 기본 조회
    @Query("SELECT p FROM Places p WHERE p.schoolGwan.school.schoolno = :schoolno")
    Page<Places> findBySchoolno(@Param("schoolno") Long schoolno, Pageable pageable);

    @Query("SELECT p FROM Places p WHERE p.schoolGwan.school.schoolno = :schoolno AND p.schoolGwan.schoolgwanno = :schoolgwanno")
    Page<Places> findBySchoolnoAndSchoolgwanno(@Param("schoolno") Long schoolno, @Param("schoolgwanno") Long schoolgwanno, Pageable pageable);
    
    // placename으로 장소를 찾는 메서드
    @Query("SELECT p FROM Places p WHERE LOWER(p.placename) = LOWER(:placename)")
    Places findByPlacenameIgnoreCase(@Param("placename") String placename);
		 
		 
	// 학교 전체 + 검색
		 @Query("SELECT p FROM Places p WHERE p.schoolGwan.school.schoolno = :schoolno AND p.placename LIKE %:keyword%")
		 Page<Places> searchBySchoolAndKeyword(@Param("schoolno") Long schoolno,
		                                       @Param("keyword") String keyword,
		                                       Pageable pageable);

		 // 학교 + 관 + 검색
		 @Query("SELECT p FROM Places p WHERE p.schoolGwan.school.schoolno = :schoolno AND p.schoolGwan.schoolgwanno = :schoolgwanno AND p.placename LIKE %:keyword%")
		 Page<Places> searchBySchoolAndGwanAndKeyword(@Param("schoolno") Long schoolno,
		                                              @Param("schoolgwanno") Long schoolgwanno,
		                                              @Param("keyword") String keyword,
		                                              Pageable pageable);
		 
		 
}