package com.example.SMU_WordMaster.dto;

import lombok.*;

// 예문 응답용 DTO
// @Setter, @NoArgsConstructor: gpt가 생성한 예문을 dto에 저장하기 위해 JSON 역직렬화
// @Getter, @AllArgsConstructor: 프론트로 예문 + 뜻을 보내기 위해 JSON 직렬화
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SentencesResponseDto {
    private String word;
    private String sentence;
    private String translation;
}
