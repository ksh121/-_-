package dev.mvc.team5.sse;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import dev.mvc.team5.notification.NotificationDTO;

@Service
public class SseService {

    // 1명의 유저가 탭 여러 개 열 수 있으므로 ‑ List<SseEmitter>
    private final Map<Long, List<SseEmitter>> emitters = new ConcurrentHashMap<>();

    /** 구독 생성 */
    public SseEmitter subscribe(Long userno) {
        SseEmitter emitter = new SseEmitter(60 * 60 * 1000L);   // 1시간 타임아웃

        emitters.computeIfAbsent(userno, k -> new CopyOnWriteArrayList<>())
                .add(emitter);

        // 연결 종료·타임아웃 시 정리
        emitter.onCompletion(() -> removeEmitter(userno, emitter));
        emitter.onTimeout   (() -> removeEmitter(userno, emitter));

        /* 필요하다면 최초 연결 확인용 dummy 이벤트 전송 */
        try { emitter.send(SseEmitter.event().name("connect").data("connected")); }
        catch (Exception ex) { /* 무시 */ }

        return emitter;
    }

    /** 알림 push */
    public void send(Long userno, NotificationDTO dto) {
        List<SseEmitter> list = emitters.get(userno);
        if (list == null) return;

        for (SseEmitter emitter : list) {
            try {
                emitter.send(SseEmitter.event()
                                       .name("notify")
                                       .data(dto));            // JSON 자동 직렬화
            } catch (Exception ex) {
                removeEmitter(userno, emitter);
            }
        }
    }

    private void removeEmitter(Long userno, SseEmitter emitter) {
        List<SseEmitter> list = emitters.get(userno);
        if (list != null) list.remove(emitter);
    }
}