package com.example.DBLoader.service;
import com.example.DBLoader.dto.Word;
import com.example.DBLoader.repository.WordRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WordService {
    private final WordRepository wordRepository;

    public WordService(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }

    public void addWord(Word word) {
        wordRepository.save(word);
    }
}
