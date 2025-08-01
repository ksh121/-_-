package dev.mvc.team5.talents;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import dev.mvc.team5.block.BlockService;
import dev.mvc.team5.file.FileUpload;
import dev.mvc.team5.file.FileUploadDTO;
import dev.mvc.team5.file.FileUploadRepository;
import dev.mvc.team5.school.School;
import dev.mvc.team5.school.SchoolRepository;
import dev.mvc.team5.talentcategory.TalentCategory;
import dev.mvc.team5.talentcategory.TalentCategoryRepository;
import dev.mvc.team5.talents.talentdto.TalentCreateDTO;
import dev.mvc.team5.talents.talentdto.TalentDetailDTO;
import dev.mvc.team5.talents.talentdto.TalentListDTO;
import dev.mvc.team5.talents.talentdto.TalentResponseDTO;
import dev.mvc.team5.talents.talentdto.TalentUpdateDTO;
import dev.mvc.team5.talenttype.TalentType;
import dev.mvc.team5.talenttype.TalentTypeRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TalentService {
    // 의존성 주입: Repository 및 외부 서비스
    @Autowired private TalentRepository talentRepository;
    @Autowired private TalentCategoryRepository cateRepository;
    @Autowired private TalentTypeRepository typeRepository;
    @Autowired private SchoolRepository schoolRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private FileUploadRepository fileUploadRepository;
    @Autowired private BlockService blockService;

    /**
     * ✅ Talent 엔티티 → TalentResponseDTO 변환 메서드
     * 📥 Talent 엔티티
     * 📤 TalentResponseDTO (상세 보기용)
     */
    private TalentResponseDTO toResponseDTO(Talent t) {
        return new TalentResponseDTO(
            t.getTalentno(),
            t.getUser() != null ? t.getUser().getUserno() : null,
            t.getSchool() != null ? t.getSchool().getSchoolno() : null,
            t.getTitle(),
            t.getDescription(),
            t.getPrice(),
            t.getViewCount(),
            t.getCreatedAt(),
            t.getUpdatedAt(),
            t.getType() != null ? t.getType().getTypeno() : null,
            t.getCategory() != null ? t.getCategory().getCategoryno() : null
        );
    }

    /**
     * ✅ 재능 등록 기능
     * 🔧 학교, 카테고리, 타입 정보 설정 + 파일 업로드 저장 처리 포함
     * 📥 TalentCreateDTO
     * 📤 TalentResponseDTO (저장된 결과 반환)
     */
    public TalentResponseDTO save(TalentCreateDTO dto) {
        Talent talent = dto.toEntity();

        // 연관 엔티티 설정
        School school = schoolRepository.findById(dto.getSchoolno())
            .orElseThrow(() -> new IllegalArgumentException("학교 없음"));
        TalentCategory category = cateRepository.findById(dto.getCategoryno())
            .orElseThrow(() -> new IllegalArgumentException("카테고리 없음"));
        TalentType type = typeRepository.findById(dto.getTypeno())
            .orElseThrow(() -> new IllegalArgumentException("타입 없음"));

        talent.setSchool(school);
        talent.setCategory(category);
        talent.setType(type);

        // 파일 정보 설정
        if (dto.getFileInfos() != null && !dto.getFileInfos().isEmpty()) {
            List<FileUpload> files = dto.getFileInfos().stream().map(fileDto -> {
                FileUpload file = new FileUpload();
                file.setOriginalFileName(fileDto.getOriginalFileName());
                file.setStoredFileName(fileDto.getStoredFileName());
                file.setFilePath(fileDto.getFilePath());
                file.setFileSize(fileDto.getFileSize());
                file.setTargetType(fileDto.getTargetType());
                file.setTalent(talent);
                file.setProfile(fileDto.getProfile());
                return file;
            }).collect(Collectors.toList());

            talent.setFiles(files);
        }

        return toResponseDTO(talentRepository.save(talent));
    }

    /**
     * ✅ 전체 재능 목록 조회
     * 📤 List<TalentListDTO>
     */
    public List<TalentListDTO> findAll() {
        return talentRepository.findAll().stream().map(this::toListDTO).collect(Collectors.toList());
    }

    /**
     * ✅ 특정 학교의 재능 목록 조회
     * 📥 학교 번호
     * 📤 List<TalentListDTO>
     */
    public List<TalentListDTO> findBySchoolno(Long schoolno) {
        return talentRepository.findBySchool_Schoolno(schoolno).stream().map(this::toListDTO).collect(Collectors.toList());
    }

    /**
     * ✅ 재능 단건 조회
     * 📥 talentno
     * 📤 Optional<TalentResponseDTO>
     */
    public Optional<TalentResponseDTO> findById(Long talentno) {
        return talentRepository.findById(talentno).map(this::toResponseDTO);
    }

    /**
     * ✅ 재능 수정 기능
     * 🔧 기존 파일 제거 후 새 파일 추가. 사용자 권한 체크 필수.
     * 📌 @Transactional: 엔티티 수정 반영
     * 📥 TalentUpdateDTO, 로그인 사용자 번호
     * 📤 TalentResponseDTO
     */
    @Transactional
    public TalentResponseDTO update(TalentUpdateDTO dto, Long loggedInUserNo) {
        Talent talent = talentRepository.findById(dto.getTalentno())
            .orElseThrow(() -> new IllegalArgumentException("재능 없음"));

        if (!talent.getUser().getUserno().equals(loggedInUserNo)) {
            throw new SecurityException("수정 권한 없음");
        }

        // 필드 업데이트
        talent.setTitle(dto.getTitle());
        talent.setDescription(dto.getDescription());
        talent.setPrice(dto.getPrice());

        // 타입/카테고리 재설정
        TalentType type = new TalentType(); type.setTypeno(dto.getTypeno());
        TalentCategory category = new TalentCategory(); category.setCategoryno(dto.getCategoryno());
        talent.setType(type);
        talent.setCategory(category);

        // 파일 삭제 및 새 파일 추가
        fileUploadRepository.deleteByTalent_Talentno(dto.getTalentno());
        talent.getFiles().clear();

        if (dto.getFileInfos() != null && !dto.getFileInfos().isEmpty()) {
            List<FileUpload> files = dto.getFileInfos().stream().map(fileDto -> {
                FileUpload file = new FileUpload();
                file.setOriginalFileName(fileDto.getOriginalFileName());
                file.setStoredFileName(fileDto.getStoredFileName());
                file.setFilePath(fileDto.getFilePath());
                file.setFileSize(fileDto.getFileSize());
                file.setTargetType(fileDto.getTargetType());
                file.setTalent(talent);
                file.setProfile(fileDto.getProfile());
                return file;
            }).collect(Collectors.toList());
            talent.getFiles().addAll(files);
        }

        return toResponseDTO(talentRepository.save(talent));
    }

    /**
     * ✅ 재능 삭제
     * 🔧 권한 확인 후 삭제
     */
    public void delete(Long talentno, Long loggedInUserNo) {
        Talent talent = talentRepository.findById(talentno)
            .orElseThrow(() -> new IllegalArgumentException("삭제 대상 없음"));
        if (!talent.getUser().getUserno().equals(loggedInUserNo)) {
            throw new SecurityException("삭제 권한 없음");
        }
        talentRepository.deleteById(talentno);
    }

    /**
     * ✅ Talent 엔티티 → TalentListDTO 변환
     * 📥 Talent
     * 📤 TalentListDTO
     */
    private TalentListDTO toListDTO(Talent t) {
        List<FileUploadDTO> fileDTOs = t.getFiles() != null
            ? t.getFiles().stream().map(file -> new FileUploadDTO(
                file.getFileno(), file.getOriginalFileName(), file.getStoredFileName(),
                file.getFilePath(), file.getFileSize(), file.getProfile(),
                file.getTargetType(), t.getTalentno()
              )).collect(Collectors.toList())
            : null;

        return new TalentListDTO(
            t.getTalentno(), t.getTitle(), t.getDescription(), t.getPrice(), t.getViewCount(),
            t.getCategory() != null ? t.getCategory().getCateGrp().getName() : "없음",
            t.getCategory() != null ? t.getCategory().getName() : "없음",
            t.getType() != null ? t.getType().getName() : "없음",
            t.getUser().getUserno(), t.getUser().getUsername(),
            fileDTOs, false
        );
    }

    /**
     * ✅ 학교 + 카테고리 조합으로 재능 조회
     */
    public List<TalentListDTO> findBySchoolnoAndCategoryno(Long schoolno, Long categoryno) {
        return talentRepository.findBySchool_SchoolnoAndCategory_Categoryno(schoolno, categoryno)
            .stream().map(this::toListDTO).collect(Collectors.toList());
    }

    /**
     * ✅ 상세 페이지용 재능 조회 (JOIN 없이 DTO만 조회)
     */
    @Transactional
    public TalentDetailDTO getTalentDetail(Long talentno) {
        return talentRepository.findDetailByTalentno(talentno);
    }

    /**
     * ✅ 상세 + 파일 포함 + 조회수 증가 처리
     * 🔧 JOIN FETCH + 직접 엔티티 접근 + ViewCount 증가
     */
    @Transactional
    public TalentDetailDTO getTalentDetailWithFiles(Long talentno) {
        Talent t = talentRepository.findByIdWithFiles(talentno)
            .orElseThrow(() -> new IllegalArgumentException("재능 없음"));

        t.setViewCount(t.getViewCount() + 1);  // 조회수 증가

        List<FileUploadDTO> fileDTOs = t.getFiles().stream().map(file -> new FileUploadDTO(
            file.getFileno(), file.getOriginalFileName(), file.getStoredFileName(),
            file.getFilePath(), file.getFileSize(), file.getProfile(),
            file.getTargetType(), t.getTalentno()
        )).collect(Collectors.toList());

        TalentDetailDTO dto = new TalentDetailDTO(
            t.getTalentno(), t.getUser().getUserno(),
            t.getType().getName(),
            t.getCategory().getCateGrp().getName(),
            t.getCategory().getName(),
            t.getTitle(), t.getDescription(), t.getPrice(), t.getViewCount(),
            t.getUser().getUsername(), t.getCreatedAt(), t.getUpdatedAt()
        );

        // 추가 세팅
        dto.setTypeno(t.getType().getTypeno());
        dto.setCateGrpno(t.getCategory().getCateGrp().getCateGrpno());
        dto.setCategoryno(t.getCategory().getCategoryno());
        dto.setFileInfos(fileDTOs);
        dto.setName(t.getUser().getName());
        dto.setEmail(t.getUser().getEmail());
        dto.setProfileImage(t.getUser().getProfileImage());

        return dto;
    }

    /**
     * ✅ 검색 + 필터 + 페이징 + 차단 처리 포함 재능 목록 조회
     * 🔧 대분류/소분류/학교/키워드 조건 조합 처리
     * 🔧 blockService 사용해 차단 여부 표시
     */
    public Page<TalentListDTO> searchTalents(String keyword, Long cateGrpno, Long categoryno, Long schoolno, int page, int size, Long loggedInUserno) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "talentno"));
        Page<Talent> talentPage;

        if (categoryno != null) {
            talentPage = talentRepository.searchWithFilters(trim(keyword), categoryno, schoolno, pageable);
        } else if (cateGrpno != null) {
            List<Long> subcategories = cateRepository.findCategorynosByCateGrpno(cateGrpno);
            talentPage = talentRepository.findByCategorynosInAndFilters(subcategories, trim(keyword), schoolno, pageable);
        } else if (keyword != null || schoolno != null) {
            talentPage = talentRepository.searchWithFilters(trim(keyword), null, schoolno, pageable);
        } else {
            talentPage = talentRepository.findAll(pageable);
        }

        return talentPage.map(talent -> {
            TalentListDTO dto = toListDTO(talent);
            Long author = talent.getUser().getUserno();

            if (loggedInUserno != null && !loggedInUserno.equals(author)) {
                dto.setBlocked(blockService.isBlocked(loggedInUserno, author));
            } else {
                dto.setBlocked(false);
            }

            return dto;
        });
    }

    /**
     * ✅ 마이페이지 전용 재능 목록 조회
     * 🔧 차단 여부 무시. 본인 글만 반환
     */
    public Page<TalentListDTO> searchMyTalents(String keyword, Long categoryno, Long schoolno, int page, int size, Long userno) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "talentno"));
        return talentRepository.searchWithFilters(trim(keyword), categoryno, schoolno, userno, pageable)
                .map(this::toListDTO);
    }

    /**
     * ✅ 해당 유저의 전체 재능 개수 반환
     */
    public long countTalentsByUserno(Long userno) {
        return talentRepository.countByUser_Userno(userno);
    }

    /**
     * ✅ 특정 사용자 재능 리스트 조회
     */
    public List<TalentListDTO> findTalentsByUserno(Long userno) {
        return talentRepository.findByUser_Userno(userno).stream().map(this::toListDTO).collect(Collectors.toList());
    }

    /**
     * ✅ 대분류 카테고리 기반 검색 (내부 용도)
     */
    public Page<Talent> findTalentsByCateGrp(Long cateGrpno, String keyword, Long schoolno, Pageable pageable) {
        List<Long> categorynos = cateRepository.findCategorynosByCateGrpno(cateGrpno);
        return categorynos.isEmpty()
            ? Page.empty()
            : talentRepository.findByCategorynosInAndFilters(categorynos, keyword, schoolno, pageable);
    }

    /**
     * ✅ ID 기반 엔티티 조회 (내부 로직 전용)
     * 📌 존재하지 않으면 예외 발생
     */
    public Talent getEntityById(Long talentno) {
        return talentRepository.findById(talentno)
            .orElseThrow(() -> new IllegalArgumentException("재능이 존재하지 않습니다. talentno = " + talentno));
    }

    /**
     * 🔸 유틸: 키워드 trim 처리
     */
    private String trim(String keyword) {
        return (keyword == null || keyword.trim().isEmpty()) ? null : keyword.trim();
    }
}
