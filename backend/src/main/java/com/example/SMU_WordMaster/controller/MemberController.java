package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.MemberDto;
import com.example.SMU_WordMaster.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final ControllerUtils utils;

    // 회원가입
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody MemberDto dto) {
        memberService.save(dto);
        return utils.getSuccessResponse("정상적으로 가입되었습니다: " + dto.getName(), null);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto dto, HttpSession session) {
        memberService
    }

    // 로그아웃

    // 회원 정보 수정

    // 회원 탈퇴



}
