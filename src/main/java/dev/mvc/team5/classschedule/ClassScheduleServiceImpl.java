package dev.mvc.team5.classschedule;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import dev.mvc.team5.places.Places;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClassScheduleServiceImpl implements ClassScheduleService {

    private final ClassScheduleRepository classScheduleRepository;

    @Override
    public ClassSchedule save(ClassScheduleDTO dto) {
        ClassSchedule schedule = new ClassSchedule();
        schedule.setPlace(new Places(dto.getPlaceno()));
        schedule.setDay(dto.getDay());
        schedule.setStartTime(LocalTime.parse(dto.getStartTime()));
        schedule.setEndTime(LocalTime.parse(dto.getEndTime()));
        return classScheduleRepository.save(schedule);
    }

    @Override
    public Optional<ClassSchedule> findById(Long scheduleno) {
        return classScheduleRepository.findById(scheduleno);
    }

    @Override
    public List<ClassSchedule> findAll() {
        return classScheduleRepository.findAll();
    }

    @Override
    public ClassSchedule update(Long scheduleno, ClassScheduleDTO dto) {
        ClassSchedule schedule = classScheduleRepository.findById(scheduleno)
                .orElseThrow(() -> new IllegalArgumentException("스케줄이 존재하지 않습니다."));

        schedule.setPlace(new Places(dto.getPlaceno()));
        schedule.setDay(dto.getDay());
        schedule.setStartTime(LocalTime.parse(dto.getStartTime()));
        schedule.setEndTime(LocalTime.parse(dto.getEndTime()));

        return classScheduleRepository.save(schedule);
    }

    @Override
    public void delete(Long scheduleno) {
        classScheduleRepository.deleteById(scheduleno);
    }

    @Override
    public List<ClassSchedule> findByPlaceNo(Long placeno) {
        return classScheduleRepository.findByPlace_Placeno(placeno);
    }
}
