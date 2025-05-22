package com.example.SMU_WordMaster.controller;
import com.example.SMU_WordMaster.dto.Word;
import com.example.SMU_WordMaster.service.WordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
public class WordController {

    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    // 전체 단어 목록 반환 (DTO 리스트)
    @GetMapping
    public List<Word> getAllWords() {
        return wordService.getAllWords();
    }

    // 🔹 레벨과 유닛 기준으로 단어 조회 (DTO 반환) — 🔧 수정된 부분
    @GetMapping("/by-level-unit")
    public List<Word> getWordsDtoByLevelAndUnit(
            @RequestParam String level,
            @RequestParam int unit
    ) {
        // Words 엔티티가 아닌 Word DTO를 반환하도록 수정
        return wordService.getWordsDtoByLevelAndUnit(level, unit);
    }

    // 단어 추가
    @PostMapping
    public void addWord(@RequestBody Word word) {
        wordService.addWord(word);
    }
}