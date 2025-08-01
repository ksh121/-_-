package dev.mvc.team5.talentcategory;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import dev.mvc.team5.talentcategory.talentcategorydto.TalentCategoryListDTO;
import dev.mvc.team5.talenttype.TalentType;
import jakarta.transaction.Transactional;

@Repository
public interface TalentCategoryRepository extends JpaRepository<TalentCategory, Long> {
  //name에 keyword가 포함된 결과만 페이징 + 정렬해서 가져옴
  Page<TalentCategory> findByNameContaining(String keyword, Pageable pageable);
  

  //일반 list에서 대분류 join fetch 하도록 추가 (JPQL or native query)
  @Query("SELECT c FROM TalentCategory c JOIN FETCH c.cateGrp")
  List<TalentCategory> findAllWithGroup();
  
  //페이징 + 검색용
  @Query(value = "SELECT c FROM TalentCategory c JOIN c.cateGrp g WHERE c.name LIKE %:keyword%",
        countQuery = "SELECT COUNT(c) FROM TalentCategory c WHERE c.name LIKE %:keyword%")
  Page<TalentCategory> findByNameContainingWithGroup(@Param("keyword") String keyword, Pageable pageable);
  
  // 자식 레코드 개수
  int countByCateGrpCateGrpno(Long cateGrpno);
  
  // 자식 레코드 삭제
  @Transactional
  int deleteByCateGrpCateGrpno(@Param("cateGrpno") Long cateGrpno);
  
  List<TalentCategory> findByCateGrpCateGrpno(Long cateGrpno);


  @Query("SELECT c.categoryno FROM TalentCategory c WHERE c.cateGrp.cateGrpno = :cateGrpno")
  List<Long> findCategorynosByCateGrpno(@Param("cateGrpno") Long cateGrpno);


}
