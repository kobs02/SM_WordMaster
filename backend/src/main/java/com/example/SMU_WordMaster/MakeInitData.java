package com.example.SMU_WordMaster;

import com.example.SMU_WordMaster.entity.MemberEntity;
import com.example.SMU_WordMaster.repository.MemberRepository;
import com.example.SMU_WordMaster.role.MemberRole;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MakeInitData {

    private final MemberRepository memberRepository;

    @PostConstruct
    public void makeAdminAndUser() {
        // 관리자 계정이 없다면 생성
        if (!memberRepository.existsByLoginId("admin")) {
            MemberEntity admin = new MemberEntity();
            admin.setLoginId("admin");
            admin.setName("관리자");
            admin.setPassword("1234");
            admin.setRole(MemberRole.ADMIN);
            memberRepository.save(admin);
        }

        // 일반 사용자 계정이 없다면 생성
        if (!memberRepository.existsByLoginId("user")) {
            MemberEntity user = new MemberEntity();
            user.setLoginId("user");
            user.setName("일반유저");
            user.setPassword("1234");
            user.setRole(MemberRole.USER);
            memberRepository.save(user);
        }
    }
}
