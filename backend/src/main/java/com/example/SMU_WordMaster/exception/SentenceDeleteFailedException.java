package com.example.SMU_WordMaster.exception;

public class SentenceDeleteFailedException extends RuntimeException {
    public SentenceDeleteFailedException(Throwable cause) {
        super("예문 삭제를 실패했습니다.", cause);
    }
}
