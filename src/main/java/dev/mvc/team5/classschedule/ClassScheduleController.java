package dev.mvc.team5.classschedule;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/class-schedule")
@RequiredArgsConstructor
public class ClassScheduleController {

    private final ClassScheduleService classScheduleService;

    // 1. 등록
    @PostMapping
    public ResponseEntity<ClassSchedule> create(@RequestBody ClassScheduleDTO dto) {
        ClassSchedule saved = classScheduleService.save(dto);
        return ResponseEntity.ok(saved);
    }

    // 2. 전체 목록 조회
    @GetMapping
    public ResponseEntity<List<ClassSchedule>> listAll() {
        return ResponseEntity.ok(classScheduleService.findAll());
    }

    // 3. 단일 조회
    @GetMapping("/{scheduleno}")
    public ResponseEntity<ClassSchedule> read(@PathVariable Long scheduleno) {
        return classScheduleService.findById(scheduleno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. 수정
    @PutMapping("/{scheduleno}")
    public ResponseEntity<ClassSchedule> update(
            @PathVariable Long scheduleno,
            @RequestBody ClassScheduleDTO dto) {
        ClassSchedule updated = classScheduleService.update(scheduleno, dto);
        return ResponseEntity.ok(updated);
    }

    // 5. 삭제
    @DeleteMapping("/{scheduleno}")
    public ResponseEntity<Void> delete(@PathVariable Long scheduleno) {
        classScheduleService.delete(scheduleno);
        return ResponseEntity.noContent().build();
    }

    // 6. 특정 장소(강의실) 번호 기준 스케줄 전체 조회
    @GetMapping("/by-place/{placeno}")
    public ResponseEntity<List<ClassSchedule>> listByPlace(@PathVariable("placeno") Long placeno) {
        return ResponseEntity.ok(classScheduleService.findByPlaceNo(placeno));
    }

    
}
