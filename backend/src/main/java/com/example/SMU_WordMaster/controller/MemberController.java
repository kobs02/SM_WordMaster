package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.UserDto;
import com.example.SMU_WordMaster.entity.MemberRole;
import com.example.SMU_WordMaster.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/member")
public class MemberController {

    private final MemberService memberService;
    private final ControllerUtils utils;

    /** 회원가입 */
    @PostMapping("/save")
    public ResponseEntity<UserDto> save(@RequestBody UserDto userDto) {
        UserDto saved = memberService.save(userDto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }
    /** 로그인 */
    @PostMapping("/login")
    public ResponseEntity<UserDto> login(
            @RequestBody UserDto userDto,
            HttpSession session
    ) {
        UserDto loginResult = memberService.login(userDto);
        if (loginResult != null) {
            session.setAttribute("loginId", loginResult.getLoginId());
            session.setAttribute("loginName", loginResult.getName());
            session.setAttribute("loginRole", loginResult.getRole());
            return ResponseEntity.ok(loginResult);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    /** 로그아웃 */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    /** 현재 로그인 세션 정보 */
    @GetMapping("/session")
    public ResponseEntity<UserDto> session(HttpSession session) {
        String loginId = (String) session.getAttribute("loginId");
        Long Id = (Long) session.getAttribute("Id");
        if (loginId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserDto dto = new UserDto();
        dto.setLoginId(loginId);
        dto.setName((String) session.getAttribute("loginName"));
        dto.setRole((MemberRole) session.getAttribute("loginRole"));
        return ResponseEntity.ok(dto);
    }
    /** 전체 회원 조회 */
    @GetMapping()
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(memberService.findAll());
    }

    /** 단일 회원 조회 */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> findById(@PathVariable Long id) {
        UserDto dto = memberService.findById(id);
        return dto != null
                ? ResponseEntity.ok(dto)
                : ResponseEntity.notFound().build();
    }

    /** 회원 삭제 */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        memberService.deleteByid(id);
        return ResponseEntity.noContent().build();
    }

    /* 회원 정보 업데이트 */
    @PatchMapping()
    public ResponseEntity<?> updateNameOrPassword(@RequestParam String name, @RequestParam String password, HttpSession session) {
        try {
            String loginId = (String) session.getAttribute("loginId");
            memberService.updateNameOrPassword(loginId, name, password);
            return utils.getSuccessResponse("정상적으로 프로필을 업데이트했습니다.", null);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    @GetMapping("/checkPassword")
    public ResponseEntity<?> checkPassword(@RequestParam String password, HttpSession session) {
        try {
            String loginId = (String) session.getAttribute("loginId");
            boolean match = memberService.checkPassword(loginId, password);
            return utils.getSuccessResponse("정상적으로 비밀번호와의 일치 여부를 검증했습니다.", match);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }
}