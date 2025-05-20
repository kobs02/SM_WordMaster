package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.SentencesResponseDto;
import com.example.SMU_WordMaster.entity.Sentences;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.exception.EmailNotFoundException;
import com.example.SMU_WordMaster.exception.SentencesNotFoundByWordException;
import com.example.SMU_WordMaster.exception.WordNotFoundException;
import com.example.SMU_WordMaster.repository.SentencesRepository;
import com.example.SMU_WordMaster.repository.UsersRepository;
import com.example.SMU_WordMaster.repository.WordsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

// Service에서 반복되는 공통 로직을 모아 재사용성을 높이는 유틸리티 클래스
@Component
@RequiredArgsConstructor
public class ServiceUtils {
    private final UsersRepository usersRepository;
    private final WordsRepository wordsRepository;
    private final SentencesRepository sentencesRepository;

    public Users getUserEntity(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException(email));
    }

    public Words getWordsEntity(String word) {
        return wordsRepository.findByWord(word)
                .orElseThrow(() -> new WordNotFoundException(word));
    }

    public Sentences getSentencesEntity(Users userEntity, Words wordEntity) {
        return sentencesRepository.findTopByUsersAndWordsOrderBySentenceId(userEntity, wordEntity)
                .orElseThrow(() -> new SentencesNotFoundByWordException(wordEntity.getWord()));
    }

    public List<SentencesResponseDto> getSentencesList(Users userEntity, Words wordEntity) {
        List<SentencesResponseDto> result = new ArrayList<>();
        List<Sentences> sentencesList;

        if (wordEntity == null)
            sentencesList = sentencesRepository.findByUsers(userEntity);
        else
            sentencesList = sentencesRepository.findByUsersAndWords(userEntity, wordEntity);

        for (Sentences s: sentencesList) {
            String word = s.getWords().getWord();
            String sentence = s.getSentence();
            String translation = s.getTranslation();

            result.add(new SentencesResponseDto(word, sentence, translation));
        }

        return result;
    }
}
