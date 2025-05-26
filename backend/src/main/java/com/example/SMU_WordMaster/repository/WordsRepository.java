package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.entity.Words;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

// 단어 정보를 조회하고 관리하는 JPA 리포지토리
public interface WordsRepository extends JpaRepository<Words, Long> {
    // 주어진 단어에 해당하는 엔티티 조회
    Optional<Words> findBySpelling(String spelling);

    boolean existsBySpelling(String spelling);

    int countByLevel(Level level);

    // ✅ level과 offset을 이용해 20개씩 단어 페이징 조회
    @Query(value = "SELECT * FROM words_table WHERE level = :level ORDER BY word_id LIMIT 20 OFFSET :offset", nativeQuery = true)
    List<Words> findByLevelAndOffset(@Param("level") String level, @Param("offset") int offset);

    @Modifying
    @Query("UPDATE Words w SET w.spelling = :newSpelling, w.mean = :newMean WHERE w.spelling = :spelling")
    void updateWord(@Param("spelling") String spelling, @Param("newSpelling") String newSpelling, @Param("newMean") String newMean);

}

