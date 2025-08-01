package dev.mvc.team5.talentcategrp;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import dev.mvc.team5.talenttype.TalentType;

@Repository
public interface TalentCateGrpRepository extends JpaRepository<TalentCateGrp, Long> {

  //name에 keyword가 포함된 결과만 페이징 + 정렬해서 가져옴
  Page<TalentCateGrp> findByNameContaining(String keyword, Pageable pageable);
  
  // name으로 존재 여부 확인
  boolean existsByName(String name);  
  
}
