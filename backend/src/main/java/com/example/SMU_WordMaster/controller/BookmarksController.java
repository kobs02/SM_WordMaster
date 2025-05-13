package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.BookmarksResponseDto;
import com.example.SMU_WordMaster.dto.ErrorResponseDto;
import com.example.SMU_WordMaster.dto.SuccessResponseDto;
import com.example.SMU_WordMaster.dto.WordsRequestDto;
import com.example.SMU_WordMaster.service.BookmarksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 북마크 관련 요청을 처리하는 컨트롤러
@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarksController {
    private final BookmarksService bookmarksService;

    // 이미 북마크된 단어면 삭제, 아니면 추가한 뒤 성공 여부 메시지를 프론트엔드로 반환하는 API
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleBookmark(@RequestBody WordsRequestDto wordsDto) {
        try {
            String userId = wordsDto.getUserId();
            String word = wordsDto.getWord();

            boolean isBookmarked = bookmarksService.toggleBookmark(userId, word);

            String data = isBookmarked ? "북마크 추가" : "북마크 삭제";

            return ResponseEntity.ok(new SuccessResponseDto<>(true, "북마크 토글 성공", data));
        }
        catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto(false, "북마크 토글 실패", e.getMessage()));
        }
    }

    // 특정 단어의 북마크 여부 메시지를 프론트엔드로 반환하는 API
    @GetMapping("/isBookmarked")
    public ResponseEntity<?> isBookmarked(@RequestParam String userId, @RequestParam String word) {
        try {
            boolean isBookmarked = bookmarksService.isBookmarked(userId, word);

            String data = isBookmarked ? "북마크 추가되어 있음" : "북마크 제거되어 있음";

            return ResponseEntity.ok(new SuccessResponseDto<>(true, "북마크 상태 불러오기 성공", data));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto(false, "북마크 상태 불러오기 실패", e.getMessage()));
        }
    }

    // 사용자의 모든 북마크된 단어 목록을 프론트엔드로 반환하는 API
    @GetMapping("/getAllByUser")
    public ResponseEntity<?> getAllBookmarks(@RequestParam String userId) {
        try {
            List<BookmarksResponseDto> bookmarksList = bookmarksService.getAllBookmarksByUser(userId);

            return ResponseEntity.ok(new SuccessResponseDto<>(true, "북마크된 단어 목록 불러오기 성공", bookmarksList));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto(false, "북마크된 단어 목록 불러오기 실패", e.getMessage()));
        }
    }

    // 특정 단어에 대한 북마크를 제거한 후 남은 북마크 리스트를 프론트엔드로 반환하는 API
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteBookmark(@RequestBody WordsRequestDto wordsDto) {
        try {
            String userId = wordsDto.getUserId();
            String word = wordsDto.getWord();

            List<BookmarksResponseDto> bookmarksList = bookmarksService.deleteBookmarkAndGetAll(userId, word);

            return ResponseEntity.ok(new SuccessResponseDto<>(true, "북마크 삭제 성공", bookmarksList));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponseDto(false, "북마크 삭제 실패", e.getMessage()));
        }
    }
}
