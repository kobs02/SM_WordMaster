package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.SentencesResponseDto;
import com.example.SMU_WordMaster.dto.SuccessResponseDto;
import com.example.SMU_WordMaster.entity.Sentences;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.exception.InsufficientSentencesException;
import com.example.SMU_WordMaster.exception.SentencesNotFoundByWordException;
import com.example.SMU_WordMaster.repository.SentencesRepository;
import com.example.SMU_WordMaster.repository.UsersRepository;
import com.example.SMU_WordMaster.repository.WordsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

// 예문 생성 및 관리 전반을 담당하는 서비스 클래스
@Service
@RequiredArgsConstructor
public class SentencesService {

    private final WordsRepository wordsRepository;
    private final SentencesRepository sentencesRepository;
    private final UsersRepository usersRepository;

    private final ServiceUtils utils;

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    // GPT API 호출을 통해 예문 응답을 문자열 형태로 반환
    public SentencesResponseDto getGptResponse(String prompt, String word) {
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // 기존 예문과 중복되지 않도록 temperature를 1.0으로 설정
        // (temperature가 0에 가까울수록, 동일한 질문에 대하여 동일한 응답을 함.)
        Map<String, Object> message = Map.of("role", "user", "content", prompt);
        Map<String, Object> body = Map.of(
                "model", "gpt-4.1-2025-04-14",
                "messages", List.of(message),
                "temperature", 1.0
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            // 상태 코드가 200번대가 아니면 예외 처리
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("GPT 응답 실패: 상태 코드 " + response.getStatusCode());
            }

            // choices 추출
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices == null || choices.isEmpty()) {
                throw new RuntimeException("GPT 응답에 choices가 비어 있습니다.");
            }

            // message 객체 추출
            Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
            if (messageObj == null || messageObj.get("content") == null) {
                throw new RuntimeException("GPT 응답의 message 또는 content가 null입니다.");
            }

            // content 파싱
            String content = (String) messageObj.get("content");

            ObjectMapper mapper = new ObjectMapper();
            SentencesResponseDto sentenceDto = mapper.readValue(content, SentencesResponseDto.class);
            sentenceDto.setWord(word);

            return sentenceDto;

        } catch (Exception e) {
            throw new RuntimeException("GPT 호출 또는 응답 처리 중 예외 발생: " + e.getMessage(), e);
        }
    }

    // 해당 사용자, 단어 조합의 예문이 20개 이상인 경우 가장 오래된 예문 삭제
    public boolean deleteOldestSentenceIfOverLimit(String email, String word) {
        // 사용자가 존재하지 않는 경우 예외 처리
        Users userEntity = utils.getUserEntity(email);

        // 단어가 존재하지 않는 경우 예외 처리
        Words wordEntity = utils.getWordsEntity(word);

        // 대안 흐름: 해당 단어에 대한 예문이 20개 미만인 경우
        if (sentencesRepository.countByUsersAndWords(userEntity, wordEntity) < 20) { return false; }

        // 정상 흐름
        Sentences sentenceEntity = utils.getSentencesEntity(userEntity, wordEntity);
        Long minId = sentenceEntity.getSentenceId();

        sentencesRepository.deleteById(minId);

        return true;
    }

    // 주어진 사용자와 단어에 해당하는 예문 1개를 예문 엔티티에 저장
    public boolean saveSentence(String email, String word, String sentence, String translation) {
        // 사용자가 존재하지 않는 경우 예외 처리
        Users userEntity = utils.getUserEntity(email);

        // 단어가 존재하지 않는 경우 예외 처리
        Words wordEntity = utils.getWordsEntity(word);

        // 예문이 null값인 경우 예외 처리
        if (sentence == null || sentence.isBlank()) { throw new IllegalArgumentException("해당 예문은 null이거나 비어 있습니다"); }

        // 예문 뜻이 null값인 경우 예외 처리
        if (translation == null || translation.isBlank()) { throw new IllegalArgumentException("해당 예문 뜻은 null이거나 비어 있습니다"); }

        // 정상 흐름
        Sentences sentences = new Sentences();

        sentences.setUsers(userEntity);
        sentences.setWords(wordEntity);
        sentences.setSentence(sentence);
        sentences.setTranslation(translation);

        sentencesRepository.save(sentences);

        return true;
    }

    // 해당 사용자가 주어진 단어로 생성한 모든 예문을 SentencesResponseDto 리스트 형태로 반환
    public List<SentencesResponseDto> getAllSentencesByWord(String email, String word) {
        // 사용자가 존재하지 않는 경우 예외 처리
        Users userEntity = utils.getUserEntity(email);

        // 단어가 존재하지 않는 경우 예외 처리
        Words wordEntity = utils.getWordsEntity(word);

        // 대안 흐름: 사용자가 생성한 예문이 없는 경우
        if (!sentencesRepository.existsByUsersAndWords(userEntity, wordEntity))
            return new ArrayList<>();

        // 정상 흐름
        return utils.getSentencesList(userEntity, wordEntity);
    }

    // 해당 사용자가 생성한 모든 예문을 SentenceResponseDto 리스트 형태로 반환
    public List<SentencesResponseDto> getAllSentencesByUser(String email) {
        // 사용자가 없는 경우 예외 처리
        Users userEntity = utils.getUserEntity(email);

        // 대안 흐름: 해당 사용자가 생성한 예문이 없는 경우
        if (!sentencesRepository.existsByUsers(userEntity)) { return new ArrayList<>(); }

        // 정상 흐름
        return utils.getSentencesList(userEntity, null);
    }
}