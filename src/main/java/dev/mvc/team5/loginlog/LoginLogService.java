package dev.mvc.team5.loginlog;

import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LoginLogService {

    @Autowired
    private LoginLogRepository repo;

    @Autowired
    private UserRepository userRepo;

    public List<LoginLog> findAll() {
        return repo.findAll();
    }

    public Optional<LoginLog> findById(Long id) {
        return repo.findById(id);
    }

    public LoginLog save(LoginLogDTO dto) {
        LoginLog log = new LoginLog();
        User user = userRepo.findById(dto.getUserno()).orElseThrow();
        log.setUser(user);
        log.setLoginTime(LocalDateTime.parse(dto.getLoginTime()));
        log.setIpAddress(dto.getIpAddress());
        return repo.save(log);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
