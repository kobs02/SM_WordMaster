package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.WordDto;
import com.example.SMU_WordMaster.dto.UpdateWordRequestDto;
import com.example.SMU_WordMaster.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // React 연동용 CORS 설정
@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;
    private final ControllerUtils utils;

    // ✅ 전체 단어 조회 (DTO 리스트)
    @GetMapping
    public List<WordDto> getAllWords() {
        return wordService.getAllWords();
    }

    // ✅ 레벨과 유닛 기준 단어 조회
    @GetMapping("/by-level-unit")
    public List<WordDto> getWordsDtoByLevelAndUnit(
            @RequestParam String level,
            @RequestParam int unit
    ) {
        return wordService.getWordsDtoByLevelAndUnit(level, unit);
    }

    /*
    // ✅ 유닛 수 세기
    @GetMapping("/countUnits")
    public CountUnitsResponseDto countUnits(@RequestParam String level) {
        return wordService.countUnitsByLevel(level);
    }
     */

    // ✅ 단어 등록
    @PostMapping("/bulk")
    public ResponseEntity<List<WordDto>> createWords(@RequestBody List<WordDto> wordList) {
        List<WordDto> saved = wordService.addWord(wordList);
        return ResponseEntity.ok(saved);
    }



    // ✅ 단어 수정
    @PutMapping("/{id}")
    public ResponseEntity<com.example.SMU_WordMaster.entity.Word> updateWord(
            @PathVariable Long id,
            @RequestBody UpdateWordRequestDto updateDto
    ) {
        return ResponseEntity.ok(wordService.updateWord(id, updateDto));
    }

    // ✅ 단어 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        wordService.deleteWord(id);
        return ResponseEntity.noContent().build();
    }
}
