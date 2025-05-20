package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// 예문 엔티티
@Entity
@Table(name = "sentences_table")
@Getter
@Setter
// Sentences 엔티티에서 Users, Words와의 연관관계로 인해 toString() 무한 순환을 방지하기 위해 제외
@ToString(exclude = {"users", "words"})
public class Sentences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "sentence_id")
    private Long sentenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id")
    private Words words;

    @Lob
    @Column(name = "sentence")
    private String sentence;

    @Lob
    @Column(name = "translation")
    private String translation;
}