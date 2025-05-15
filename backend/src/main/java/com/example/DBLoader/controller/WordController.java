package com.example.DBLoader.controller;
import com.example.DBLoader.dto.Word;
import com.example.DBLoader.service.WordService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
public class WordController {

    private final WordService wordService;

    public WordController(WordService wordService) {
        this.wordService = wordService;
    }

    @GetMapping
    public List<Word> getAllWords() {
        return wordService.getAllWords();
    }

    @PostMapping
    public void addWord(@RequestBody Word word) {
        wordService.addWord(word);
    }
}