package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.Level;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RankingsRequestDto {
    String email;
    List<Level> wordLevelList;
}
