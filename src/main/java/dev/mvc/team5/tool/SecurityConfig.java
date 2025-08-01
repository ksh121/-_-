package dev.mvc.team5.tool;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//같은 패키지 임포트필요없음
//import dev.mvc.team5.Security;

// 환경 설정 클래스로 자동 실행되어 객체를 생성한후 이용됨.
@Configuration
public class SecurityConfig {
  @Bean
  Security security() {
    return new Security();
  }
  
}