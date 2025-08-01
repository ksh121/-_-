package dev.mvc.team5.talents;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.mvc.team5.talents.talentdto.TalentDetailDTO;

@Repository
public interface TalentRepository extends JpaRepository<Talent, Long> {

    /**
     * ✅ [JPA 메서드] 특정 학교의 재능 게시글 목록 조회
     * 📥 schoolno: 학교 고유 번호
     * 📤 List<Talent>: 해당 학교에 속한 모든 재능 글
     */
    List<Talent> findBySchool_Schoolno(Long schoolno);

    /**
     * ✅ [JPA 메서드] 특정 학교 + 특정 카테고리 조건의 재능 글 목록 조회
     * 📥 schoolno: 학교 고유 번호
     * 📥 categoryno: 카테고리 고유 번호
     * 📤 List<Talent>: 조건에 해당하는 재능 글 목록
     */
    List<Talent> findBySchool_SchoolnoAndCategory_Categoryno(Long schoolno, Long categoryno);

    /**
     * ✅ [JPQL] 재능 상세 정보 DTO 단일 조회 (JOIN을 통해 사용자, 타입, 카테고리 등 정보 포함)
     * 📥 talentno: 재능 글 고유 번호
     * 📤 TalentDetailDTO: 화면에 바로 전달 가능한 상세 전용 DTO
     * 📌 엔티티 전체를 불러오지 않고 필요한 필드만 추출
     */
    @Query("""
        SELECT new dev.mvc.team5.talents.talentdto.TalentDetailDTO(
            t.talentno,
            t.user.userno,
            t.type.name,
            t.category.cateGrp.name,
            t.category.name,
            t.title,
            t.description,
            t.price,
            t.viewCount,
            t.user.username,
            t.createdAt,
            t.updatedAt
        ) FROM Talent t
        WHERE t.talentno = :talentno
    """)
    TalentDetailDTO findDetailByTalentno(@Param("talentno") Long talentno);

    /**
     * ✅ [JPQL + FETCH JOIN] 파일 및 사용자 정보를 함께 로딩하는 단건 조회
     * 📥 talentno: 재능 글 고유 번호
     * 📤 Optional<Talent>: 연관 엔티티(t.files, t.user)까지 포함된 Talent 엔티티
     * 📌 상세 페이지에서 Lazy 로딩 이슈 방지를 위해 사용
     */
    @Query("""
        SELECT t FROM Talent t
        LEFT JOIN FETCH t.files
        LEFT JOIN FETCH t.user
        WHERE t.talentno = :talentno
    """)
    Optional<Talent> findByIdWithFiles(@Param("talentno") Long talentno);

    /**
     * ✅ [JPQL] 검색 조건(키워드 + 카테고리 + 학교)에 따라 재능 리스트 조회 (페이징 포함)
     * 📥 keyword: 제목 또는 설명에 포함될 키워드 (nullable)
     * 📥 categoryno: 카테고리 번호 (nullable)
     * 📥 schoolno: 학교 번호 (nullable)
     * 📥 pageable: 페이징 정보
     * 📤 Page<Talent>: 조건에 해당하는 재능 페이지
     */
    @Query("""
        SELECT t FROM Talent t
        WHERE (:keyword IS NULL OR t.title LIKE CONCAT('%', :keyword, '%') OR t.description LIKE CONCAT('%', :keyword, '%'))
          AND (:categoryno IS NULL OR t.category.categoryno = :categoryno)
          AND (:schoolno IS NULL OR t.school.schoolno = :schoolno)
    """)
    Page<Talent> searchWithFilters(
        @Param("keyword") String keyword,
        @Param("categoryno") Long categoryno,
        @Param("schoolno") Long schoolno,
        Pageable pageable
    );

    /**
     * ✅ [JPQL] 마이페이지 전용 - 로그인한 사용자의 재능 글 검색
     * 📥 keyword: 키워드 (nullable)
     * 📥 categoryno: 카테고리 번호 (nullable)
     * 📥 schoolno: 학교 번호 (nullable)
     * 📥 userno: 로그인한 사용자 번호 (필수)
     * 📥 pageable: 페이징 정보
     * 📤 Page<Talent>: 해당 유저의 검색 결과
     * ⚠️ 반드시 userno는 NOT NULL이어야 함
     */
    @Query("""
        SELECT t FROM Talent t
        WHERE (:keyword IS NULL OR t.title LIKE %:keyword% OR t.description LIKE %:keyword%)
          AND (:categoryno IS NULL OR t.category.categoryno = :categoryno)
          AND (:schoolno IS NULL OR t.school.schoolno = :schoolno)
          AND t.user.userno = :userno
    """)
    Page<Talent> searchWithFilters(
        @Param("keyword") String keyword,
        @Param("categoryno") Long categoryno,
        @Param("schoolno") Long schoolno,
        @Param("userno") Long userno,
        Pageable pageable
    );

    /**
     * ✅ [JPQL] 대분류 카테고리에 속한 소분류(categorynos) 중 포함된 재능 글 검색
     * 📥 categorynos: 소분류 번호 리스트
     * 📥 keyword: 키워드 (nullable)
     * 📥 schoolno: 학교 번호 (nullable)
     * 📥 pageable: 페이징 정보
     * 📤 Page<Talent>: 필터링된 재능 페이지
     * 📌 cateGrpno로 직접 검색하지 않고, 소분류 리스트 기반으로 조회
     */
    @Query("""
        SELECT t FROM Talent t
        WHERE (:keyword IS NULL OR t.title LIKE %:keyword% OR t.description LIKE %:keyword%)
          AND (:schoolno IS NULL OR t.school.schoolno = :schoolno)
          AND (COALESCE(:categorynos, NULL) IS NULL OR t.category.categoryno IN :categorynos)
    """)
    Page<Talent> findByCategorynosInAndFilters(
        @Param("categorynos") List<Long> categorynos,
        @Param("keyword") String keyword,
        @Param("schoolno") Long schoolno,
        Pageable pageable
    );

    /**
     * ✅ [JPA 메서드] 사용자별 재능 글 수 조회
     * 📥 userno: 사용자 고유 번호
     * 📤 long: 해당 사용자의 총 게시글 수
     * 📌 프로필 요약 등에서 활용
     */
    long countByUser_Userno(Long userno);

    /**
     * ✅ [JPA 메서드] 사용자별 전체 재능 글 목록 조회
     * 📥 userno: 사용자 고유 번호
     * 📤 List<Talent>: 해당 사용자의 재능 목록
     */
    List<Talent> findByUser_Userno(Long userno);
}
