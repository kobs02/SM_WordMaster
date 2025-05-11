package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Sentences;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 사용자가 생성한 영어 예문을 조회 및 관리하는 JPA 리포지토리
public interface SentencesRepository extends JpaRepository<Sentences, Long> {
    // 특정 사용자와 단어 조합으로 저장된 예문 개수 반환
    int countByUsersAndWords(Users userEntity, Words wordEntity);

    // 특정 사용자와 단어 조합으로 저장된 모든 예문 리스트 조회
    List<Sentences> findByUsersAndWords(Users userEntity, Words word);
}
