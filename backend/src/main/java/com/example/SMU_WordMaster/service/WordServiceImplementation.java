package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.entity.Word;
import com.example.SMU_WordMaster.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor //final 멤버변수 생성자 만드는 역할
public class WordServiceImplementation implements WordService {
    private final WordRepository wordRepository;

    @Override
    public Word saveWord(Word word) {
        return wordRepository.save(word);
    }

    @Override
    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }

    @Override
    public Optional<Word> getWordById(Long id) {
        return wordRepository.findById(id);
    }

    @Override
    public Word updateWord(Long id, Word updatedWord) {
        return wordRepository.findById(id).map(existingWord -> {
            existingWord.setSpelling(updatedWord.getSpelling());
            existingWord.setMean(updatedWord.getMean());
            existingWord.setLevel(updatedWord.getLevel());
            return wordRepository.save(existingWord);
        }).orElseThrow(() -> new RuntimeException("단어를 찾을 수 없습니다."));
    }

    @Override
    public void deleteWord(Long id) {
        wordRepository.deleteById(id);
    }
}
