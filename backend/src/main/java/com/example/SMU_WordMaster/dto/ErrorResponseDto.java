package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;

// 오류 메시지 응답용 DTO
// @AllArgsConstructor: 필드 값을 한 번에 설정해 JSON 응답으로 직렬화하기 위함
@AllArgsConstructor
public class ErrorResponseDto {
    private String error;
    private String message;
}
