package dev.mvc.team5.school;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolRepository extends JpaRepository<School, Long> {
    // 필요하다면 커스텀 쿼리 추가 가능

}
