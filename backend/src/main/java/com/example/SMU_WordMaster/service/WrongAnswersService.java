package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.UpdateWrongAnswersRequestDto;
import com.example.SMU_WordMaster.dto.WrongAnswerResponseDto;
import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.entity.Word;
import com.example.SMU_WordMaster.entity.WrongAnswers;
import com.example.SMU_WordMaster.repository.WordRepository;
import com.example.SMU_WordMaster.repository.WrongAnswersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WrongAnswersService {
    private final ServiceUtils utils;
    private final WrongAnswersRepository wrongAnswersRepository;
    private final WordRepository wordRepository;

    public List<WrongAnswerResponseDto> getWrongAnswers(String loginId) {
        Users userEntity = utils.getUserEntity(loginId);

        List<WrongAnswers> wrongAnswersList = wrongAnswersRepository.findByUsers(userEntity);
        List<WrongAnswerResponseDto> result = new ArrayList<>();

        for (WrongAnswers w : wrongAnswersList) {
            Word wordEntity = w.getWord();
            String spelling = wordEntity.getSpelling();
            String mean = wordEntity.getMean();
            Level level = wordEntity.getLevel();
            int count = w.getCount();

            result.add(new WrongAnswerResponseDto(spelling, mean, level, count));
        }

        return result;
    }

    @Transactional
    public void updateWrongAnswersCountByWord(UpdateWrongAnswersRequestDto dto) {
        String loginId = dto.getLoginId();
        Users userEntity = utils.getUserEntity(loginId);

        List<String> spellingList = dto.getSpellingList();

        for (String s : spellingList) {
            Word wordEntity = utils.getWordsEntity(s);
            if (!wrongAnswersRepository.existsByUsersAndWord(userEntity, wordEntity)) {
                WrongAnswers wrongAnswerEntity = new WrongAnswers();
                wrongAnswerEntity.setUsers(userEntity);
                wrongAnswerEntity.setWord(wordEntity);
                wrongAnswerEntity.setCount(1);
                wrongAnswersRepository.save(wrongAnswerEntity);
            }
            else { wrongAnswersRepository.updateByUsersAndWords(userEntity, wordEntity); }
        }
    }
}
