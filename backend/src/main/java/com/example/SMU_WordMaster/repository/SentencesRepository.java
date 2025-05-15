package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Sentences;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

// 사용자가 생성한 영어 예문을 조회 및 관리하는 JPA 리포지토리
public interface SentencesRepository extends JpaRepository<Sentences, Long> {
    // 특정 사용자와 단어 조합으로 저장된 예문 개수 반환
    int countByUsersAndWords(Users userEntity, Words wordEntity);

    // 특정 사용자와 단어 조합으로 저장된 예문 리스트 조회
    List<Sentences> findByUsersAndWords(Users userEntity, Words wordEntity);

    // 특정 사용자와 단어 조합으로 저장된 예문 중 가장 최근에 생성된 예문 엔티티 조회
    Optional<Sentences> findTopByUsersAndWordsOrderBySentenceIdDesc(Users userEntity, Words wordEntity);

    // 특정 사용자와 단어 조합으로 저장된 예문 중 가장 오래된 예문 엔티티 조회
    Optional<Sentences> findTopByUsersAndWordsOrderBySentenceId(Users userEntity, Words wordEntity);

    // 특정 사용자가 생성한 모든 예문 리스트 조회
    List<Sentences> findByUsers(Users userEntity);
}
