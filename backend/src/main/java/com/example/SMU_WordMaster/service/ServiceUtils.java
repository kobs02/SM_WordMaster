package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.RankingsResponseDto;
import com.example.SMU_WordMaster.dto.SentencesResponseDto;
import com.example.SMU_WordMaster.entity.*;
import com.example.SMU_WordMaster.exception.EmailNotFoundException;
import com.example.SMU_WordMaster.exception.SentencesNotFoundByWordException;
import com.example.SMU_WordMaster.exception.WordNotFoundException;
import com.example.SMU_WordMaster.repository.RankingsRepository;
import com.example.SMU_WordMaster.repository.SentencesRepository;
import com.example.SMU_WordMaster.repository.UsersRepository;
import com.example.SMU_WordMaster.repository.WordsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

// Service에서 반복되는 공통 로직을 모아 재사용성을 높이는 유틸리티 클래스
@Component
@RequiredArgsConstructor
public class ServiceUtils {
    private final UsersRepository usersRepository;
    private final WordsRepository wordsRepository;
    private final SentencesRepository sentencesRepository;
    private final RankingsRepository rankingsRepository;

    public Users getUserEntity(String email) {
        return usersRepository.findById(email)
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

    public List<RankingsResponseDto> getRankingsList(List<RankingsResponseDto> result, List<Rankings> rankingsList) {
        for (Rankings r : rankingsList) {
            String name = r.getUsers().getName();
            RankingLevel rankingLevel = r.getRankingLevel();
            Long exp = r.getExp();

            result.add(new RankingsResponseDto(name, rankingLevel, exp));
        }

        return result;
    }

    public List<RankingsResponseDto> getRankingsList(List<RankingsResponseDto> result, Optional<Rankings> rankingEntity) {
        return rankingEntity.map(r -> getRankingsList(result, List.of(r))).orElse(result);
    }
}
