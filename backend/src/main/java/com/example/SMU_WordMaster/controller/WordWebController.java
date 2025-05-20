package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.entity.Word;
import com.example.SMU_WordMaster.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/words")
@RequiredArgsConstructor
public class WordWebController {

    private final WordRepository wordRepository;

    @GetMapping("/")
    public String home(Model model) {
        // 모델에 userName을 추가합니다.
        model.addAttribute("userName", "지형");  // 이 부분은 로그인한 사용자 이름으로 바꿔주세요.

        // "home" 템플릿을 반환하여 home.html을 렌더링합니다.
        return "home";
    }

    @GetMapping
    public String listWords(Model model) {
        model.addAttribute("words", wordRepository.findAll());
        model.addAttribute("newWord", new Word());
        return "word-form";
    }

    @PostMapping
    public String createWord(@ModelAttribute Word word) {
        wordRepository.save(word);
        return "redirect:/words";
    }

    @PostMapping("/delete/{id}")
    public String deleteWord(@PathVariable Long id) {
        wordRepository.deleteById(id);
        return "redirect:/words";
    }
}
