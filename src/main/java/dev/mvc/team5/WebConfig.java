package dev.mvc.team5;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
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
                .addResourceLocations("file:///C:/kd/deploy/team5/storage/"); 
    }
}

