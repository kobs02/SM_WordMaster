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
    @Column(name = "login_id")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    private boolean role;

    // Sentences 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sentences> sentences = new ArrayList<>();

    // Bookmarks 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmarks> bookmarks = new ArrayList<>();
}
