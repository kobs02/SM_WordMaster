package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import com.example.SMU_WordMaster.entity.Level;

// 북마크 응답용 DTO
@Getter
@AllArgsConstructor
public class BookmarksResponseDto {
    private String spelling;
    private String mean;
    private Level level;
}
