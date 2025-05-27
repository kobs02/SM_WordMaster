package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.Level;
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
    private String mean;
    private Level level;
}
