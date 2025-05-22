package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Bookmarks;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// 북마크 엔티티에 대한 데이터베이스 접근을 담당하는 JPA 리포지토리
public interface BookmarksRepository extends JpaRepository<Bookmarks, Long> {
    // 특정 사용자와 단어에 대한 북마크 ID 조회
    @Query("SELECT b.bookmarkId FROM Bookmarks b WHERE b.users = :user AND b.words = :word")
    Long findBookmarkIdByUsersAndWords(@Param("user") Users userEntity, @Param("word") Words wordEntity);

    // 특정 사용자가 북마크한 모든 단어의 ID 리스트 조회
    @Query("SELECT b.words.wordId FROM Bookmarks b WHERE b.users = :user")
    List<Long> findWordIdByUsers(@Param("user") Users user);

    // 특정 사용자와 단어 조합이 이미 북마크되어 있는지 확인
    boolean existsByUsersAndWords(Users userEntity, Words wordEntity);
}
