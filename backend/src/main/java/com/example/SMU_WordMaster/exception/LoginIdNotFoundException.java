package com.example.SMU_WordMaster.exception;

public class LoginIdNotFoundException extends RuntimeException {
    public LoginIdNotFoundException(String email) { super("해당 이메일이 존재하지 않습니다: " + email); }
}
