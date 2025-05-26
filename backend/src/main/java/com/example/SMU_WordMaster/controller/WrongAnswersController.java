package com.example.SMU_WordMaster.controller;

import com.example.SMU_WordMaster.dto.UpdateWrongAnswersRequestDto;
import com.example.SMU_WordMaster.dto.WrongAnswerResponseDto;
import com.example.SMU_WordMaster.service.WrongAnswersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wrongAnswers")
@RequiredArgsConstructor
public class WrongAnswersController {
    private final ControllerUtils utils;
    private final WrongAnswersService wrongAnswersService;

    @GetMapping()
    public ResponseEntity<?> getWrongAnswers(@RequestParam String loginId) {
        try {
            List<WrongAnswerResponseDto> wrongAnswersList = wrongAnswersService.getWrongAnswers(loginId);
            return utils.getSuccessResponse("정상적으로 오답 리스트를 불러왔습니다.", wrongAnswersList);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }

    @PatchMapping()
    public ResponseEntity<?> updateWrongAnswerCountByWord(@RequestBody UpdateWrongAnswersRequestDto dto) {
        try {
            wrongAnswersService.updateWrongAnswersCountByWord(dto);
            return utils.getSuccessResponse("정상적으로 오답 횟수를 업데이트했습니다.", null);
        }
        catch (Exception e) { return utils.assertBySystem(e); }
    }
}
