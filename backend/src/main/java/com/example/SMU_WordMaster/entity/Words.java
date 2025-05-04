package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table( name = "words" )
@Getter
@Setter
@ToString
public class Words {
    @Id
    @Column(name = "word_id")
    private int wordId;

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
}