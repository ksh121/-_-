package dev.mvc.team5.block;

import java.time.LocalDateTime;

import dev.mvc.team5.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "blocks")
@Data
public class Block {

    @Id
    @GeneratedValue(strategy=GenerationType.SEQUENCE, generator="block_seq")
    @SequenceGenerator(name="block_seq", sequenceName="BLOCK_SEQ", allocationSize=1)
    private Long blockno;

    @ManyToOne
    @JoinColumn(name = "blocker")
    private User blocker;

    @ManyToOne
    @JoinColumn(name = "blocked")
    private User blocked;

    private LocalDateTime createdAt;
    private String  reason;
    private Boolean active = false;
}