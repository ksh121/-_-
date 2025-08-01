package dev.mvc.team5.classschedule;

import lombok.Data;

@Data
public class ClassScheduleDTO {
    private Long scheduleno;

    private Long placeno;  // 장소 번호 (Places PK)

    private DayOfWeekKor day;

    private String startTime; // 시작 시간 (HH:mm)

    private String endTime;   // 종료 시간 (HH:mm)
}
