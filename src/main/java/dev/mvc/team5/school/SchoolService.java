package dev.mvc.team5.school;

import java.util.List;
import java.util.Optional;

public interface SchoolService {
	
		// 등록
    School create(SchoolDTO dto);
    
    // 조회
    Optional<School> findById(Long schoolno);
    
    // 목록
    List<School> findAll();
    
    ///수정
    School update(Long schoolno, SchoolDTO dto);
    
    //삭제
    void delete(Long schoolno);
}
