package com.example.SMU_WordMaster.controller;
import com.example.SMU_WordMaster.dto.MemberDTO;
import com.example.SMU_WordMaster.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Controller
@RequestMapping("/")

public class MemberController {

    private final MemberService memberService;

// 회원가입 페이지 출력 요청
    @GetMapping("/member/save") // Get 요청이 오면 실행됨
    public String saveForm() {
        return "save";
    }

// 회원가입 양식을 받아서 memberDTO에 저장 후
    @PostMapping("/member/save") // Post 요청이 오면 실행됨
    public String save(@ModelAttribute MemberDTO memberDTO) {
        System.out.println("MemberController.save");
        System.out.println("memberDTO = " + memberDTO);
        memberService.save(memberDTO);
        return "home";
    }
    @GetMapping("/member/login")
    public String loginForm(){
        return "login";
    }

// 로그인
    @PostMapping("/member/login") // session : 로그인 유지
    public String login(@ModelAttribute MemberDTO memberDTO, HttpSession session) {
        MemberDTO loginResult = memberService.login(memberDTO);

        // 로그인 성공 시, 사용자는 Email을 세션으로 부여받게 됨.
        if (loginResult != null) {
            session.setAttribute("loginId", loginResult.getLoginId());
            session.setAttribute("loginName", loginResult.getName());
            session.setAttribute("loginRole", loginResult.getRole());
            return "session"; // session으로 이동
        }
        // login 실패 시, 로그인 화면에 머뭄
        else {return "login";}
    }

// 로그아웃
    @GetMapping("/member/logout")
    public String logout(HttpSession session) {
        session.invalidate(); // 세션을 무효화하여 로그인 정보를 삭제
        return "redirect:/";  // 로그인 페이지 URL로 리디렉션
    }

// 로그인 정보 확인
    @GetMapping("/member/session")
    public String session(){
        return "session";
    }

// 회원 목록 조회
    @GetMapping("/member/")
    public String findAll(Model model) {
        List<MemberDTO> memberDTOList = memberService.findAll();
        // 어떠한 html로 가져갈 데이터가 있다면 model 사용
        model.addAttribute("memberList", memberDTOList);
        return "list";

    }
// 조회
    @GetMapping("/member/{id}")
    public String findById(@PathVariable Long id, Model model) {
        MemberDTO memberDTO = memberService.findById(id);
        // login 처럼 return 값에 따라 분류 할 수 있음
        model.addAttribute("member", memberDTO);
        return "detail";
    }
// 삭제
    @GetMapping("/member/delete/{id}") // /member/{id}로 할 수 있도록 공부
    public String deleteById(@PathVariable Long id){
        memberService.deleteByid(id);

        return "redirect:/member/"; // list 로 쓰면 껍데기만 보여짐
    }
}