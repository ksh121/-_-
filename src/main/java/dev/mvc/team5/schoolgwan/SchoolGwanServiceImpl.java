package dev.mvc.team5.schoolgwan;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import dev.mvc.team5.school.School;
import dev.mvc.team5.school.SchoolRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SchoolGwanServiceImpl implements SchoolGwanService {

    private final SchoolGwanRepository schoolGwanRepository;
    private final SchoolRepository schoolRepository;

    @Override
    public SchoolGwan create(SchoolGwanDTO dto) {
        School school = schoolRepository.findById(dto.getSchoolno())
                .orElseThrow(() -> new IllegalArgumentException("학교 정보가 없습니다."));
        SchoolGwan gwan = new SchoolGwan(school, dto.getSchoolgwanname());
        
        System.out.println("-------------------------------------------------------------------------------");
        System.out.println("DTO에서 받은 schoolno: " + dto.getSchoolno());
        System.out.println("DTO에서 받은 schoolnozz: " + school);
        System.out.println("DB에서 조회한 school: " + school.getSchoolno());
        System.out.println("생성된 gwan의 school: " + gwan.getSchool());
        System.out.println("-------------------------------------------------------------------------------");
        
        return schoolGwanRepository.save(gwan);
    }

    @Override
    public List<SchoolGwan> findAll() {
        return schoolGwanRepository.findAll();
    }

    @Override
    public Optional<SchoolGwan> findById(Long schoolgwanno) {
        return schoolGwanRepository.findById(schoolgwanno);
    }

    @Override
    public SchoolGwan update(Long schoolgwanno, SchoolGwanDTO dto) {
        SchoolGwan gwan = schoolGwanRepository.findById(schoolgwanno)
                .orElseThrow(() -> new IllegalArgumentException("학교관이 존재하지 않습니다."));

        School school = schoolRepository.findById(dto.getSchoolno())
                .orElseThrow(() -> new IllegalArgumentException("학교 정보가 없습니다."));

        gwan.setSchool(school);
        gwan.setSchoolgwanname(dto.getSchoolgwanname());

        return schoolGwanRepository.save(gwan);
    }

    @Override
    public void delete(Long schoolgwanno) {
        schoolGwanRepository.deleteById(schoolgwanno);
    }

//    @Override
//    public List<SchoolGwanDTO> findBySchoolNo(Long schoolno) {
//        return schoolGwanRepository.findBySchool_Schoolno(schoolno)
//            .stream()
//            .map(entity -> {
//                SchoolGwanDTO dto = new SchoolGwanDTO();
//                dto.setSchoolgwanno(entity.getSchoolgwanno());
//                dto.setSchoolno(entity.getSchool().getSchoolno());
//                dto.setSchoolgwanname(entity.getSchoolgwanname());
//                return dto;
//            })
//            .collect(Collectors.toList());
//    }
}
