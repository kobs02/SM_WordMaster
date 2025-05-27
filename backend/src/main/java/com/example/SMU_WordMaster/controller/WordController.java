package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.CountUnitsResponseDto;
import com.example.SMU_WordMaster.dto.WordDto;
import com.example.SMU_WordMaster.dto.UpdateWordRequestDto;
import com.example.SMU_WordMaster.repository.WordRepository;
import com.example.SMU_WordMaster.service.WordService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/doesWordExist")
    public ResponseEntity<Boolean> doesWordExist(@RequestParam String spelling) {
        boolean exists = wordService.doesWordExist(spelling);
        return ResponseEntity.ok(exists);
    }
    // ✅ 유닛 수 세기
    /** GET /api/words/countUnits → [{ level, count }, …] */
    @GetMapping("/countUnits")
    public ResponseEntity<List<CountUnitsResponseDto>> countUnits() {
        List<CountUnitsResponseDto> list = wordService.countUnits();
        return ResponseEntity.ok(list);
    }

    // ✅ 단어 등록
    @PostMapping("/bulk")
    public ResponseEntity<List<WordDto>> createWords(@RequestBody List<WordDto> wordList) {
        List<WordDto> saved = wordService.addWord(wordList);
        return ResponseEntity.ok(saved);
    }
    /**
     * ✅ bulk delete: /api/words?wordList=aa&wordList=bb&…
     */
    @DeleteMapping
    public ResponseEntity<Void> deleteWords(@RequestParam List<String> wordList) {
        wordService.deleteWords(wordList);
        return ResponseEntity.noContent().build();
    }


    // ✅ 단어 수정
    @PutMapping("/{id}")
    public ResponseEntity<com.example.SMU_WordMaster.entity.Word> updateWord(
            @PathVariable Long id,
            @RequestBody UpdateWordRequestDto updateDto
    ) {return ResponseEntity.ok(wordService.updateWord(id, updateDto));}

    // ✅ 단어 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        wordService.deleteWord(id);
        return ResponseEntity.noContent().build();
    }
}
