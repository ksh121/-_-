package dev.mvc.team5.schoolgwan;

import java.util.List;
import java.util.Optional;

public interface SchoolGwanService {
	
		//등록
    SchoolGwan create(SchoolGwanDTO dto);
    
    //목록
    List<SchoolGwan> findAll();
    
    //조회
    Optional<SchoolGwan> findById(Long schoolgwanno);
    
    //수정
    SchoolGwan update(Long schoolgwanno, SchoolGwanDTO dto);
    
    //삭제
    void delete(Long schoolgwanno);
    
//    // 특정 학교의 관 조회
//    List<SchoolGwanDTO> findBySchoolNo(Long schoolno);
    
//    List<SchoolGwan> getGwanBySchoolno(Long schoolno);
}
