package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Bookmarks;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// 북마크 엔티티에 대한 데이터베이스 접근을 담당하는 JPA 리포지토리
public interface BookmarksRepository extends JpaRepository<Bookmarks, Long> {
    // 특정 사용자와 단어 조합이 이미 북마크되어 있는지 확인
    boolean existsByUsersAndWords(Users userEntity, Words wordEntity);

    // 특정 사용자의 모든 북마크 리스트 조회
    List<Bookmarks> findByUsers(Users userEntity);

    void deleteByUsersAndWords(Users userEntity, Words wordEntity);
}
