package dev.mvc.team5;

//import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
//@ComponentScan(basePackages = {"dev.mvc"})
public class Team5V2sbm3cApplication {
  public static void main(String[] args) {
    SpringApplication.run(Team5V2sbm3cApplication.class, args);
  }
}