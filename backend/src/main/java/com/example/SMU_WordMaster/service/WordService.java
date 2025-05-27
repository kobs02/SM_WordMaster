package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.CountUnitsResponseDto;
import com.example.SMU_WordMaster.dto.UpdateWordRequestDto;
import com.example.SMU_WordMaster.dto.WordDto;
import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.entity.Word;
import com.example.SMU_WordMaster.repository.WordRepository;
import com.example.SMU_WordMaster.repository.dbLoaderWordRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WordService {

    private final dbLoaderWordRepository dbLoaderWordRepository;
    private final WordRepository wordRepository;
    private final ServiceUtils utils;

    // ✅ 전체 단어 목록 반환 (DTO 리스트)
    public List<WordDto> getAllWords() {
        return dbLoaderWordRepository.findAll(); // DTO 반환
    }

    // ✅ 단어 저장 (중복 방지 포함)
    public List<WordDto> addWord(List<WordDto> wordList) {
        List<WordDto> savedWords = new ArrayList<>();
        for (WordDto dto : wordList) {
            if (!wordRepository.existsBySpelling(dto.getSpelling())) {
                Word saved = wordRepository.save(toEntity(dto));
                savedWords.add(toDto(saved));
            }
        }
        return savedWords;
    }



    // ✅ 단어 저장 (엔티티 기반 - 단건 저장)
    public Word saveWord(Word word) {
        return wordRepository.save(word);
    }

    // ✅ 단어 ID로 단건 조회 (DTO로 변환하여 반환)
    public Optional<WordDto> getWordById(Long id) {
        return wordRepository.findById(id)
                .map(entity -> {
                    WordDto dto = new WordDto();
                    dto.setLevel(entity.getLevel().name());
                    dto.setSpelling(entity.getSpelling());
                    dto.setMean(entity.getMean());
                    return dto;
                });
    }

    // ✅ 단어를 level, unit 기준으로 20개씩 조회
    public List<WordDto> getWordsDtoByLevelAndUnit(String level, int unit) {
        int offset = (unit - 1) * 20;
        List<Word> wordEntityList = wordRepository.findByLevelPaged(level, offset);

        return wordEntityList.stream().map(entity -> {
            WordDto dto = new WordDto();
            dto.setLevel(entity.getLevel().name());
            dto.setSpelling(entity.getSpelling());
            dto.setMean(entity.getMean());
            return dto;
        }).toList();
    }

    public List<CountUnitsResponseDto> countUnits() {
        // wordRepository.count()가 0일 때는 빈 리스트를 돌려주는 편이 좋습니다.
        if (wordRepository.count() == 0)
            return Collections.emptyList();

        List<CountUnitsResponseDto> result = new ArrayList<>();
        for (Level level : Level.values()) {
            int totalWords = wordRepository.countByLevel(level);
            if (totalWords > 0) {
                // 단어 20개당 1유닛으로 계산
                int units = (int) Math.ceil((double) totalWords / 20);
                result.add(new CountUnitsResponseDto(level, units));
            }
        }
        return result;
    }

    // ✅ 단어 존재 여부 확인
    public boolean doesWordExist(String spelling) {
        return wordRepository.existsBySpelling(spelling);
    }

    // ✅ 단어 수정 (DTO 기반)
    @Transactional
    public Word updateWord(Long id, UpdateWordRequestDto dto) {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("단어를 찾을 수 없습니다."));

        word.setSpelling(dto.getSpelling());
        word.setMean(dto.getMean());
        word.setLevel(dto.getLevel());

        return word;
    }

    // ✅ 단어 삭제 (id 기반)
    public void deleteWord(Long id) {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("단어를 찾을 수 없습니다."));
        wordRepository.delete(word);
    }

    // ✅ 단어 삭제 (spelling 리스트 기반 - 기존 방식 유지)
    public void deleteWord(List<String> wordList) {
        for (String s : wordList) {
            Word wordEntity = utils.getWordsEntity(s);
            wordRepository.deleteById(wordEntity.getWordId());
        }
    }@Transactional
    public void deleteWords(List<String> spellings) {
        // 예: JPA Repository 에 deleteBySpellingIn(List<String>) 같은 커스텀 메서드 구현
        wordRepository.deleteBySpellingIn(spellings);
    }
    // Entity → DTO
    private WordDto toDto(Word entity) {
        return new WordDto(
                entity.getWordId(),
                entity.getSpelling(),
                entity.getMean(),
                entity.getLevel().name()
        );
    }

    // DTO → Entity
    private Word toEntity(WordDto dto) {
        Word word = new Word();
        word.setWordId(dto.getWordId());
        word.setSpelling(dto.getSpelling());
        word.setMean(dto.getMean());
        word.setLevel(Level.valueOf(dto.getLevel()));
        return word;
    }

}
