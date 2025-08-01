package dev.mvc.team5.schoolgwan;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolGwanRepository extends JpaRepository<SchoolGwan, Long> {

    // 특정 학교에 속한 학교관 목록
    List<SchoolGwan> findBySchool_Schoolno(Long schoolno);
    
//    List<SchoolGwan> findBySchoolno(Long schoolno);
}
