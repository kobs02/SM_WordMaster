package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.BookmarksResponseDto;
import com.example.SMU_WordMaster.dto.RankingsResponseDto;
import com.example.SMU_WordMaster.dto.SentencesResponseDto;
import com.example.SMU_WordMaster.entity.*;
import com.example.SMU_WordMaster.exception.LoginIdNotFoundException;
import com.example.SMU_WordMaster.exception.SentencesNotFoundByWordException;
import com.example.SMU_WordMaster.exception.WordNotFoundException;
import com.example.SMU_WordMaster.repository.*;
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
    private final WordRepository wordRepository;
    private final SentencesRepository sentencesRepository;
    private final BookmarksRepository bookmarksRepository;
    private final RankingsRepository rankingsRepository;

    public Users getUserEntity(String loginId) {
        return usersRepository.findByLoginId(loginId)
                .orElseThrow(() -> new LoginIdNotFoundException(loginId));
    }

    public Word getWordsEntity(String spelling) {
        return wordRepository.findBySpelling(spelling)
                .orElseThrow(() -> new WordNotFoundException(spelling));
    }

    public Sentences getSentencesEntity(Users userEntity, Word wordEntity) {
        return sentencesRepository.findTopByUsersAndWordOrderBySentenceId(userEntity, wordEntity)
                .orElseThrow(() -> new SentencesNotFoundByWordException(wordEntity.getSpelling()));
    }

    public List<SentencesResponseDto> getSentencesList(Users userEntity, Word wordEntity) {
        List<SentencesResponseDto> result = new ArrayList<>();
        List<Sentences> sentencesList;

        if (wordEntity == null)
            sentencesList = sentencesRepository.findByUsers(userEntity);
        else
            sentencesList = sentencesRepository.findByUsersAndWord(userEntity, wordEntity);

        for (Sentences s: sentencesList) {
            String spelling = s.getWord().getSpelling();
            String sentence = s.getSentence();
            String translation = s.getTranslation();

            result.add(new SentencesResponseDto(spelling, sentence, translation));
        }

        return result;
    }

    public List<BookmarksResponseDto> getBookmarksList (Users userEntity) {
        List<BookmarksResponseDto> result = new ArrayList<>();

        List<Bookmarks> bookmarksList = bookmarksRepository.findByUsers(userEntity);

        for (Bookmarks b: bookmarksList) {
            Word wordEntity = b.getWord();
            String spelling = wordEntity.getSpelling();
            String mean = wordEntity.getMean();
            Level level = wordEntity.getLevel();

            result.add(new BookmarksResponseDto(spelling, mean, level));
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
