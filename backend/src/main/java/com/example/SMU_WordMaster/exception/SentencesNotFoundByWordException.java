package com.example.SMU_WordMaster.exception;

public class SentencesNotFoundByWordException extends RuntimeException {
    public SentencesNotFoundByWordException(String word) {
        super("해당 단어에 대한 예문이 존재하지 않습니다: " + word);
    }
}
