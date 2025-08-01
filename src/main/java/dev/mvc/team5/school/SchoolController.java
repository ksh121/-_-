	package dev.mvc.team5.school;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;

    @PostMapping
    public ResponseEntity<School> create(@RequestBody SchoolDTO dto) {
        School created = schoolService.create(dto);
        return ResponseEntity.ok(created);
    }

//    @GetMapping("/{id}") // 포스트맨 json방식 테스트 안됨
//    public ResponseEntity<?> read(@PathVariable Long id) { // 수정필요
//        return schoolService.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
    
    @GetMapping("/{schoolno}")
    public ResponseEntity<?> read(@PathVariable("schoolno") Long schoolno) {
        return schoolService.findById(schoolno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping
    public ResponseEntity<List<School>> listAll() {
        return ResponseEntity.ok(schoolService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SchoolDTO dto) {
        try {
            School updated = schoolService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        schoolService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<Map<String, Object>>> getSchoolList() {
        List<School> schools = schoolService.findAll();
        List<Map<String, Object>> result = schools.stream()
            .map(school -> {
                Map<String, Object> map = new HashMap<>();
                map.put("schoolno", school.getSchoolno());
                map.put("schoolname", school.getSchoolname());
                return map;
            }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
    
}
