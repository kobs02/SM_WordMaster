package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.RankingLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RankingsResponseDto {
    private String name;
    private RankingLevel rankingLevel;
    private Long exp;

}
