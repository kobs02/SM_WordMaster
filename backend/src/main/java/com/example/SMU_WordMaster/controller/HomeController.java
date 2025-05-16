package com.example.SMU_WordMaster.controller;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
    @GetMapping("/")
    public String home(HttpSession session, Model model) {
        // 세션에서 로그인된 이메일 정보 가져오기
        String loginEmail = (String) session.getAttribute("loginId");
        String loginName = (String) session.getAttribute("loginName");

        if (loginEmail != null) {
            // 로그인 상태일 때
            model.addAttribute("isLoggedIn", true);  // 로그인된 상태
            model.addAttribute("message","사용자 " + loginName + "님 안녕하세요!");
        } else {
            // 로그인되지 않은 상태일 때
            model.addAttribute("isLoggedIn", false);
            model.addAttribute("message", "로그인 하세요!");
        }

        return "home";  // 홈 페이지 뷰로 리턴
    }
}