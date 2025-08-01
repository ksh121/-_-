package dev.mvc.team5.file;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileService;

    @PostMapping("/upload")
    public ResponseEntity<FileUploadDTO> uploadFile(
        @RequestParam("file") MultipartFile file,
        @RequestParam("targetType") String targetType,
        @RequestParam("talentno") Long talentno,
        @RequestParam("profile") String profile
    ) {
        FileUploadDTO result = fileService.saveFile(file, targetType, talentno, profile);
        return ResponseEntity.ok(result);
    }
    
 // 다중 파일 업로드
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<FileUploadDTO>> uploadMultipleFiles(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("targetType") String targetType,
            @RequestParam("talentno") Long talentno,
            @RequestParam("profile") String profile) {

        List<FileUploadDTO> uploadedFiles = fileService.saveAll(files, targetType, talentno, profile);
        return ResponseEntity.ok(uploadedFiles);
    }
    
    
}
