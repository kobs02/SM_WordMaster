package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.logging.Level;

// 북마크 응답용 DTO
@Getter
@AllArgsConstructor
public class BookmarksResponseDto {
    private String word;
    private String mean;
    private Level level;
}
