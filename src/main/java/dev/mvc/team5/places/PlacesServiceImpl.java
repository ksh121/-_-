package dev.mvc.team5.places;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import dev.mvc.team5.schoolgwan.SchoolGwan;
import dev.mvc.team5.schoolgwan.SchoolGwanRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlacesServiceImpl implements PlacesService {

    private final PlacesRepository placesRepository;
    private final SchoolGwanRepository schoolGwanRepository;

    @Override
    public Places save(PlacesDTO dto) {
        SchoolGwan schoolGwan = schoolGwanRepository.findById(dto.getSchoolgwanno())
                .orElseThrow(() -> new IllegalArgumentException("학교관 정보가 존재하지 않습니다."));
       
        Places place = new Places(
                schoolGwan,
                dto.getPlacename(),
                dto.getHosu()
        );
        return placesRepository.save(place);
    }

    @Override
    public Optional<Places> findById(Long placeId) {
        return placesRepository.findById(placeId);
    }

    @Override
    public List<Places> findAll() {
        return placesRepository.findAll();
    }

    @Override
    public Places update(Long placeId, PlacesDTO dto) {
        Places place = placesRepository.findById(placeId)
                .orElseThrow(() -> new IllegalArgumentException("강의실이 존재하지 않습니다."));

        SchoolGwan schoolGwan = schoolGwanRepository.findById(dto.getSchoolgwanno())
                .orElseThrow(() -> new IllegalArgumentException("학교관 정보가 존재하지 않습니다."));

        place.setSchoolGwan(schoolGwan);
        place.setPlacename(dto.getPlacename());
        place.setHosu(dto.getHosu());

        return placesRepository.save(place);
    }

    @Override
    public void delete(Long placeId) {
        placesRepository.deleteById(placeId);
    }

    //강의실 이름 검색
    @Override
    public List<Places> searchByPlacename(String keyword) {
        return placesRepository.findByPlacenameContaining(keyword);
    }

    //학교관 에 잇는 강의실만 볼수 있게
    @Override
    public List<PlacesDTO> findBySchoolGwanNo(Long schoolgwanno) {
        return placesRepository.findBySchoolGwan_Schoolgwanno(schoolgwanno)
            .stream()
            .map(entity -> {
                PlacesDTO dto = new PlacesDTO();
                dto.setPlaceno(entity.getPlaceno());
                dto.setPlacename(entity.getPlacename());
                dto.setHosu(entity.getHosu());
                dto.setSchoolgwanno(entity.getSchoolGwan().getSchoolgwanno());
                return dto;
            })
            .collect(Collectors.toList());
    }
    // 상세보기
    public Optional<PlacesDTO> findByPlaceno(Long placeno) {
      return placesRepository.findById(placeno)
          .map(place -> {
              PlacesDTO dto = new PlacesDTO();
              dto.setPlaceno(place.getPlaceno());
              dto.setPlacename(place.getPlacename());
              dto.setHosu(place.getHosu());
              dto.setSchoolgwanno(place.getSchoolGwan().getSchoolgwanno());
              return dto;
          });
  }

    
//    @Override
//    public List<PlacesDTO> findPlacesBySchoolno(Long schoolno) {
//        return placesRepository.findBySchoolgwan_School_Schoolno(schoolno)
//                               .stream()
//                               .map(this::toDTO)
//                               .collect(Collectors.toList());
//    }
    @Override
    public List<PlacesDTO> findBySchoolno(Long schoolno) {
        return placesRepository.findBySchoolGwan_School_Schoolno(schoolno)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }
    
    @Override
    public List<PlacesDTO> findBySchoolnoAndSchoolgwanno(Long schoolno, Long schoolgwanno) {
        return placesRepository
                .findBySchoolGwan_School_SchoolnoAndSchoolGwan_Schoolgwanno(schoolno, schoolgwanno)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private PlacesDTO toDTO(Places entity) {
        PlacesDTO dto = new PlacesDTO();
        dto.setPlaceno(entity.getPlaceno());
        dto.setPlacename(entity.getPlacename());
        dto.setHosu(entity.getHosu());
        dto.setSchoolgwanno(entity.getSchoolGwan().getSchoolgwanno());
        dto.setSchoolgwanname(entity.getSchoolGwan().getSchoolgwanname());
        return dto;
    }
    

		@Override
		public Page<Places> findPlacesBySchool(Long schoolno, Pageable pageable) {
			return placesRepository.findBySchoolno(schoolno, pageable);
		}

		@Override
		public Page<Places> findPlacesBySchoolAndGwan(Long schoolno, Long schoolgwanno, Pageable pageable) {
			// TODO Auto-generated method stub
			return   placesRepository.findBySchoolnoAndSchoolgwanno(schoolno, schoolgwanno, pageable);
		}
    
    
		public Page<Places> searchPlacesBySchool(Long schoolno, String keyword, Pageable pageable) {
	    return placesRepository.searchBySchoolAndKeyword(schoolno, keyword, pageable);
	}

	public Page<Places> searchPlacesBySchoolAndGwan(Long schoolno, Long schoolgwanno, String keyword, Pageable pageable) {
	    return placesRepository.searchBySchoolAndGwanAndKeyword(schoolno, schoolgwanno, keyword, pageable);
	}
	
}
