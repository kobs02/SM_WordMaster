package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Words;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


// JpaRepository는 데이터베이스 기본 CRUD 처리용 인터페이스
// extends JpaRepository<엔티티 클래스, PK 타입>
public interface GptRepository extends JpaRepository<Words, Long> {
    // word별 row 개수 조회
    int countByWord(String word);

    // word별 모든 row 조회
    List<Words> findByWord(String word);
}
