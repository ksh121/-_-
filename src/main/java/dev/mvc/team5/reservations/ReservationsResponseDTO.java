package dev.mvc.team5.reservations;

import lombok.Data;

import java.time.LocalDateTime;

/** 
 * 예약한 후 확인 할때 사용 하는것
 * 
 * */

@Data
public class ReservationsResponseDTO {
    private Long reservationno;
    private Long userno;
    private String username; 
    private Long placeno;
    private String placename;
    private String schoolgwanname;
    private LocalDateTime start_time;
    private LocalDateTime end_time;
    private String purpose;
    private String status;
    private LocalDateTime createdAt;
}
