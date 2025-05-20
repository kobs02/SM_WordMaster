package com.example.SMU_WordMaster.exception;

public class BookmarkToggleFailedException extends RuntimeException {
    public BookmarkToggleFailedException(String word, Throwable cause) {
      super("해당 단어에 대한 북마크 토글에 실패했습니다: " + word, cause);
    }
}
