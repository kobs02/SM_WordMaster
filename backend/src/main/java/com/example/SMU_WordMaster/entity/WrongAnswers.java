package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// 사용자의 단어별 오답 여부를 저장하는 엔티티 클래스
@Entity
@Table(name="wrong_answers_table")
@Getter
@Setter
@ToString(exclude={"users", "word"})
public class WrongAnswers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="wrong_answer_id")
    private Long wrongAnswerId;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="id")
    private Users users;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="word_id")
    private Word word;

    @Column(name="count", columnDefinition = "INT DEFAULT 0")
    private int count = 0;
}
