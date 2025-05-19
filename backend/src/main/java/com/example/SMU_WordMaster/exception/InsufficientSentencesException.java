package com.example.SMU_WordMaster.exception;

public class InsufficientSentencesException extends RuntimeException {
    public InsufficientSentencesException(String word, int limit) { super("해당 단어에 대한 예문이 " + limit + "개 미만입니다: " + word); }
}
