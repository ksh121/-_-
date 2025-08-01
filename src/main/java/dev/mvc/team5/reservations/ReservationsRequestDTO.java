package dev.mvc.team5.reservations;

import lombok.Data;

import java.time.LocalDateTime;

/** 
 * 예약할때 사용 하는 DTO
 * 
 * */
@Data
public class ReservationsRequestDTO {
    private Long userno;
    private Long placeno;
    private String placename;
    private LocalDateTime start_time;
    private LocalDateTime end_time;
    private String purpose;
    private String status;
}
