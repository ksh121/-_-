// FileUploadRepository.java
package dev.mvc.team5.file;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
    List<FileUpload> findByTalent_Talentno(Long talentno);
    
    void deleteByTalent_Talentno(Long talentno);
}
