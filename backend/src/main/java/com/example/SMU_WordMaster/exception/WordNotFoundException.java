package com.example.SMU_WordMaster.exception;

public class WordNotFoundException extends RuntimeException {
    public WordNotFoundException(String word) {
        super("해당 단어가 존재하지 않습니다: " + word);
    }
}
