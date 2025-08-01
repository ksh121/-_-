package dev.mvc.team5.block;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
public class BlockDTO {
    private Long blockno;
    private Long blocker;   // 차단자 userno
    private Long blocked;   // 차단된 userno
    private String blockedUsername;
    private String createdAt;
    private String  reason;
    private Boolean active = true;

@Data
public static class BlockedUserDTO {
    private Long userno;        // 내가 차단한 사람의 번호
    private String username;    // 차단한 사람 닉네임
    private String email;       // 이메일 (필요 시)
}

}