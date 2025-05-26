package com.example.SMU_WordMaster.exception;

public class ExpUpdateFailedException extends RuntimeException{
    public ExpUpdateFailedException(String email, Throwable cause) {
        super("해당 사용자의 경험치 업데이트를 실패했습니다: " + email, cause);
    }
}
