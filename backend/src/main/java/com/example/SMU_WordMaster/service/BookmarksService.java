package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.BookmarksResponseDto;
import com.example.SMU_WordMaster.entity.Bookmarks;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.repository.BookmarksRepository;
import com.example.SMU_WordMaster.repository.UsersRepository;
import com.example.SMU_WordMaster.repository.WordsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

// 북마크 관련 내부 로직을 처리하는 서비스 클래스
@Service
@RequiredArgsConstructor
public class BookmarksService {
    private final UsersRepository usersRepository;
    private final WordsRepository wordsRepository;
    private final BookmarksRepository bookmarksRepository;

    // 특정 사용자와 단어 조합에 대해 북마크를 토글( 추가 or 삭제 )
    public boolean toggleBookmark(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        Words wordEntity = wordsRepository.findBySpelling(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));


        // 북마크가 안되어 있다면 추가, 있으면 삭제
        if (! bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity)) {
            Bookmarks bookmarks = new Bookmarks();

            bookmarks.setUsers(userEntity);
            bookmarks.setWords(wordEntity);

            bookmarksRepository.save(bookmarks);
        }
        else {
            Long bookmarkId = bookmarksRepository.findBookmarkIdByUsersAndWords(userEntity, wordEntity);
            bookmarksRepository.deleteById(bookmarkId);
        }

        // 최종 북마크 상태 반환
        return bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity);
    }

    // 단일 단어의 북마크를 삭제한 후, 해당 사용자의 전체 북마크 목록을 반환
    public BookmarksResponseDto deleteBookmarkByList(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        Words wordEntity = wordsRepository.findBySpelling(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        // 북마크가 존재한다면 삭제
        Long bookmarkId = bookmarksRepository.findBookmarkIdByUsersAndWords(userEntity, wordEntity);
        if (bookmarkId != null)
            bookmarksRepository.deleteById(bookmarkId);

        // 북마크된 단어 ID를 기반으로 문자열 리스트 구성
        List<Long> wordIdList = bookmarksRepository.findWordIdByUsers(userEntity);
        List<String> result = new ArrayList<>();

        for (Long id: wordIdList) {
            String bookmarkedWord = wordsRepository.findSpellingByWordId(id);
            result.add(bookmarkedWord);
        }

        return new BookmarksResponseDto(result);
    }

    // 특정 사용자의 북마크된 모든 단어 목록 조회
    public BookmarksResponseDto getBookmarkByList(String userId) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        List<Long> wordIdList = bookmarksRepository.findWordIdByUsers(userEntity);
        List<String> result = new ArrayList<>();

        for (Long id: wordIdList) {
            String bookmarkedWord = wordsRepository.findSpellingByWordId(id);
            result.add(bookmarkedWord);
        }

        return new BookmarksResponseDto(result);
    }

    // 특정 단어가 해당 사용자에 의해 북마크 되어 있는지 확인
    public boolean getBookmarkByWord(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));
        Words wordEntity = wordsRepository.findBySpelling(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        return bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity);
    }
}
