package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// 사용자 정보를 관리하는 JPA 리포지토리
public interface UsersRepository extends JpaRepository<Users, Long> {
    // 기본적인 CRUD 메서드는 JpaRepository에서 자동 제공됨
    Optional<Users> findByEmail(String email);
}
