package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

// 사용자 엔티티
@Entity
@Table(name = "users_table")
@Getter
@Setter
@ToString
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long userId;

    @Column(name = "login_id")
    private String loginId;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "role", columnDefinition = "bit(1)")
    private boolean role;

    // Sentences 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sentences> sentences = new ArrayList<>();

    // Bookmarks 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmarks> bookmarks = new ArrayList<>();

    // WrongAnswers 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WrongAnswers> wrongAnswers= new ArrayList<>();
}
