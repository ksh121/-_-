package dev.mvc.team5.schoolgwan;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/schoolgwans")
@RequiredArgsConstructor
public class SchoolGwanController {

    private final SchoolGwanService schoolGwanService;

    // 등록
    @PostMapping()
    public ResponseEntity<SchoolGwan> create(@RequestBody SchoolGwanDTO dto) {
        SchoolGwan created = schoolGwanService.create(dto);
        return ResponseEntity.ok(created);
    }

    // 전체 조회
    @GetMapping
    public ResponseEntity<List<SchoolGwan>> listAll() {
        return ResponseEntity.ok(schoolGwanService.findAll());
    }

    // ID로 조회
    @GetMapping("/{schoolgwanno}")
    public ResponseEntity<?> read(@PathVariable("schoolgwanno") Long schoolgwanno) {
        return schoolGwanService.findById(schoolgwanno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
//    // ID로 조회
//    @GetMapping("/{id}")
//    public ResponseEntity<?> read(@PathVariable Long id) {
//        return schoolGwanService.findById(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody SchoolGwanDTO dto) {
        try {
            SchoolGwan updated = schoolGwanService.update(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        schoolGwanService.delete(id);
        return ResponseEntity.noContent().build();
    }

//    // 특정 학교의 모든 학교관 조회  // 애매함
//    @GetMapping("/school/{schoolno}")
//    public ResponseEntity<List<SchoolGwanDTO>> listBySchool(@PathVariable(name="schoolno") Long schoolno) {
//        return ResponseEntity.ok(schoolGwanService.findBySchoolNo(schoolno));
//    }
}
