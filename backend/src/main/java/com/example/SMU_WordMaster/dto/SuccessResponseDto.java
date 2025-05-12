package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

// 프론트엔드 요청 성공 응답용 DTO
@Getter
@AllArgsConstructor
public class SuccessResponseDto<T> {
    private boolean success;
    private String message;
    private T data;
}
