package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.CountUnitsResponseDto;
import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.dto.Word;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.repository.WordsRepository;
import com.example.SMU_WordMaster.repository.dbLoaderWordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WordService {

    private final dbLoaderWordRepository dbLoaderWordRepository;
    private final WordsRepository wordsRepository; // ✅ 추가
    private final ServiceUtils utils;

    public List<Word> getAllWords() {
        return dbLoaderWordRepository.findAll();
    }

    public void addWord(List<Word> wordList) {
        for (Word w : wordList) {
            if (!wordsRepository.existsBySpelling(w.getSpelling()))
                dbLoaderWordRepository.save(w);
        }
    }

    // ✅ 단어를 level, unit 기준으로 20개씩 조회
    public List<Word> getWordsDtoByLevelAndUnit(String level, int unit) {
        int offset = (unit - 1) * 20;
        List<Words> wordsEntityList = wordsRepository.findByLevelAndOffset(level, offset);

        // Entity → DTO 변환
        return wordsEntityList.stream().map(entity -> {
            Word dto = new Word();
            dto.setWordId(entity.getWordId());
            dto.setLevel(entity.getLevel().name());
            dto.setSpelling(entity.getSpelling());
            dto.setMean(entity.getMean());
            return dto;
        }).toList();
    }

    public List<CountUnitsResponseDto> countUnits() {
        if (wordsRepository.count() == 0) { return null; }

        int count;
        List<CountUnitsResponseDto> result = new ArrayList<>();

        for (Level l : Level.values()) {
            if ((count = wordsRepository.countByLevel(l)) > 0) {
                count = (int) Math.ceil((double) count / 20);
                result.add(new CountUnitsResponseDto(l, count));
            }
        }

        return result;
    }

    public boolean doesWordExist(String spelling) {
        return wordsRepository.existsBySpelling(spelling);
    }

    @Transactional
    public void updateWord(String spelling, String newSpelling, String newMean) {
        wordsRepository.updateWord(spelling, newSpelling, newMean);
    }

    // 단어 삭제
    public void deleteWord(List<String> wordList) {
        for (String s : wordList) {
            Words wordEntity = utils.getWordsEntity(s);
            wordsRepository.deleteById(wordEntity.getWordId());
        }
    }
}