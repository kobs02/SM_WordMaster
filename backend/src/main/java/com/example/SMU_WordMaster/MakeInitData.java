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
        if (!memberRepository.existsByMemberEmail("admin")) {
            MemberEntity admin = new MemberEntity();
            admin.setMemberEmail("admin");
            admin.setMemberName("관리자");
            admin.setMemberPassword("q1w2e3r4");
            admin.setMemberRole(MemberRole.ADMIN);
            memberRepository.save(admin);
        }

        // 일반 사용자 계정이 없다면 생성
        if (!memberRepository.existsByMemberEmail("user@smu.ac.kr")) {
            MemberEntity user = new MemberEntity();
            user.setMemberEmail("user@smu.ac.kr");
            user.setMemberName("일반유저");
            user.setMemberPassword("user1234");
            user.setMemberRole(MemberRole.USER);
            memberRepository.save(user);
        }
    }
}
