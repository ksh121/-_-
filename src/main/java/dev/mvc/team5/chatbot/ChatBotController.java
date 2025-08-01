package dev.mvc.team5.chatbot;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import dev.mvc.team5.chatbot.chatbotdto.ChatBotCreateDTO;
import dev.mvc.team5.chatbot.chatbotdto.ChatBotResponseDTO;
import dev.mvc.team5.chatbot.chatbotdto.ChatBotUpdateDTO;

import java.util.Optional;

@RestController
@RequestMapping("/chatbot")
@RequiredArgsConstructor
public class ChatBotController {
  
    @Autowired
    private final ChatBotService chatbotService;

//    /**
//     * 챗봇 주요내용 생성
//     */
//    @PostMapping("/save")
//    public ChatBotResponseDTO create(@RequestBody ChatBotCreateDTO dto) {
//        return chatbotService.save(dto);
//    }

    /**
     * 챗봇 주요내용 단건 조회
     */
    @GetMapping("/{chatbotno}")
    public Optional<ChatBotResponseDTO> getById(@PathVariable Long chatbotno) {
        return chatbotService.findById(chatbotno);
    }

    /**
     * 챗봇 주요내용 수정
     */
    @PutMapping("/update")
    public ChatBotResponseDTO update(@RequestBody ChatBotUpdateDTO dto) {
        return chatbotService.update(dto);
    }

    /**
     * 챗봇 주요내용 삭제
     */
    @DeleteMapping("/delete/{chatbotno}")
    public void delete(@PathVariable(name="chatbotno") Long chatbotno) {
        chatbotService.delete(chatbotno);
    }

    /**
     * 유저 번호로 챗봇 주요내용 목록 조회 (페이징)
     */
    @GetMapping("/list/{userno}")
    public Page<ChatBotResponseDTO> listByUserno(
            @PathVariable(name="userno") Long userno,
            Pageable pageable) {
        return chatbotService.listByUserno(userno, pageable);
    }

    /**
     * 유저 번호와 이름 키워드로 필터링된 챗봇 주요내용 목록 조회 (페이징)
     */
    @GetMapping("/list/search")
    public Page<ChatBotResponseDTO> listByUsernoAndName(
            @RequestParam(name="content") String content,
            Pageable pageable) {
        return chatbotService.listByContent(content, pageable);
    }
    
    /**
     * 챗봇이 생성한 주요내용 저장
     */
    @PostMapping("/api/save")
    public ResponseEntity<?> saveChatBot(@RequestBody ChatBotCreateDTO dto) {
        ChatBotResponseDTO response = chatbotService.save(dto);
        System.out.println("✅ 저장 요청 받음: " + dto.getContent());
        return ResponseEntity.ok(response);
    }

}
