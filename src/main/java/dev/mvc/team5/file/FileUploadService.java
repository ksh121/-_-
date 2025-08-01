package dev.mvc.team5.file;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import dev.mvc.team5.talents.Talent;

public interface FileUploadService {
    FileUploadDTO saveFile(MultipartFile file, String targetType, Long talentno, String profile);
    
    List<FileUploadDTO> saveAll(List<MultipartFile> files, String targetType, Long talentno, String profile);
    
    List<FileUpload> findByTalent_Talentno(Long talentno);
    
}
