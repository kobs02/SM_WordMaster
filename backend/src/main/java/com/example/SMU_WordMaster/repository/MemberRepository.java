package com.example.SMU_WordMaster.repository;

import com.example.SMU_WordMaster.entity.MemberEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<MemberEntity, Long> {
    boolean existsBymemberEmail(String memberEmail);
    // 이메일로 회원 정보 조회( select * from member_table where member_email=?)
    Optional<MemberEntity> findByMemberEmail(String memberEmail);

    boolean existsByMemberEmail(String mail);
}