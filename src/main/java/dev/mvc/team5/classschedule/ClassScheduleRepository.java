package dev.mvc.team5.classschedule;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassScheduleRepository extends JpaRepository<ClassSchedule, Long> {
  
    // 장소 번호로 스케줄 조회
    List<ClassSchedule> findByPlace_Placeno(Long placeno);

}
