package dev.mvc.team5;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // 모든 경로에 대해
    	.allowedOrigins(
        "http://localhost:3000",  // 로컬 개발환경용
        "http://121.78.128.212:3000" // 실제 배포된 프론트 주소
    			)
      .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
      .allowedHeaders("*")   // 모든 요청 헤더 허용
      .allowCredentials(true)   // 인증 쿠키/세션 허용
      .maxAge(3600);   //캐시 시간 1시간
    
  }
}