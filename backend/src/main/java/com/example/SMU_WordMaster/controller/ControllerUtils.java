package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.ErrorResponseDto;
import com.example.SMU_WordMaster.dto.SuccessResponseDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

// Controller에서 반복되는 공통 로직을 모아 재사용성을 높이는 유틸리티 클래스
@Component
public class ControllerUtils {
    public ResponseEntity<ErrorResponseDto> assertBySystem(Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest()
                .contentType(MediaType.valueOf("application/json;charset=UTF-8"))
                .body(new ErrorResponseDto(false, "시스템 내부적으로 에러가 발생했습니다.", e.getMessage()));
    }

    public <T>ResponseEntity<SuccessResponseDto<T>> getSuccessResponse(String message, T data) {
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("application/json;charset=UTF-8"))
                .body(new SuccessResponseDto<T>(true, message, data));
    }
}
