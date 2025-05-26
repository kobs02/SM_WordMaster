package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.RankingsRequestDto;
import com.example.SMU_WordMaster.dto.RankingsResponseDto;
import com.example.SMU_WordMaster.entity.Level;
import com.example.SMU_WordMaster.service.RankingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
public class RankingsController {
    private final ControllerUtils utils;
    private final RankingsService rankingsService;

    @PatchMapping("/update")
    public ResponseEntity<?> updateRanking(@RequestBody RankingsRequestDto rankingDto) {
        try {
            String loginId = rankingDto.getLoginId();
            List<Level> wordLevelList = rankingDto.getWordLevelList();

            rankingsService.updateRanking(loginId, wordLevelList);

            return utils.getSuccessResponse("정상적으로 경험치 및 랭킹레벨을 업데이트했습니다.", null);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    @GetMapping("/get")
    public ResponseEntity<?> getRankingsList() {
        try {
            List<RankingsResponseDto> rankingsList = rankingsService.getRankingsList();
            return utils.getSuccessResponse("정상적으로 랭킹 리스트를 조회했습니다.", rankingsList);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }
}
