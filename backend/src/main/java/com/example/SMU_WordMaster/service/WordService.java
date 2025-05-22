package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.Word;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.repository.WordsRepository;
import com.example.SMU_WordMaster.repository.dbLoaderWordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WordService {

    private final dbLoaderWordRepository dbLoaderWordRepository;
    private final WordsRepository wordsRepository; // ✅ 추가

    public WordService(dbLoaderWordRepository dbLoaderWordRepository, WordsRepository wordsRepository) {
        this.dbLoaderWordRepository = dbLoaderWordRepository;
        this.wordsRepository = wordsRepository;
    }

    public List<Word> getAllWords() {
        return dbLoaderWordRepository.findAll();
    }

    public void addWord(Word word) {
        dbLoaderWordRepository.save(word);
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
}

