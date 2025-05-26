package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.SentencesResponseDto;
import com.example.SMU_WordMaster.dto.SentencesRequestDto;
import com.example.SMU_WordMaster.service.SentencesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 예문 관련 요청을 처리하는 컨트롤러
@RestController
@RequestMapping("/api/sentence")
@RequiredArgsConstructor
public class SentencesController {
    private final SentencesService sentencesService;
    private final ControllerUtils utils;

    // GPT에 전달할 프롬프트 기본 형식
    private static final String PROMPT_PREFIX = "아래의 영어 단어를 사용하여, 창의적인 예문을 하나 15단어 이내로 생성해줘.\n" +
                                                "만약 아래에 주어진 예문이 있다면, 그 예문과는 중복되지 않는 예문을 생성해줘.\n" +
                                                "[출력 포맷]: JSON 형식\n" +
                                                "{\"spelling\": 단어, \"sentence\": 예문, \"translation\": 예문 뜻}";

    // 1) GPT를 이용해 예문을 생성하고, 2) 테이블에 저장한 후, 3) 생성된 예문 + 뜻을 프론트엔드로 반환하는 API
    @PostMapping("/create")
    public ResponseEntity<?> createSentence(@RequestBody SentencesRequestDto wordDto) {
        try {
            String loginId = wordDto.getLoginId();
            String spelling = wordDto.getSpelling();

            // 기준 예문 목록 조회( 중복 방지용 )
            List<SentencesResponseDto> sentencesList = sentencesService.getAllSentencesByWord(loginId, spelling);

            // GPT에게 전달할 프롬프트 구성
            String prompt = "[영어 단어]: " + spelling + "\n[예문]: " + sentencesList;

            SentencesResponseDto sentenceDto = sentencesService.getGptResponse(PROMPT_PREFIX + prompt, spelling);

            String sentence = sentenceDto.getSentence();
            String translation = sentenceDto.getTranslation();

            // 예문이 20개 이상이면, 가장 오래된 예문 삭제
            sentencesService.deleteOldestSentenceIfOverLimit(loginId, spelling);

            // 새로운 예문 저장
            sentencesService.saveSentence(loginId, spelling, sentence, translation);

            return utils.getSuccessResponse("정상적으로 예문을 생성했습니다.", sentenceDto);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    // 특정 사용자가 생성한 모든 예문을 프론트엔드로 반환하는 API
    @GetMapping("/getAllByUser")
    public ResponseEntity<?> getAllSentencesByUser(@RequestParam String loginId) {
        try {
            List<SentencesResponseDto> sentencesList = sentencesService.getAllSentencesByUser(loginId);
            return utils.getSuccessResponse("정상적으로 예문 전체를 조회했습니다.", sentencesList);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }
}