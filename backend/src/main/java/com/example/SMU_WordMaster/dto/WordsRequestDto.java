package com.example.SMU_WordMaster.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WordsRequestDto {
    private String loginId;
    private String spelling;
}
