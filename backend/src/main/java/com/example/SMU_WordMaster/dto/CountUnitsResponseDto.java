package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.Level;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CountUnitsResponseDto {
    private Level level;
    private int count;
}
