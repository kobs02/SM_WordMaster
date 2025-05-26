package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.BookmarksResponseDto;
import com.example.SMU_WordMaster.dto.ErrorResponseDto;
import com.example.SMU_WordMaster.dto.SuccessResponseDto;
import com.example.SMU_WordMaster.dto.WordsRequestDto;
import com.example.SMU_WordMaster.service.BookmarksService;
import jakarta.transaction.Transactional;
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
    private final ControllerUtils utils;

    // 이미 북마크된 단어면 삭제, 아니면 추가한 뒤 성공 여부 메시지를 프론트엔드로 반환하는 API
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleBookmark(@RequestBody WordsRequestDto wordsDto) {
        try {
            String loginId = wordsDto.getLoginId();
            String spelling = wordsDto.getSpelling();

            boolean isBookmarked = bookmarksService.toggleBookmark(loginId, spelling);
            System.out.println(isBookmarked);

            String message = isBookmarked ? "추가" : "삭제";

            return utils.getSuccessResponse("정상적으로 북마크를 " + message + "했습니다.", isBookmarked);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    // 특정 단어의 북마크 여부 메시지를 프론트엔드로 반환하는 API
    @GetMapping("/isBookmarked")
    public ResponseEntity<?> isBookmarked(@RequestParam String loginId, @RequestParam String spelling) {
        try {
            boolean isBookmarked = bookmarksService.isBookmarked(loginId, spelling);
            System.out.println(isBookmarked);
            return utils.getSuccessResponse("정상적으로 북마크 상태를 불러왔습니다.", isBookmarked);
        } catch (Exception e) { return utils.assertBySystem(e); }
    }

    // 사용자의 모든 북마크된 단어 목록을 프론트엔드로 반환하는 API
    @GetMapping("/getAllByUser")
    public ResponseEntity<?> getAllBookmarks(@RequestParam String loginId) {
        try {
            List<BookmarksResponseDto> bookmarksList = bookmarksService.getAllBookmarksByUser(loginId);
            return utils.getSuccessResponse("북마크된 단어 목록 불러오기 성공", bookmarksList);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    // 특정 단어에 대한 북마크를 제거한 후 남은 북마크 리스트를 프론트엔드로 반환하는 API
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteBookmark(@RequestBody WordsRequestDto wordsDto) {
        try {
            String loginId = wordsDto.getLoginId();
            String spelling = wordsDto.getSpelling();

            List<BookmarksResponseDto> bookmarksList = bookmarksService.deleteBookmarkAndGetAll(loginId, spelling);

            return utils.getSuccessResponse("북마크 삭제 성공", bookmarksList);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }
}
