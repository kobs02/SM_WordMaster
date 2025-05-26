package com.example.SMU_WordMaster.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "words_table")
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "word_id")
    private Long id;

    @Column
    @Enumerated(EnumType.STRING)
    private Level level;

    @Column
    private String mean;

    @Column
    private String spelling;

    // enum 정의
    public enum Level {
        A1, A2, B1, B2, C1, C2
    }
}
