package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.SentencesResponseDto;
import com.example.SMU_WordMaster.entity.Sentences;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.repository.SentencesRepository;
import com.example.SMU_WordMaster.repository.UsersRepository;
import com.example.SMU_WordMaster.repository.WordsRepository;
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
import java.util.Optional;

// 예문 생성 및 관리 전반을 담당하는 서비스 클래스
@Service
@RequiredArgsConstructor
public class SentencesService {

    private final WordsRepository wordsRepository;
    private final SentencesRepository sentencesRepository;
    private final UsersRepository usersRepository;

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    // GPT API 호출을 통해 예문 응답을 문자열 형태로 반환
    public String getGptResponse(String prompt) {
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
            System.out.println("전체 응답: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map messageObj = (Map) choices.get(0).get("message");
                    if (messageObj != null) {
                        return (String) messageObj.get("content");
                    } else {
                        System.out.println("messageObj가 null입니다.");
                    }
                } else {
                    System.out.println("choices가 비어있습니다.");
                }
            } else {
                System.out.println("GPT 응답 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.out.println("GPT 호출 중 예외 발생: " + e.getMessage());
        }

        return "";
    }

    // 특정 사용자, 단어 조합의 예문이 20개를 초과하는 경우 가장 오래된 예문 삭제
    public void deleteOldestSentenceIfOverLimit(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        Words wordEntity = wordsRepository.findByWord(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        if (sentencesRepository.countByUsersAndWords(userEntity, wordEntity) > 20) {
            Sentences sentenceEntity = sentencesRepository.findTopByUsersAndWordsOrderBySentenceId(userEntity, wordEntity).get();
            Long minId = sentenceEntity.getSentenceId();

            sentencesRepository.deleteById(minId);
        }
    }

    // 주어진 사용자와 단어에 해당하는 예문 1개를 예문 엔티티에 저장
    public void saveSentence(String userId, String word, String sentence, String translation) {
        Sentences sentences = new Sentences();

        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        Words wordEntity = wordsRepository.findByWord(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        sentences.setUsers(userEntity);
        sentences.setWords(wordEntity);
        sentences.setSentence(sentence);
        sentences.setTranslation(translation);

        sentencesRepository.save(sentences);
    }

    public List<SentencesResponseDto> getAllSentencesByWord(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));
        Words wordEntity = wordsRepository.findByWord(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        List<Sentences> sentencesList = sentencesRepository.findByUsersAndWords(userEntity, wordEntity);

        List<SentencesResponseDto> result = new ArrayList<>();
        for (Sentences s : sentencesList) {
            String sentence = s.getSentence();
            String translation = s.getTranslation();

            result.add(new SentencesResponseDto(sentence, translation));
        }

        return result;
    }

    // 특정 사용자, 단어 조합에 해당하는 예문 중 가장 최근에 생성된 예문을 SentencesResponseDto 형태로 반환
    public SentencesResponseDto getLatestSentenceByWord(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        Words wordEntity = wordsRepository.findByWord(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        Optional<Sentences> sentenceObj = sentencesRepository.findTopByUsersAndWordsOrderBySentenceIdDesc(userEntity, wordEntity);

        if (sentenceObj.isPresent()) {
            Sentences sentenceEntity = sentenceObj.get();
            return new SentencesResponseDto(sentenceEntity.getSentence(), sentenceEntity.getTranslation());
        }
        else return new SentencesResponseDto("", "");
    }

    // 특정 사용자가 생성한 모든 예문을 SentenceResponseDto 리스트 형태로 반환
    public List<SentencesResponseDto> getAllSentencesByUser(String userId) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        List<Sentences> sentencesList = sentencesRepository.findByUsers(userEntity);

        List<SentencesResponseDto> result = new ArrayList<>();

        for (Sentences s : sentencesList) {
            String sentence = s.getSentence();
            String translation = s.getTranslation();

            result.add(new SentencesResponseDto(sentence, translation));
        }

        return result;
    }
}