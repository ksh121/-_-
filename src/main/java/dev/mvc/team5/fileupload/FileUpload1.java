package dev.mvc.team5.fileupload;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "file_uploads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileUpload1 {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="file_seq")
    @SequenceGenerator(name="file_seq", sequenceName="FILE_SEQ", allocationSize=1)
    private Long fileno; // Primary Key

    @Column(length = 255)
    private String filePath;

    private Long fileSize;

    @Column(length = 255)
    private String originalFileName;

    @Column(length = 255)
    private String storedFileName;

    @Column(length = 255)
    private String purpose;
    
   @Column(name = "targetId")
    private Long targetId;

    @Column(length = 255)
    private String targetType;

    private LocalDateTime uploadedAt;

    @Column(length = 255)
    private String postfile;

    @Column(length = 255)
    private String profile;
}