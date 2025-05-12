package com.example.SMU_WordMaster.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

// 북마크 응답용 DTO
@Getter
@AllArgsConstructor
public class BookmarksResponseDto {
    private List<String> wordList;
}
