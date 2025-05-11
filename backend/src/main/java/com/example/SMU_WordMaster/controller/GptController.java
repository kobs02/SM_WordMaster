package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.ErrorResponseDto;
import com.example.SMU_WordMaster.dto.SentenceResponseDto;
import com.example.SMU_WordMaster.dto.WordRequestDto;
import com.example.SMU_WordMaster.service.GptService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gpt")
@RequiredArgsConstructor // service 계층 이용 가능하게 도와줌.
public class GptController {
    private final GptService gptService;

    private static final String PROMPT_PREFIX = "아래의 영어 단어를 사용하여, 주어진 예문과는 중복되지 않는 창의적인 예문을 하나 생성해줘.\n" +
                                                "15단어 이내로 생성해줘.\n" +
                                                "[출력 포맷]: JSON 형식\n" +
                                                "{sentence: 예문," +
                                                "translation: 예문 뜻}";

    // 예문 생성 요청
    @PostMapping("/create")
    public ResponseEntity<?> createSentence(@RequestBody WordRequestDto wordRequestDto) {
        try {
            String word = wordRequestDto.getWord();

            // 테이블에 있는 예문과 중복되지 않는 예문 생성 요청
            List<String> sentenceList = gptService.getSentence(word);

            String prompt = "[영어 단어]: " + word + "\n[예문]: " + sentenceList;
            String responseJson = gptService.getGptResponse(PROMPT_PREFIX + prompt);

            // json 역직렬화: gpt 응답(json 객체)을 Dto로 관리할 수 있게 java 객체로 변환
            ObjectMapper mapper = new ObjectMapper();
            SentenceResponseDto sentenceDto = mapper.readValue(responseJson, SentenceResponseDto.class);

            String sentence = sentenceDto.getSentence();
            String translation = sentenceDto.getTranslation();

            // System.out.println(sentence);
            // System.out.println(translation);

            // 해당 단어에 대한 예문이 20개를 초과한다면, 가장 오래된 예문 삭제
            gptService.deleteSentence(word);

            // 새로 생성된 예문 추가
            gptService.createSentence(word,sentence, translation);

            // 생성된 예문과 번역을 프론트엔드에 응답으로 반환
            return ResponseEntity.ok(sentenceDto);
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(new ErrorResponseDto("예문 생성 실패", e.getMessage()));
        }
    }

    // 예문 조회 요청
    @GetMapping("/get")
    public List<String> getSentence(WordRequestDto dto) {
        List<String> sentenceList = gptService.getSentence(dto.getWord());

        return sentenceList;
    }
}