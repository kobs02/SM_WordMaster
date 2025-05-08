package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.repository.GptRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GptService {

    private final GptRepository gptRepository;

    @Value("${OPENAI_API_KEY}")
    private String apiKey;

    public String getGptResponse(String prompt) {
        // 이 url로 gpt에게 예문 생성 요청\
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> message = Map.of("role", "user", "content", prompt);
        Map<String, Object> body = Map.of(
                "model", "gpt-4.1-2025-04-14",
                "messages", List.of(message),
                "temperature", 1.0 // 완전 창의적인 예문 생성 요청
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
                        String contentJson = (String) messageObj.get("content");
                        ObjectMapper mapper = new ObjectMapper();
                        JsonNode node = mapper.readTree(contentJson);
                        return node.get("sentence").asText();
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

    // Words 엔티티에 예문 추가
    public void createSentence(String word, String sentence) {
        Words words = new Words();
        List<Words> wordsList = gptRepository.findByWord(word);
        String mean = wordsList.get(0).getMean();
        Level level = wordsList.get(0).getLevel();

        words.setWord(word);
        words.setMean(mean);
        words.setLevel(level);
        words.setSentence(sentence);

        gptRepository.save(words);
    }

    // 한 단어에 대하여 예문이 20개가 넘어가면, Words 엔티티에서 가장 오래된 예문 삭제
    public void deleteSentence(String word) {
        if (gptRepository.countByWord(word) > 20) {
            List<Words> wordsList = gptRepository.findByWord(word);
            Long minId = wordsList.get(0).getWordId();

            gptRepository.deleteById(minId);
        }
    }

    // Words 엔티티에서 예문 조회
    public List<String> getSentence(String word) {
        List<Words> wordsList = gptRepository.findByWord(word);
        List<String> sentenceList = wordsList.stream()
                .map(Words::getSentence)
                .collect(Collectors.toList());

        return sentenceList;
    }
}