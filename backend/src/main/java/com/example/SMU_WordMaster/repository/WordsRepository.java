package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Words;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

// 단어 정보를 조회하고 관리하는 JPA 리포지토리
public interface WordsRepository extends JpaRepository<Words, Long> {
    // 주어진 단어에 해당하는 엔티티 조회
    Optional<Words> findByWord(String word);

    @Query("SELECT w.word FROM Words w WHERE w.wordId = :wordId")
    String findWordByWordId(@Param("wordId") Long wordId);
}
