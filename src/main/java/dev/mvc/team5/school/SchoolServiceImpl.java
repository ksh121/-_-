package dev.mvc.team5.school;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SchoolServiceImpl implements SchoolService {
  
    private final SchoolRepository schoolRepository;

    @Override
    public School create(SchoolDTO dto) {
        School school = new School(dto.getSchoolname());
        return schoolRepository.save(school);
    }

    @Override
    public Optional<School> findById(Long schoolno) {
        return schoolRepository.findById(schoolno);
    }

    @Override
    public List<School> findAll() {
        return schoolRepository.findAll();
    }

    @Override
    public School update(Long schoolno, SchoolDTO dto) {
        School school = schoolRepository.findById(schoolno)
                .orElseThrow(() -> new IllegalArgumentException("학교가 존재하지 않습니다."));

        school.setSchoolname(dto.getSchoolname());

        return schoolRepository.save(school);
    }

    @Override
    public void delete(Long schoolno) {
        schoolRepository.deleteById(schoolno);
    }
}
