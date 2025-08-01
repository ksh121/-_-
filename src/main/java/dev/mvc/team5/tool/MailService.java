package dev.mvc.team5.tool;

import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Message;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class MailService {
  @Autowired
  private UniversityEmailService universityEmailService;
    /**
     * 텍스트 메일 전송
     * @param receiver 메일 받을 이메일 주소
     * @param from 보내는 사람 이메일 주소
     * @param title 제목
     * @param content 전송 내용
     */
    public void send(String receiver, String from, String title, String content) {
      Properties props = new Properties();
      props.put("mail.smtp.host", "smtp.gmail.com");
      props.put("mail.smtp.port", "587");
      props.put("mail.smtp.auth", "true");
      props.put("mail.smtp.starttls.enable", "true");
      props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
      
      // 3. SMTP 서버정보와 사용자 정보를 기반으로 Session 클래스의 인스턴스 생성
      Session session = Session.getInstance(props, new javax.mail.Authenticator() {
          protected PasswordAuthentication getPasswordAuthentication() {
              String user="heeyk5648@gmail.com";
              String password="lalf zsdl daqh pffk";
              return new PasswordAuthentication(user, password);
          }
      });
    
      Message message = new MimeMessage(session);
      try {
          message.setFrom(new InternetAddress(from));
          message.addRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
          message.setSubject(title);
          message.setContent(content, "text/html; charset=utf-8");

          Transport.send(message);
      } catch (Exception e) {
          e.printStackTrace();
      }    
  }
    //인증번호 생성 및 저장
    private final Map<String, String> codeStore = new ConcurrentHashMap<>();

    public String generateAndSendAuthCode(String receiverEmail) {
        String code = String.valueOf((int)(Math.random() * 900000) + 100000); // 6자리 숫자
        codeStore.put(receiverEmail, code);
        sendAuthCode(receiverEmail, code); // 이미 구현된 메서드 활용
        return code;
    }
    // 인증번호 검증
    public boolean verifyCode(String email, String inputCode) {
      String savedCode = codeStore.get(email);
      return savedCode != null && savedCode.equals(inputCode);
  }
 // 인증번호 전송 메서드
    public boolean sendAuthCode(String receiverEmail, String authCode) {
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");

        Session session = Session.getInstance(props, new javax.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                String user = "heeyk5648@gmail.com"; // 본인 이메일
                String password = "lalf zsdl daqh pffk"; // 앱 비밀번호
                return new PasswordAuthentication(user, password);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress("heeyk5648@gmail.com")); // 보내는 사람
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(receiverEmail)); // 받는 사람
            message.setSubject("요청하신 인증번호입니다.");
            String content = "<h3>인증번호: " + authCode + "</h3><p>요청하신 인증번호입니다. 입력 후 확인을 눌러주세요.</p>";
            message.setContent(content, "text/html; charset=utf-8");

            Transport.send(message);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    //도메인으로 대학 이메일 여부 확인
    public boolean isUniversityEmail(String email) {
//      String domain = email.substring(email.indexOf("@") + 1).toLowerCase();
//      return domain.endsWith(".ac.kr"); // 단순히 .ac.kr 포함 여부만으로 판단
      return universityEmailService.isValidUniversityEmail(email);
      // 혹은 도메인 리스트 관리
  }
    /**
     * 파일 첨부 메일 전송
     * @param receiver 메일 받을 이메일 주소
     * @param title 제목
     * @param content 전송 내용
     * @param file1MF 전송하려는 파일 목록
     * @param path 서버상에 첨부하려는 파일이 저장되는 폴더
     */
    public void send_file(String receiver, String from, String title, String content,
                                  MultipartFile[] file1MF, String path) {
      Properties props = new Properties();
      props.put("mail.smtp.host", "smtp.gmail.com");
      props.put("mail.smtp.port", "587");
      props.put("mail.smtp.auth", "true");
      props.put("mail.smtp.starttls.enable", "true");
      props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
      
      // 3. SMTP 서버정보와 사용자 정보를 기반으로 Session 클래스의 인스턴스 생성
      Session session = Session.getInstance(props, new javax.mail.Authenticator() {
          protected PasswordAuthentication getPasswordAuthentication() {
            String user="heeyk5648@gmail.com";
            String password="lalf zsdl daqh pffk";
              return new PasswordAuthentication(user, password);
          }
      });
    
      Message message = new MimeMessage(session);
      try {
          message.setFrom(new InternetAddress(from));
          message.addRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
          message.setSubject(title);
          
          MimeBodyPart mbp1 = new MimeBodyPart();
          mbp1.setContent(content, "text/html; charset=utf-8"); // 메일 내용
          
          Multipart mp = new MimeMultipart();
          mp.addBodyPart(mbp1);

          // 첨부 파일 처리
          // ---------------------------------------------------------------------------------------
          for (MultipartFile item:file1MF) {
              if (item.getSize() > 0) {
                  MimeBodyPart mbp2 = new MimeBodyPart();
                  
                  String fname=path+item.getOriginalFilename();
                  System.out.println("-> file name: " + fname); 
                  
                  FileDataSource fds = new FileDataSource(fname);
                  
                  mbp2.setDataHandler(new DataHandler(fds));
                  mbp2.setFileName(fds.getName());
                  
                  mp.addBodyPart(mbp2);
              }
          }
          // ---------------------------------------------------------------------------------------
          
          message.setContent(mp);
          
          Transport.send(message);
          
      } catch (Exception e) {
          e.printStackTrace();
      }    
  }
  
}