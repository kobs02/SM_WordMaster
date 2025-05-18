package com.example.SMU_WordMaster.dto;

import lombok.*;

// 예문 생성 및 조회 요청용 DTO
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WordsRequestDto {
    private String email;
    private String word;
}
