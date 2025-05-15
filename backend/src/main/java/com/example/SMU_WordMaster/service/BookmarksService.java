package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.BookmarksResponseDto;
import com.example.SMU_WordMaster.entity.Bookmarks;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Words;
import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.repository.BookmarksRepository;
import com.example.SMU_WordMaster.repository.UsersRepository;
import com.example.SMU_WordMaster.repository.WordsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

        Words wordEntity = wordsRepository.findByWord(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));


        // 북마크가 안되어 있다면 추가, 있으면 삭제
        if (! bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity)) {
            Bookmarks bookmarks = new Bookmarks();

            bookmarks.setUsers(userEntity);
            bookmarks.setWords(wordEntity);

            bookmarksRepository.save(bookmarks);
        }
        else {
            Bookmarks bookmarkEntity = bookmarksRepository.findByUsersAndWords(userEntity, wordEntity).get();
            bookmarksRepository.deleteById(bookmarkEntity.getBookmarkId());

        }

        // 최종 북마크 상태 반환
        return bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity);
    }

    // 단일 단어의 북마크를 삭제한 후, 해당 사용자의 전체 북마크 목록을 반환
    public List<BookmarksResponseDto> deleteBookmarkAndGetAll(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        Words wordEntity = wordsRepository.findByWord(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        // 북마크가 존재한다면 삭제
        Optional<Bookmarks> bookmarkObj = bookmarksRepository.findByUsersAndWords(userEntity, wordEntity);

        if (bookmarkObj.isPresent()) {
            Bookmarks bookmarkEntity = bookmarkObj.get();
            bookmarksRepository.deleteById(bookmarkEntity.getBookmarkId());
        }

        // 북마크된 단어 ID를 기반으로 문자열 리스트 구성
        List<Bookmarks> bookmarksList = bookmarksRepository.findByUsers(userEntity);
        List<BookmarksResponseDto> result = new ArrayList<>();

        for (Bookmarks b: bookmarksList) {
            Words bookmarkedWordEntity = b.getWords();
            String bookmarkedWord = bookmarkedWordEntity.getWord();
            String bookmarkedMean = bookmarkedWordEntity.getMean();
            Level bookmarkedLevel = bookmarkedWordEntity.getLevel();

            result.add(new BookmarksResponseDto(bookmarkedWord, bookmarkedMean, bookmarkedLevel));
        }

        return result;
    }

    // 특정 사용자의 북마크된 모든 단어 목록 조회
    public List<BookmarksResponseDto> getAllBookmarksByUser(String userId) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));

        List<Bookmarks> bookmarkList = bookmarksRepository.findByUsers(userEntity);
        List<BookmarksResponseDto> result = new ArrayList<>();

        for (Bookmarks b: bookmarkList) {
            Words wordEntity = b.getWords();
            String word = wordEntity.getWord();
            String mean = wordEntity.getMean();
            Level level = wordEntity.getLevel();

            result.add(new BookmarksResponseDto(word, mean, level));
        }

        return result;
    }

    // 특정 단어가 해당 사용자에 의해 북마크 되어 있는지 확인
    public boolean isBookmarked(String userId, String word) {
        Users userEntity = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("해당 사용자가 존재하지 않습니다: " + userId));
        Words wordEntity = wordsRepository.findByWord(word)
                .orElseThrow(() -> new RuntimeException("해당 단어가 존재하지 않습니다: " + word));

        return bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity);
    }
}
