package dev.mvc.team5.talenttype;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TalentTypeRepository extends JpaRepository<TalentType, Long> {

  //name에 keyword가 포함된 결과만 페이징 + 정렬해서 가져옴
  Page<TalentType> findByNameContaining(String keyword, Pageable pageable);
  
}
