package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// WordRepository클래스를 통해 DB에서 받아온 데이터를 담는 클래스.
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Word {
    private Long wordId;
    private String spelling;
    private String mean;
    private String level;
}
