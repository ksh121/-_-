// FileUpload.java 수정
package dev.mvc.team5.file;

import dev.mvc.team5.talents.Talent;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "file_uploads")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "talent")
public class FileUpload {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="file_seq")
    @SequenceGenerator(name="file_seq", sequenceName="FILE_SEQ", allocationSize=1)
    private Long fileno;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String storedFileName;

    @Column(nullable = false)
    private String filePath;

    private Long fileSize;

    @CreationTimestamp
    private LocalDateTime uploadedAt;

    @Column(nullable = false)
    private String targetType;

    private String profile;

    // Talent와 연관관계 (다대일)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talentno")
    private Talent talent;

}
