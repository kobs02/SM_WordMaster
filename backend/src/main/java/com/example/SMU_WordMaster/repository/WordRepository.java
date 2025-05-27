package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    Optional<Word> findBySpelling(String spelling);

    boolean existsBySpelling(String spelling);

    int countByLevel(Level level);

    // level 기반 20개 단어 조회 (페이징 유사)
    @Query(value = "SELECT * FROM words_table WHERE level = :level ORDER BY word_id LIMIT 20 OFFSET :offset", nativeQuery = true)
    List<Word> findByLevelPaged(@Param("level") String level, @Param("offset") int offset);
    @Modifying
    @Query("DELETE FROM Word w WHERE w.spelling IN :spellings")
    void deleteBySpellingIn(@Param("spellings") List<String> spellings);
}
