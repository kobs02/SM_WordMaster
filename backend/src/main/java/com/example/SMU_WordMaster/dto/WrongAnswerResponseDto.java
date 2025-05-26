package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.Level;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WrongAnswerResponseDto {
    private String spelling;
    private String mean;
    private Level level;
    private int count;
}
