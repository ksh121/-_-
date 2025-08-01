package dev.mvc.team5.reservations;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationsController {

    private final ReservationsService reservationsService;

    /** */
    @GetMapping("/user/{userno}")
    public ResponseEntity<List<ReservationsResponseDTO>> getReservationsByUser(@PathVariable("userno") Long userno) {
        List<ReservationsResponseDTO> reservations = reservationsService.findByUser(userno);
        return ResponseEntity.ok(reservations);
    }
    
    /** 취소 변경*/
    @PatchMapping("/{reservationno}/cancel")
    public ResponseEntity<Void> cancelReservation(@PathVariable("reservationno") Long reservationno) {
        reservationsService.cancelReservation(reservationno);
        return ResponseEntity.ok().build();
    }
    
    
    @PostMapping
    public ResponseEntity<ReservationsResponseDTO> create(@RequestBody ReservationsRequestDTO dto) {
        return ResponseEntity.ok(reservationsService.create(dto));
    }

    @GetMapping("/{reservationno}")
    public ResponseEntity<ReservationsResponseDTO> read(@PathVariable("reservationno") Long reservationno) {
        return ResponseEntity.ok(reservationsService.read(reservationno));
    }

    @GetMapping
    public ResponseEntity<List<ReservationsResponseDTO>> listAll() {
        return ResponseEntity.ok(reservationsService.listAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationsResponseDTO> update(@PathVariable Long id, @RequestBody ReservationsRequestDTO dto) {
        return ResponseEntity.ok(reservationsService.update(id, dto));
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> delete(@PathVariable Long id) {
//        reservationsService.delete(id);
//        return ResponseEntity.noContent().build();
//    }
    
    @GetMapping("/by-place/{placeno}")
    public ResponseEntity<List<ReservationsResponseDTO>> getReservationsByPlace(@PathVariable("placeno") Long placeno) {
        List<Reservations> reservations = reservationsService.findByPlace(placeno);

        List<ReservationsResponseDTO> response = reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/reservations/active")
    public List<ReservationsResponseDTO> listActive() {
        return reservationsService.getActiveReservations();
    }

    @GetMapping("/reservations/canceled")
    public List<ReservationsResponseDTO> listCanceled() {
        return reservationsService.getCanceledReservations();
    }

    
    
    // 엔티티 -> DTO 변환
    private ReservationsResponseDTO convertToDTO(Reservations reservation) {
        ReservationsResponseDTO dto = new ReservationsResponseDTO();
        dto.setReservationno(reservation.getReservationno());
        dto.setUserno(reservation.getUser().getUserno());
        dto.setUsername(reservation.getUser().getUsername());  // User에 getUsername() 필요
        dto.setPlaceno(reservation.getPlace().getPlaceno());
        dto.setPlacename(reservation.getPlace().getPlacename());
        dto.setStart_time(reservation.getStart_time());
        dto.setEnd_time(reservation.getEnd_time());
        dto.setPurpose(reservation.getPurpose());
        dto.setStatus(reservation.getStatus().name());
        dto.setCreatedAt(reservation.getCreatedAt());
        return dto;
    }
    
    
}
