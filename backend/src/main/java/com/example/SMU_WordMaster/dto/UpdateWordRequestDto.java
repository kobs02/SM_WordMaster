package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateWordRequestDto {
    private String spelling;
    private String newSpelling;
    private String newMean;
}
