package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.Level;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WordsDto {
    private String word;
    private String mean;
    private Level level;

    @Builder
    public class GptDto {
        private String word;
    }
}
