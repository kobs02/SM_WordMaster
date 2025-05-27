package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Word;
import com.example.SMU_WordMaster.entity.WrongAnswers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WrongAnswersRepository extends JpaRepository<WrongAnswers, Long> {
    List<WrongAnswers> findByUsers(Users userEntity);

    @Modifying
    @Query("UPDATE WrongAnswers w SET w.count = w.count + 1 WHERE w.users = :userEntity AND w.word = :wordEntity")
    void updateByUsersAndWords(@Param("userEntity")Users userEntity, @Param("wordEntity") Word wordEntity);

    boolean existsByUsersAndWord(Users userEntity, Word wordEntity);
}
