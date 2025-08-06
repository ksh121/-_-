package dev.mvc.team5.mail;

import java.util.HashMap;
import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import dev.mvc.team5.tool.LLMKey;
import dev.mvc.team5.tool.MailTool;
import dev.mvc.team5.tool.Tool;

@RestController
@RequestMapping("/mail")
public class MailCont {

  private final RestTemplate restTemplate;

  @Autowired
  public MailCont(RestTemplate restTemplate) {
    this.restTemplate = restTemplate;
  }

  /**
   * 텍스트 메일 전송 (React fetch POST)
   */
  @PostMapping("/send_json")
  public String sendJson(@RequestBody Map<String, String> data) {
    String receiver = data.get("receiver");
    String from = data.get("from");
    String title = data.get("title");
    String content = Tool.convertChar(data.get("content"));

    System.out.println("📨 텍스트 메일 전송 요청됨 → " + receiver);

    MailTool mailTool = new MailTool();
    mailTool.send(receiver, from, title, content);

    return "메일 전송 완료";
  }

  /**
   * 파일 첨부 메일 전송
   */
  @PostMapping("/send_file")
  public String sendFile(@RequestParam("receiver") String receiver,
                         @RequestParam("from") String from,
                         @RequestParam("title") String title,
                         @RequestParam("content") String content,
                         @RequestParam("file1MF") MultipartFile[] file1MF) {

    System.out.println("📎 첨부파일 메일 전송 요청됨 → " + receiver);
    MailTool mailTool = new MailTool();
    mailTool.send_file(receiver, from, title, content, file1MF, "C:/kd/deploy/resort/mail/storage/");

    return "첨부파일 포함 메일 전송 완료";
  }

  /**
   * OpenAI 기반 메일 번역 요청 (React fetch POST)
   */
  @PostMapping("/translator")
  public String mailTranslator(@RequestBody String json_src) {
    JSONObject src = new JSONObject(json_src);

    String url = "http://121.78.128.146:8000/mail_translator";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> body = new HashMap<>();
    body.put("SpringBoot_FastAPI_KEY", new LLMKey().getSpringBoot_FastAPI_KEY());
    body.put("title", src.get("title"));
    body.put("content", src.get("content"));
    body.put("language", src.get("language"));

    HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);

    String response = restTemplate.postForObject(url, requestEntity, String.class);
    return response;
  }
}
