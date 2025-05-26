package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.RankingLevel;
import com.example.SMU_WordMaster.entity.Rankings;
import com.example.SMU_WordMaster.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RankingsRepository extends JpaRepository<Rankings, Long> {
    Optional<Rankings> findByUsers(Users userEntity);

    @Modifying
    @Query("UPDATE Rankings r SET r.exp = :exp, r.rankingLevel = :rankingLevel WHERE r.users = :userEntity")
    void updateExpWithRankingLevelByUsersAndRankingLevel(@Param("userEntity") Users userEntity, @Param("exp") Long exp, @Param("rankingLevel") RankingLevel rankingLevel);

    @Query("SELECT r FROM Rankings r ORDER BY r.exp DESC")
    List<Rankings> findAllOrderByExpDesc();

    boolean existsByUsers(Users userEntity);
}
