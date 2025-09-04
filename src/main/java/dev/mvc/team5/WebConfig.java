package dev.mvc.team5;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {


//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // "/uploads/**" 요청은 실제 파일 경로로 매핑
//        registry.addResourceHandler("/uploads/**")
//                .addResourceLocations("file:///" + uploadDir + "/");
//    }
//}

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**") // URL 경로
                .addResourceLocations("file:///home/ubuntu/deploy/team5/storage/"); 
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로에 대해
            .allowedOrigins("http://localhost:3000", "https://team5-react.vercel.app") // 허용 도메인
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")   // 허용 메서드
            .allowedHeaders("*")   // 모든 헤더 허용
            .allowCredentials(true) // 인증 정보 허용 (쿠키 등)
            .maxAge(3600); // preflight 결과 캐시
    }
    
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

