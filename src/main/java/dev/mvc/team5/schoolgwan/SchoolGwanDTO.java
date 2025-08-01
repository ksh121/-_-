package dev.mvc.team5.schoolgwan;

import lombok.Data;

@Data
public class SchoolGwanDTO {
    private Long schoolgwanno;          // 수정 시 사용
    private Long schoolno;              // 연관된 School의 번호
    private String schoolgwanname;      // 학교관 이름
}
