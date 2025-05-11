package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.ErrorResponseDto;
import com.example.SMU_WordMaster.dto.SentenceResponseDto;
import com.example.SMU_WordMaster.dto.WordRequestDto;
import com.example.SMU_WordMaster.service.SentencesService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 예문 관련 요청을 처리하는 컨트롤러
@RestController
@RequestMapping("/api/sentence")
@RequiredArgsConstructor
public class SentencesController {
    private final SentencesService sentencesService;

    // GPT에 전달할 프롬프트 기본 형식
    private static final String PROMPT_PREFIX = "아래의 영어 단어를 사용하여, 창의적인 예문을 하나 15단어 이내로 생성해줘.\n" +
                                                "만약 아래에 주어진 예문이 있다면, 그 예문과는 중복되지 않는 예문을 생성해줘.\n" +
                                                "[출력 포맷]: JSON 형식\n" +
                                                "{sentence: 예문," +
                                                "translation: 예문 뜻}";

    // GPT를 이용해 예문을 생성하고,DB에 저장하는 API
    @PostMapping("/create")
    public ResponseEntity<?> createSentence(@RequestBody WordRequestDto wordDto) {
        try {
            String userId = wordDto.getUserId();
            String word = wordDto.getWord();

            // 기준 예문 목록 조회( 중복 방지용 )
            List<SentenceResponseDto> sentencePairs = sentencesService.getSentence(userId, word);

            // GPT에게 전달할 프롬프트 구성
            String prompt = "[영어 단어]: " + word + "\n[예문]: " + sentencePairs;
            String responseJson = sentencesService.getGptResponse(PROMPT_PREFIX + prompt);

            // GPT 응답(JSON)을 객체로 변환
            ObjectMapper mapper = new ObjectMapper();
            SentenceResponseDto sentenceDto = mapper.readValue(responseJson, SentenceResponseDto.class);

            String sentence = sentenceDto.getSentence();
            String translation = sentenceDto.getTranslation();

            // System.out.println(sentence);
            // System.out.println(translation);

            // 예문 20개 초과 시 가장 오래된 예문 삭제
            sentencesService.deleteSentence(userId, word);

            // 새로운 예문 저장
            sentencesService.createSentence(userId, word, sentence, translation);

            return ResponseEntity.ok(sentenceDto);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("예문 생성 실패", e.getMessage()));
        }

    }

    // 사용자의 특정 단어에 대한 예문 목록을 조회하는 API
    @GetMapping("/get")
    public ResponseEntity<?> getSentence(@RequestParam String userId, @RequestParam String word) {
        try {
            List<SentenceResponseDto> sentenceList = sentencesService.getSentence(userId, word);

            return ResponseEntity.ok(sentenceList);
        }
        catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("예문 조회 실패", e.getMessage()));
        }
    }
}