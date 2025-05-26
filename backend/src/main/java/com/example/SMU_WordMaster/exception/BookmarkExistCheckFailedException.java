package com.example.SMU_WordMaster.exception;

public class BookmarkExistCheckFailedException extends RuntimeException {
    public BookmarkExistCheckFailedException(String email, String word, Throwable cause) {
      super("해당 사용자에 대한 " + word + "가 북마크되어 있는지 조회하는 데 실패했습니다: " + email, cause);
    }
}
