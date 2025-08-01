package dev.mvc.team5.file;

import java.util.List;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUploadDTO {
    private Long fileno;
    private String originalFileName;
    private String storedFileName;
    private String filePath;
    private Long fileSize;
    private String profile;
    private String targetType;
    private Long talentno;
}
