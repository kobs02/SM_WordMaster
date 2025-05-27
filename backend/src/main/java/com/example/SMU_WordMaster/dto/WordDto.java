package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.Word;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// WordRepository클래스를 통해 DB에서 받아온 데이터를 담는 클래스.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WordDto {
    private Long wordId;
    private String spelling;
    private String mean;
    private String level;

    public WordDto(Word word) {
        this.wordId   = word.getWordId();       // ← 엔티티 PK 매핑
        this.spelling = word.getSpelling();
        this.mean     = word.getMean();
        this.level    = word.getLevel().name();
    }
}
