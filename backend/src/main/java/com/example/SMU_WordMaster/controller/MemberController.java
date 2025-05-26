package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.MemberDTO;
import com.example.SMU_WordMaster.role.MemberRole;
import com.example.SMU_WordMaster.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;

    /** 회원가입 */
    @PostMapping("/member/save")
    public ResponseEntity<MemberDTO> save(@RequestBody MemberDTO memberDTO) {
        MemberDTO saved = memberService.save(memberDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }
    /** 로그인 */
    @PostMapping("/member/login")
    public ResponseEntity<MemberDTO> login(
            @RequestBody MemberDTO memberDTO,
            HttpSession session
    ) {
        MemberDTO loginResult = memberService.login(memberDTO);
        if (loginResult != null) {
            session.setAttribute("loginId", loginResult.getLoginId());
            session.setAttribute("loginName", loginResult.getName());
            session.setAttribute("loginRole", loginResult.getRole());
            return ResponseEntity.ok(loginResult);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /** 로그아웃 */
    @PostMapping("/member/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    /** 현재 로그인 세션 정보 */
    @GetMapping("/member/session")
    public ResponseEntity<MemberDTO> session(HttpSession session) {
        String loginId = (String) session.getAttribute("loginId");
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        MemberDTO dto = new MemberDTO();
        dto.setLoginId(loginId);
        dto.setName((String) session.getAttribute("loginName"));
        dto.setRole((MemberRole) session.getAttribute("loginRole"));
        return ResponseEntity.ok(dto);
    }
    /** 전체 회원 조회 */
    @GetMapping("/member")
    public ResponseEntity<List<MemberDTO>> findAll() {
        return ResponseEntity.ok(memberService.findAll());
    }

    /** 단일 회원 조회 */
    @GetMapping("/member/{id}")
    public ResponseEntity<MemberDTO> findById(@PathVariable Long id) {
        MemberDTO dto = memberService.findById(id);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    /** 회원 삭제 */
    @DeleteMapping("/member/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        memberService.deleteByid(id);
        return ResponseEntity.noContent().build();
    }
}