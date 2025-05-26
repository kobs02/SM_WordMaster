package com.example.SMU_WordMaster.exception;

public class BookmarkedWordFindFailedException extends RuntimeException {
    public BookmarkedWordFindFailedException(String email, Throwable cause) {
      super("해당 사용자에 대한 북마크된 단어 조회에 실패했습니다: " + email, cause);
    }
}
