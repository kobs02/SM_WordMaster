package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.entity.WrongAnswers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WrongAnswersRepository extends JpaRepository<WrongAnswers, Long> {
    List<WrongAnswers> findByUsers(Users userEntity);

    @Modifying
    @Query("UPDATE WrongAnswers w SET w.count = w.count + 1 WHERE w.users = :userEntity AND w.words = :wordEntity")
    void updateByUsersAndWords(@Param("userEntity")Users userEntity, @Param("wordEntity")Words wordEntity);

    boolean existsByUsersAndWords(Users userEntity, Words wordEntity);
}
