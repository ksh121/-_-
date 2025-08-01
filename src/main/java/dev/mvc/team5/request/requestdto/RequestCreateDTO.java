package dev.mvc.team5.request.requestdto;

import dev.mvc.team5.request.Request;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.tool.RequestStatus;
import dev.mvc.team5.user.User;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RequestCreateDTO {
    private Long talentno;
    private Long giverno;
    private Long receiverno;
    private String status = RequestStatus.PENDING;
    private String message;
    private Long chatRoomno;
    private Long price;
}

