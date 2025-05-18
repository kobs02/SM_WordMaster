package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

// 북마크 엔티티
@Entity
@Table(name = "bookmarks_table")
@Setter
@Getter
// Bookmarks 엔티티에서 Users, Words와의 연관관계로 인해 toString() 무한 순환을 방지하기 위해 제외
@ToString(exclude = {"users", "words"})
public class Bookmarks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bookmark_id")
    private Long bookmarkId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "login_id")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "word_id")
    private Words words;
}
