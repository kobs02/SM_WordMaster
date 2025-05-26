package com.example.SMU_WordMaster.exception;

public class SentencesFindFailedException extends RuntimeException {
    public SentencesFindFailedException(String email, Throwable cause) {
      super("해당 사용자에 대한 예문 조회에 실패했습니다: " + email, cause);
    }

    public SentencesFindFailedException(String email, String word, Throwable cause) {
      super("해당 사용자가 " + word + "에 대해 생성한 예문 조회에 실패했습니다: " + email, cause);
    }
}
