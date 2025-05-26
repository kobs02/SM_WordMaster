package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

// 사용자 정보를 관리하는 JPA 리포지토리
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByLoginId(String loginId);

    @Query("SELECT COUNT(u) FROM Users u WHERE u.role = false")
    int countUsers();
}
