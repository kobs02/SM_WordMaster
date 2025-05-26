package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.RankingsResponseDto;
import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.entity.RankingLevel;
import com.example.SMU_WordMaster.entity.Rankings;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.exception.ExpUpdateFailedException;
import com.example.SMU_WordMaster.exception.RankingEntitySaveFailedException;
import com.example.SMU_WordMaster.exception.RankingFindFailedException;
import com.example.SMU_WordMaster.repository.RankingsRepository;
import com.example.SMU_WordMaster.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class RankingsService {
    private final RankingsRepository rankingsRepository;
    private final UsersRepository usersRepository;
    private final ServiceUtils utils;

    // 경험치 및 랭킹레벨 업데이트하는 서비스 메서드
    public void updateRanking(String loginId, List<Level> wordLevelList) {
        Users userEntity = utils.getUserEntity(loginId);

        try {
            if (!rankingsRepository.existsByUsers(userEntity)) {
                Rankings rankingEntity = new Rankings();
                rankingEntity.setUsers(userEntity);
                rankingEntity.setRankingLevel(RankingLevel.Bronze);
                rankingEntity.setExp(0L);
                rankingsRepository.save(rankingEntity);
            }

            // 사용자의 경험치 조회
            Optional<Rankings> rankingEntity = rankingsRepository.findByUsers(userEntity);
            Long exp = rankingEntity.get().getExp();

            // 사용자의 경험치 업데이트
            for (Level l : wordLevelList) {
                if (l == Level.A1) { exp += 1L; }
                else if (l == Level.A2) { exp += 2L; }
                else if (l == Level.B1) { exp += 3L; }
                else if (l == Level.B2) { exp += 4L; }
                else if (l == Level.C1) { exp += 5L; }
                else if (l == Level.C2) { exp += 6L; }
            }

            // 업데이트된 경험치를 기반으로 랭킹레벨 업데이트
            RankingLevel rankingLevel;
            if (exp >= 1000L) { rankingLevel = RankingLevel.Ruby; }
            else if (exp >= 900L) { rankingLevel = RankingLevel.Diamond; }
            else if (exp >= 800L) { rankingLevel = RankingLevel.Platinum; }
            else if (exp >= 700L) { rankingLevel = RankingLevel.Gold; }
            else if (exp >= 600L) { rankingLevel = RankingLevel.Silver; }
            else { rankingLevel = RankingLevel.Bronze; }

            // 리포지토리를 통해 업데이트된 경험치와 랭킹레벨을 랭킹 테이블에 반영
            rankingsRepository.updateExpWithRankingLevelByUsersAndRankingLevel(userEntity, exp, rankingLevel);
        }
        catch (Exception e) { throw new ExpUpdateFailedException(loginId, e); }
    }

    // 본인 랭킹 + 전체 랭킹 조회하는 서비스 메서드
    public List<RankingsResponseDto> getRankingsList() {
        List<RankingsResponseDto> result = new ArrayList<>();

        try {
            if (usersRepository.countUsers() > rankingsRepository.count()) {
                List<Users> usersList = usersRepository.findAll();
                for (Users u : usersList) {
                    if (!rankingsRepository.existsByUsers(u)) {
                        Rankings rankingEntity = new Rankings();
                        rankingEntity.setUsers(u);
                        rankingEntity.setRankingLevel(RankingLevel.Bronze);
                        rankingEntity.setExp(0L);
                        rankingsRepository.save(rankingEntity);
                    }
                }
            }

            // 모든 사용자 랭킹 조회
            List<Rankings> rankingsList = rankingsRepository.findAllOrderByExpDesc();
            result = utils.getRankingsList(result, rankingsList);

            return result;
        }
        catch (Exception e) { throw new RankingFindFailedException(e); }
    }
}
