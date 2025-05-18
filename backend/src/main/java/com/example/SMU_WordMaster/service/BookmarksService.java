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

import java.util.List;

// 북마크 관련 내부 로직을 처리하는 서비스 클래스
@Service
@RequiredArgsConstructor
public class BookmarksService {
    private final UsersRepository usersRepository;
    private final WordsRepository wordsRepository;
    private final BookmarksRepository bookmarksRepository;

    private final ServiceUtils utils;

    // 특정 사용자와 단어 조합에 대해 북마크를 토글( 추가 or 삭제 )
    public boolean toggleBookmark(String email, String word) {
        Users userEntity = utils.getUserEntity(email);
        Words wordEntity = utils.getWordsEntity(word);

        boolean isBookmarked;

        // 북마크가 안되어 있다면 추가, 있으면 삭제
        if (!bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity)) {
            Bookmarks bookmarks = new Bookmarks();

            bookmarks.setUsers(userEntity);
            bookmarks.setWords(wordEntity);

            bookmarksRepository.save(bookmarks);
            isBookmarked = true;
        }
        else {
            bookmarksRepository.deleteByUsersAndWords(userEntity, wordEntity);
            isBookmarked = false;
        }

        // 최종 북마크 상태 반환
        return isBookmarked;
    }

    // 해당 단어의 북마크를 삭제한 후, 해당 사용자의 전체 북마크 목록을 반환
    public List<BookmarksResponseDto> deleteBookmarkAndGetAll(String email, String word) {
        Users userEntity = utils.getUserEntity(email);
        Words wordEntity = utils.getWordsEntity(word);

        // 북마크가 존재한다면 삭제
        bookmarksRepository.deleteByUsersAndWords(userEntity, wordEntity);

        // 북마크된 단어 리스트 반환
        return utils.getBookmarksList(userEntity);
    }

    // 특정 사용자의 북마크된 모든 단어 목록 조회
    public List<BookmarksResponseDto> getAllBookmarksByUser(String email) {
        Users userEntity = utils.getUserEntity(email);
        return utils.getBookmarksList(userEntity);
    }

    // 특정 단어가 해당 사용자에 의해 북마크 되어 있는지 확인
    public boolean isBookmarked(String email, String word) {
        Users userEntity = utils.getUserEntity(email);
        Words wordEntity = utils.getWordsEntity(word);

        return bookmarksRepository.existsByUsersAndWords(userEntity, wordEntity);
    }
}
