package dev.mvc.team5.sse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import lombok.RequiredArgsConstructor;

/* NotificationSseController.java */
@RestController
@RequiredArgsConstructor
public class NotificationSseController {

    private final SseService sseService;

    @GetMapping(value = "/sse/notifications/{userno}", produces = "text/event-stream")
    public SseEmitter connect(@PathVariable(name="userno") Long userno) {
        return sseService.subscribe(userno);
    }
}
