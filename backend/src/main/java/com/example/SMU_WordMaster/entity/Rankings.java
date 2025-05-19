package com.example.SMU_WordMaster.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

// 랭킹 엔티티
@Entity
@Table(name = "rankings_table")
@Getter
@Setter
@ToString(exclude = {"users"})
public class Rankings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ranking_id")
    private Long rankingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "login_id")
    private Users users;

    @Enumerated(EnumType.STRING)
    @Column(name = "ranking_level")
    private RankingLevel rankingLevel;

    @Column(name = "experience_point", columnDefinition = "BIGINT DEFAULT 0")
    private Long exp = 0L;
}
