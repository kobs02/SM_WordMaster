package com.example.SMU_WordMaster.service;
import com.example.SMU_WordMaster.entity.Word;

import java.util.List;
import java.util.Optional;

public interface WordService {
    Word saveWord(Word word);
    List<Word> getAllWords();
    Optional<Word> getWordById(Long id);
    Word updateWord(Long id, Word updatedWord);
    void deleteWord(Long id);
}