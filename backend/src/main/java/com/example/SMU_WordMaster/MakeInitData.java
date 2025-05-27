package com.example.SMU_WordMaster;

import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.repository.UsersRepository;
import com.example.SMU_WordMaster.role.MemberRole;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MakeInitData {

    private final UsersRepository usersRepository;

    @PostConstruct
    public void makeAdminAndUser() {
        // 관리자 계정이 없다면 생성
        if (!usersRepository.existsByLoginId("admin")) {
            Users admin = new Users();
            admin.setLoginId("admin");
            admin.setName("관리자");
            admin.setPassword("1234");
            admin.setRole(MemberRole.ADMIN);
            usersRepository.save(admin);
        }

        // 일반 사용자 계정이 없다면 생성
        if (!usersRepository.existsByLoginId("user")) {
            Users user = new Users();
            user.setLoginId("user");
            user.setName("일반유저");
            user.setPassword("1234");
            user.setRole(MemberRole.USER);
            usersRepository.save(user);
        }
    }
}