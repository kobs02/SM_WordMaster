package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

// 단어 테이블 매핑용 엔티티
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

    // Bookmarks 연관관계 (1:N)
    @OneToMany(mappedBy = "words", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmarks> bookmarks = new ArrayList<>();

    // Sentences 연관관계 (1:N)
    @OneToMany(mappedBy = "words", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sentences> sentences = new ArrayList<>();
}