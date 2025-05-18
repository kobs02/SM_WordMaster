package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

// 프론트엔드 요청 실패 응답용 DTO
// @Getter, @AllArgsConstructor: 필드 값을 한 번에 설정해 JSON 응답으로 직렬화하기 위함
@Getter
@AllArgsConstructor
@ToString
public class ErrorResponseDto {
    private boolean isSuccess;
    private String message;
    private String errorCode;
}
