package dev.mvc.team5.chatbot;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import dev.mvc.team5.chatbot.chatbotdto.ChatBotCreateDTO;
import dev.mvc.team5.chatbot.chatbotdto.ChatBotResponseDTO;
import dev.mvc.team5.chatbot.chatbotdto.ChatBotUpdateDTO;
import dev.mvc.team5.request.Request;
import dev.mvc.team5.request.RequestRepository;
import dev.mvc.team5.request.requestdto.RequestCreateDTO;
import dev.mvc.team5.request.requestdto.RequestResponseDTO;
import dev.mvc.team5.talents.Talent;
import dev.mvc.team5.talents.TalentRepository;
import dev.mvc.team5.user.User;
import dev.mvc.team5.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatBotServiceImpl implements ChatBotService {
  
  private final ChatBotRepository chatbotRepository;
  private final UserRepository userRepository;
  
  /**
   * ChatBot 엔티티를 ChatBotResponseDTO로 변환하는 헬퍼 메서드
   * 
   * @param chatbot 변환할 ChatBot 엔티티
   * @return ChatBotResponseDTO 응답 DTO 객체
   */
  private ChatBotResponseDTO toChatBotResponseDTO(ChatBot chatbot) {
    return new ChatBotResponseDTO(
        chatbot.getChatbotno(),
        chatbot.getUser() != null ? chatbot.getUser().getUserno() : null,
        chatbot.getUser() != null ? chatbot.getUser().getName() : null,
        chatbot.getContent(),
        chatbot.getCreatedAt(),
        chatbot.getUpdatedAt()
    );
  }

  /**
   * 새로운 주요내용(ChatBot) 등록
   *
   * @param dto 생성에 필요한 정보가 담긴 ChatBotCreateDTO
   * @return 저장된 ChatBot 엔티티를 DTO로 변환한 결과
   */
  @Transactional
  @Override
  public ChatBotResponseDTO save(ChatBotCreateDTO dto) {        
    User userno = userRepository.findById(dto.getUserno())
        .orElseThrow(() -> new RuntimeException("사용자 정보가 없습니다."));

    ChatBot chatbot = new ChatBot(userno, dto.getContent());
    ChatBot saved = chatbotRepository.save(chatbot);

    return toChatBotResponseDTO(saved);
  }

  /**
   * 주요내용 삭제
   *
   * @param chatbotno 삭제할 챗봇 글 번호
   */
  @Override
  public void delete(Long chatbotno) {
    if (!chatbotRepository.existsById(chatbotno)) {
      throw new RuntimeException("글이 존재하지 않습니다.");
    }
    chatbotRepository.deleteById(chatbotno);
  }

  /**
   * 주요내용 수정
   *
   * @param dto 수정할 정보를 담은 ChatBotUpdateDTO
   * @return 수정된 내용을 포함한 응답 DTO
   */
  @Override
  @Transactional
  public ChatBotResponseDTO update(ChatBotUpdateDTO dto) {
    ChatBot chatbot = chatbotRepository.findById(dto.getChatbotno())
        .orElseThrow(() -> new RuntimeException("해당 글이 없습니다."));

    User user = userRepository.findById(dto.getUserno())
        .orElseThrow(() -> new RuntimeException("사용자 정보가 없습니다."));

    chatbot.setUser(user);  // 유저 변경 가능할 경우만
    chatbot.setContent(dto.getContent());
    chatbot.setUpdatedAt(LocalDateTime.now());

    return toChatBotResponseDTO(chatbot);
  }

  /**
   * 특정 유저 번호에 해당하는 주요내용 목록 조회 (페이징 + 최신순 정렬)
   *
   * @param userno 유저 번호
   * @param pageable 페이징 정보
   * @return 응답 DTO의 페이지 객체
   */
  @Override
  public Page<ChatBotResponseDTO> listByUserno(Long userno, Pageable pageable) {
    Page<ChatBot> page = chatbotRepository.findByUser_UsernoOrderByChatbotnoDesc(userno, pageable);
    return page.map(this::toChatBotResponseDTO);
  }

  /**
   * 특정 유저 번호와 이름 키워드로 필터링한 주요내용 목록 조회 (페이징 + 최신순 정렬)
   *
   * @param userno 유저 번호
   * @param name 유저 이름 키워드
   * @param pageable 페이징 정보
   * @return 응답 DTO의 페이지 객체
   */
  @Override
  public Page<ChatBotResponseDTO> listByContent(String content, Pageable pageable) {
    Page<ChatBot> page = chatbotRepository.findByContentContainingOrderByChatbotnoDesc(content, pageable);
    return page.map(this::toChatBotResponseDTO);
  }

  /**
   * 챗봇 글 단건 조회
   *
   * @param chatbotno 조회할 챗봇 글 번호
   * @return 해당 글의 DTO(Optional)
   */
  @Override
  public Optional<ChatBotResponseDTO> findById(Long chatbotno) {
    return chatbotRepository.findById(chatbotno)
        .map(this::toChatBotResponseDTO);
  }


}
