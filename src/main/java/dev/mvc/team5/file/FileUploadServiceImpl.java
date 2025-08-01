package dev.mvc.team5.file;

import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.talents.TalentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FileUploadServiceImpl implements FileUploadService {

    private final FileUploadRepository fileUploadRepository;
    private final TalentRepository talentRepository; // ⭐ Talent 조회를 위한 주입

    private String uploadBasePath = "C:/kd/deploy/team5/storage";

    @Override
    public FileUploadDTO saveFile(MultipartFile file, String targetType, Long talentno, String profile) {
        if (file.isEmpty()) return null;

        try {
            // 고유한 파일명 생성
            String originalFilename = file.getOriginalFilename();
            String uuid = UUID.randomUUID().toString();
            String extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            String storedFilename = uuid + extension;

            // 저장 경로 결정
            String savePath = uploadBasePath + File.separator + targetType;
            File dir = new File(savePath);
            if (!dir.exists()) dir.mkdirs();

            // 실제 파일 저장
            File savedFile = new File(dir, storedFilename);
            file.transferTo(savedFile);

            // talent 조회
            Optional<Talent> optionalTalent = talentRepository.findById(talentno);
            if (optionalTalent.isEmpty()) {
                throw new IllegalArgumentException("해당 talentno의 게시물이 존재하지 않습니다.");
            }

            // DB 저장
            FileUpload entity = new FileUpload();
            entity.setOriginalFileName(originalFilename);
            entity.setStoredFileName(storedFilename);
            entity.setFilePath(savePath + File.separator + storedFilename);
            entity.setFileSize(file.getSize());
            entity.setUploadedAt(LocalDateTime.now());
            entity.setProfile(profile);
            entity.setTargetType(targetType);
            entity.setTalent(optionalTalent.get()); // ⭐ 연관관계 설정

            FileUpload saved = fileUploadRepository.save(entity);

            return new FileUploadDTO(
                saved.getFileno(),
                saved.getOriginalFileName(),
                saved.getStoredFileName(),
                saved.getFilePath(),
                saved.getFileSize(),
                saved.getProfile(),     // profile
                saved.getTargetType(),  // targetType
                saved.getTalent() != null ? saved.getTalent().getTalentno() : null
            );



        } catch (IOException e) {
            throw new RuntimeException("파일 저장 실패: " + e.getMessage(), e);
        }
    }

    @Override
    public List<FileUploadDTO> saveAll(List<MultipartFile> files, String targetType, Long talentno, String profile) {
        List<FileUploadDTO> result = new ArrayList<>();
        for (MultipartFile file : files) {
            FileUploadDTO dto = this.saveFile(file, targetType, talentno, profile);
            if (dto != null) result.add(dto);
        }
        return result;
    }

    @Override
    public List<FileUpload> findByTalent_Talentno(Long talentno) {
        return fileUploadRepository.findByTalent_Talentno(talentno);
    }
}
