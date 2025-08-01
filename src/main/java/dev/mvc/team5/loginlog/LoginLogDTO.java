package dev.mvc.team5.loginlog;

import lombok.Data;

@Data
public class LoginLogDTO {
    private Long loginno;
    private Long userno;
    private String loginTime;
    private String ipAddress;
}