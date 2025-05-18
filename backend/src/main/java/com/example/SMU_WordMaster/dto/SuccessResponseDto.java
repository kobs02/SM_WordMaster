package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

// 프론트엔드 요청 성공 응답용 DTO
@Getter
@AllArgsConstructor
@ToString
public class SuccessResponseDto<T> {
    private boolean isSuccess;
    private String message;
    private T data;
}
