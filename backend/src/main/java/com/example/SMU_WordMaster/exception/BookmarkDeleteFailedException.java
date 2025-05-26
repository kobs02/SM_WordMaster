package com.example.SMU_WordMaster.exception;

public class BookmarkDeleteFailedException extends RuntimeException {
    public BookmarkDeleteFailedException(String word, Throwable cause) {
        super("해당 단어에 대한 북마크 삭제에 실패했습니다: " + word, cause);
    }
}
