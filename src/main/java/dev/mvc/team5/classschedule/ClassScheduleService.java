package dev.mvc.team5.classschedule;

import java.util.List;
import java.util.Optional;

public interface ClassScheduleService {

    // 새 강의 스케줄 등록
    ClassSchedule save(ClassScheduleDTO dto);

    // 강의 스케줄 상세 조회 by scheduleno
    Optional<ClassSchedule> findById(Long scheduleno);

    // 모든 강의 스케줄 리스트 조회
    List<ClassSchedule> findAll();

    // 강의 스케줄 수정
    ClassSchedule update(Long scheduleno, ClassScheduleDTO dto);

    // 강의 스케줄 삭제
    void delete(Long scheduleno);

    // 장소(placeno)로 스케줄 리스트 조회
    List<ClassSchedule> findByPlaceNo(Long placeno);

}
