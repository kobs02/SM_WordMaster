package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.MemberRole;
import com.example.SMU_WordMaster.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

// 사용자 정보를 관리하는 JPA 리포지토리
public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByLoginId(String loginId);

    @Query("SELECT COUNT(u) FROM Users u WHERE u.role = :role")
    int countUsers(@Param("role") MemberRole role);

    boolean existsByLoginId(String LoginId);

    @Query("SELECT u FROM Users u WHERE u.role = :role")
    List<Users> findUsers(@Param("role") MemberRole role);

    @Modifying
    @Query("UPDATE Users u SET u.name = :name, u.password = :password WHERE u.loginId = :loginId")
    void updateNameAndPassword(@Param("loginId") String loginId, @Param("name") String name, @Param("password") String password);

    @Modifying
    @Query("UPDATE Users u SET u.name = :name WHERE u.loginId = :loginId")
    void updateName(@Param("loginId") String loginId, @Param("name") String name);

    @Modifying
    @Query("UPDATE Users u SET u.name = :name, u.password = :password WHERE u.loginId = :loginId")
    void updatePassword(@Param("loginId") String loginId, @Param("password") String password);

    // 비밀번호 존재 여부 검증
    boolean existsByPassword(String password);

    boolean existsByLoginIdAndPassword(String loginId, String password);
}
