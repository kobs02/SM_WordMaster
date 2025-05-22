package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.BookmarksResponseDto;
import com.example.SMU_WordMaster.dto.ErrorResponseDto;
import com.example.SMU_WordMaster.dto.WordsRequestDto;
import com.example.SMU_WordMaster.service.BookmarksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// 북마크 관련 요청을 처리하는 컨트롤러
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarksController {
    private final BookmarksService bookmarksService;

    // 북마크 토글 요청( 추가 or 삭제 ): 이미 북마크된 단어면 삭제, 아니면 추가
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleBookmark(@RequestBody WordsRequestDto wordsDto) {
        try {
            String userId = wordsDto.getUserId();
            String word = wordsDto.getWord();

            boolean isBookmarked = bookmarksService.toggleBookmark(userId, word);

            String message = isBookmarked ? "북마크 추가" : "북마크 삭제";

            return ResponseEntity.ok(Map.of("message", message));
        }
        catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("북마크 토글 실패", e.getMessage()));
        }
    }

    // 특정 단어가 북마크되어 있는지 확인하는 요청
    @GetMapping("/getByWord")
    public ResponseEntity<?> getBookmarkByWord(@RequestParam String userId, @RequestParam String word) {
        try {
            boolean isBookmarked = bookmarksService.getBookmarkByWord(userId, word);

            String message = isBookmarked ? "북마크 추가되어 있음" : "북마크 제거되어 있음";

            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("북마크 상태 불러오기 실패", e.getMessage()));
        }
    }

    // 사용자의 모든 북마크된 단어 목록을 조회하는 요청
    @GetMapping("/getByList")
    public ResponseEntity<?> getBookmarkByList(@RequestParam String userId) {
        try {
            BookmarksResponseDto bookmarksDto = bookmarksService.getBookmarkByList(userId);

            return ResponseEntity.ok(bookmarksDto);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("북마크된 모든 단어 불러오기 실패", e.getMessage()));
        }
    }

    // 특정 단어에 대한 북마크 삭제 요청 -> 삭제 후 남은 북마크 리스트 반환
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteBookmark(@RequestBody WordsRequestDto wordsDto) {
        try {
            String userId = wordsDto.getUserId();
            String word = wordsDto.getWord();

            BookmarksResponseDto bookmarksDto = bookmarksService.deleteBookmarkByList(userId, word);

            return ResponseEntity.ok(bookmarksDto);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto("북마크 삭제 실패", e.getMessage()));
        }
    }
}
