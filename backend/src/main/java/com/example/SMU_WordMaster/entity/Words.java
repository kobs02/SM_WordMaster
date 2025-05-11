package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// 단어 테이블 매핑용 Entity
// @ToString: 객체 출력 시 구조 확인을 위해 사용
@Entity
@Table( name = "words_table" )
@Getter
@Setter
@ToString
public class Words {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "word_id")
    private Long wordId;

    @Column(name = "word")
    private String word;

    @Column(name = "mean")
    private String mean;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private Level level;

    @Lob
    @Column(name = "sentence")
    private String sentence;

    @Lob
    @Column(name = "translation")
    private String translation;
}