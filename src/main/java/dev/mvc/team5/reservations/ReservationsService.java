package dev.mvc.team5.reservations;

import java.time.LocalDateTime;
import java.util.List;

import dev.mvc.team5.places.Places;

public interface ReservationsService {
	
    ReservationsResponseDTO create(ReservationsRequestDTO dto);
    
    ReservationsResponseDTO read(Long reservationno);
    
    List<ReservationsResponseDTO> listAll();
    
    ReservationsResponseDTO update(Long reservationno, ReservationsRequestDTO dto);
    
    void cancelReservation(Long reservationno);

    // chatbot 예약
    List<Reservations> findChatConflict(Long placeno, LocalDateTime start, LocalDateTime end);

		List<Reservations> findConflict(Places placeno, LocalDateTime start, LocalDateTime end);

		List<Reservations> findByPlace(Long placeno);

		List<ReservationsResponseDTO> findByUser(Long userno);

		/** 완료됨, 확정됨만 보여줌*/
		List<ReservationsResponseDTO> getActiveReservations();
		
		/** 취소된거 보여줌*/
		List<ReservationsResponseDTO> getCanceledReservations();

}
