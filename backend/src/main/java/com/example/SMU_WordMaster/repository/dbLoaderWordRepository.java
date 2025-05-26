package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.dto.Word;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class dbLoaderWordRepository {
    private final JdbcTemplate jdbcTemplate;

    public dbLoaderWordRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // RowMapper는 단어 DB 결과(ResultSet)을 자바 객체(Word)로 변환해줌
    private final RowMapper<Word> wordRowMapper = (rs, rowNum) ->
            new Word(
                    rs.getString("spelling"),
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
        String sql = "INSERT INTO words_table (spelling, mean, level) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, word.getSpelling(), word.getMean(), word.getLevel());
    }
}