package com.example.SMU_WordMaster.exception;

public class RankingFindFailedException extends RuntimeException {
    public RankingFindFailedException(Throwable cause) {
        super("랭킹 조회에 실패했습니다", cause);
    }
}
