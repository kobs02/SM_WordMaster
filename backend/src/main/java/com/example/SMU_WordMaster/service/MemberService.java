/*package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.IsMemberResponseDto;
import com.example.SMU_WordMaster.dto.MemberDto;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {
    private final UsersRepository usersRepository;

    // 회원 저장 -> 저장된 엔티티를 DTO로 변환
    public void save(MemberDto memberDto) {
        Users userEntity = new Users();
        userEntity.setLoginId(memberDto.getLoginId());
        userEntity.setPassword(memberDto.getPassword());
        userEntity.setName(memberDto.getName());
        userEntity.setRole(false);
        usersRepository.save(userEntity);
    }

    // 로그인 이메일 중복 검사 기능
    public boolean checkLoginIdDuplicate(String LoginId) {
        return usersRepository.existsByLoginId(LoginId);
    }

    // 로그인 서비스
    /*public IsMemberResponseDto login(String LoginId, String password) {
        boolean isLoginId = false;
        boolean isPassword = false;
        if (usersRepository.existsByLoginId(LoginId)) {
            isLoginId = true;
            if (usersRepository.findByLoginId(LoginId).getPassword().equals(password)) {
                isPassword = true;
            }
        }
        return new IsMemberResponseDto(isLoginId, isPassword);
    }*/

