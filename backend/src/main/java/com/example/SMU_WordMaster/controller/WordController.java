package com.example.SMU_WordMaster.controller;
import com.example.SMU_WordMaster.dto.CountUnitsResponseDto;
import com.example.SMU_WordMaster.dto.Word;
import com.example.SMU_WordMaster.dto.UpdateWordRequestDto;
import com.example.SMU_WordMaster.service.WordService;
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

    @GetMapping("/countUnits")
    public ResponseEntity<?> countUnits() {
        try {
            List<CountUnitsResponseDto> countUnitsList = wordService.countUnits();
            return utils.getSuccessResponse("정상적으로 레벨별 유닛 개수를 반환했습니다.", countUnitsList);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    @GetMapping("/doesWordExist")
    public ResponseEntity<?> doesWordExist(@RequestParam String spelling) {
        try {
            boolean doesExist = wordService.doesWordExist(spelling);
            return utils.getSuccessResponse("정상적으로 해당 단어 존재 여부를 확인했습니다: " + spelling, doesExist);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    // 단어 추가
    @PostMapping
    public void addWord(@RequestBody List<Word> wordList) {
        wordService.addWord(wordList);
    }

    // 단어 삭제
    @DeleteMapping
    public void deleteWord(@RequestParam List<String> wordList) {
        wordService.deleteWord(wordList);
    }

    // 단어 수정
    @PatchMapping
    public void updateWord(@RequestBody UpdateWordRequestDto dto) {
        String spelling = dto.getSpelling();
        String newSpelling = dto.getNewSpelling();
        String newMean = dto.getNewMean();
        wordService.updateWord(spelling, newSpelling, newMean);
    }
}