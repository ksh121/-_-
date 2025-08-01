package dev.mvc.team5.loginlog;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/loginlogs")
public class LoginLogController {

    @Autowired
    private LoginLogService service;

    @GetMapping
    public List<LoginLogDTO> getAll() {
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public LoginLogDTO get(@PathVariable Long id) {
        return toDTO(service.findById(id).orElseThrow());
    }

    @PostMapping
    public LoginLogDTO create(@RequestBody LoginLogDTO dto) {
        return toDTO(service.save(dto));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    private LoginLogDTO toDTO(LoginLog log) {
        LoginLogDTO dto = new LoginLogDTO();
        dto.setLoginno(log.getLoginno());
        dto.setUserno(log.getUser().getUserno());
        dto.setLoginTime(log.getLoginTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        dto.setIpAddress(log.getIpAddress());
        return dto;
    }
}
