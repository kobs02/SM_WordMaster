package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.WordsDto;
import com.example.SMU_WordMaster.service.GptService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gpt")
@RequiredArgsConstructor // service 계층 이용 가능하게 도와줌.
public class GptController {
    private final GptService gptService;

    private static final String PROMPT_PREFIX = "아래의 영어 단어를 사용하여, 주어진 예문과는 중복되지 않는 창의적인 예문을 하나 생성해줘.\n" +
            "[출력 포맷]: JSON 형식\n" +
            "{sentence: 예문}";

    // 예문 생성 요청
    @PostMapping("/create")
    public String createSentence(@RequestBody WordsDto dto) {
        try {
            // 해당 단어에 대한 예문 전부 조회
            List<String> sentenceList = gptService.getSentence(dto.getWord());
            String prompt = "[영어 단어]: " + dto.getWord() + "\n[예문]: " + sentenceList;

            // 테이블에 있는 예문과 중복되지 않는 예문 생성 요청
            String sentence = gptService.getGptResponse(PROMPT_PREFIX + prompt);

            // 생성된 예문 출력
            System.out.println(sentence);

            // 해당 단어에 대한 예문이 20개를 초과한다면, 가장 오래된 예문 삭제
            gptService.deleteSentence(dto.getWord());

            // 새로 생성된 예문 추가
            gptService.createSentence(dto.getWord(), sentence);

            // 새로 생성된 예문 반환
            return sentence;

        }
        catch (Exception e) {
            return "예문 생성 실패";
        }
    }

    // 예문 조회 요청
    @GetMapping("/get")
    public List<String> getSentence(GptDto dto) {
        List<String> sentenceList = gptService.getSentence(dto.getWord());

        return sentenceList;
    }
}