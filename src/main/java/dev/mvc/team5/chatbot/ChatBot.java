package dev.mvc.team5.chatbot;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import dev.mvc.team5.match.Match;
import dev.mvc.team5.request.Request;
import dev.mvc.team5.school.School;
import dev.mvc.team5.talentcategory.TalentCategory;
import dev.mvc.team5.talenttype.TalentType;
import dev.mvc.team5.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter 
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "chatbot")
public class ChatBot {
  
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chatbot_seq")
  @SequenceGenerator(name = "chatbot_seq", sequenceName = "CHATBOT_SEQ", allocationSize = 1)
  @Column(name = "chatbotno")
  private Long chatbotno;

  @ManyToOne
  @JoinColumn(name = "userno")
  private User user;
  
  @Column
  private String content;
  
  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;
  
  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
  
  public ChatBot(User user, String content) {
    this.user = user;
    this.content = content;
}
}
