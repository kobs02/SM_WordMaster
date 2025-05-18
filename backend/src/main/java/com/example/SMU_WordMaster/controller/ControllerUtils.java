package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.ErrorResponseDto;
import org.springframework.http.ResponseEntity;

public class ControllerUtils {
    public ResponseEntity<ErrorResponseDto> assertBySystem(Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body(new ErrorResponseDto(false, "시스템 내부적으로 에러가 발생했습니다.", e.getMessage()));
    }
}
