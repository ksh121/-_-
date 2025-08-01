package dev.mvc.team5.chatbot;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import dev.mvc.team5.chatbot.chatbotdto.ChatBotCreateDTO;
import dev.mvc.team5.chatbot.chatbotdto.ChatBotResponseDTO;
import dev.mvc.team5.chatbot.chatbotdto.ChatBotUpdateDTO;

/**
 * 주요내용(ChatBot) 관련 서비스 인터페이스
 */
public interface ChatBotService {

  /**
   * 새로운 주요내용 저장
   *
   * @param createDTO 생성 요청 DTO
   * @return 저장된 내용에 대한 응답 DTO
   */
  ChatBotResponseDTO save(ChatBotCreateDTO createDTO);

  /**
   * 주요내용 단건 조회
   *
   * @param chatbotno 조회할 챗봇 글 번호
   * @return 해당 챗봇 글의 응답 DTO (Optional)
   */
  Optional<ChatBotResponseDTO> findById(Long chatbotno);

  /**
   * 주요내용 수정
   *
   * @param updateDTO 수정 요청 DTO
   * @return 수정된 챗봇 글의 응답 DTO
   */
  ChatBotResponseDTO update(ChatBotUpdateDTO updateDTO);

  /**
   * 주요내용 삭제
   *
   * @param chatbotno 삭제할 챗봇 글 번호
   */
  void delete(Long chatbotno);

  /**
   * 특정 유저 번호에 해당하는 주요내용 목록 조회 (페이징 + 최신순 정렬)
   *
   * @param userno 유저 번호
   * @param pageable 페이징 정보
   * @return 페이징된 응답 DTO 목록
   */
  Page<ChatBotResponseDTO> listByUserno(Long userno, Pageable pageable);

  /**
   * 특정 유저 번호와 이름 키워드로 필터링한 주요내용 목록 조회 (페이징 + 최신순 정렬)
   *
   * @param content 내용
   * @param pageable 페이징 정보
   * @return 페이징된 응답 DTO 목록
   */
  Page<ChatBotResponseDTO> listByContent(String content, Pageable pageable);
}
