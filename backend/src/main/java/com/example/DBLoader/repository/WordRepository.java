package com.example.DBLoader.repository;

import com.example.DBLoader.dto.Word;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class WordRepository {
    private final JdbcTemplate jdbcTemplate;

    public WordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // RowMapper는 단어 DB 결과(ResultSet)을 자바 객체(Word)로 변환해줌
    private final RowMapper<Word> wordRowMapper = (rs, rowNum) ->
            new Word(
                    rs.getInt("word_id"),
                    rs.getString("word"),
                    rs.getString("mean"),
                    rs.getString("level")
            );

    // 모든 단어 데이터를 조회하는 함수
    public List<Word> findAll() {
        String sql = "SELECT * FROM words_table";
        return jdbcTemplate.query(sql, wordRowMapper);
    }

    // 새로운 단어 데이터를 DB에 저장하는 함수
    public void save(Word word) {
        String sql = "INSERT INTO words_table (word, mean, level) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, word.getWord(), word.getMean(), word.getLevel());
    }
}