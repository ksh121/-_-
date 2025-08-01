package dev.mvc.team5.reservations;

import dev.mvc.team5.notification.NotificationService;
import dev.mvc.team5.user.User;
import jakarta.transaction.Transactional;
import dev.mvc.team5.places.Places;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReservationScheduler {

    @Autowired
    private ReservationsRepository reservationsRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * 매 1분마다 실행 - 1시간 남은 예약을 찾아 알림 전송
     */
    @Transactional
    @Scheduled(cron = "0 * * * * *") // 매 분 0초마다 실행
    public void notifyUpcomingReservations() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime targetTime = now.plusHours(1);

        // 예약 시작 시간이 "1시간 후"인 예약들 (±1분 허용)
        List<Reservations> reservations = reservationsRepository.findReservationsStartingBetween(
                targetTime.minusMinutes(1),
                targetTime.plusMinutes(1)
        );

        for (Reservations r : reservations) {
            if (!"예약됨".equals(r.getStatus())) continue; // 상태 확인

            User user = r.getUser();
            Places place = r.getPlace();
            String placeName = (place != null && place.getPlacename() != null) ? place.getPlacename() : "알 수 없는 장소";

            String message = String.format("[%s] 예약 시작까지 1시간 남았습니다.", placeName);
            notificationService.createNotification(
                    user.getUserno(),
                    "reservation",
                    message,
                    r.getReservationno()
            );
        }
    }
}
