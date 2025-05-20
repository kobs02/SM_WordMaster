package com.example.SMU_WordMaster.exception;

public class SentenceSaveFailedException extends RuntimeException {
    public SentenceSaveFailedException(Throwable e) {
        super("예문 저장을 실패했습니다.", e);
    }
}
