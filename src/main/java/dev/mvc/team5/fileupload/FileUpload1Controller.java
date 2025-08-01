package dev.mvc.team5.fileupload;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/fileupload")
public class FileUpload1Controller {

    @Autowired
    private FileUpload1Service fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<FileUpload1> upload(
            @RequestParam(name="file") MultipartFile file,
            @RequestParam(name="purpose") String purpose,
            @RequestParam(name="targetType") String targetType,
            @RequestParam(name="targetId") Long targetId) {

        try {
            FileUpload1 uploaded = fileUploadService.uploadFile(file, purpose, targetType, targetId);
            return ResponseEntity.ok(uploaded);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}