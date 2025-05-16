package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
    // 로그인 아이디로 회원정보 조회
    Optional<MemberEntity> findByLoginId(String loginId);
    boolean existsByLoginId(String loginId);
}