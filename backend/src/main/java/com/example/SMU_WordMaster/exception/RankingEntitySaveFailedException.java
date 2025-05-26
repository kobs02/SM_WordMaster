package com.example.SMU_WordMaster.exception;

public class RankingEntitySaveFailedException extends RuntimeException {
    public RankingEntitySaveFailedException(String email, Throwable cause) {
      super("해당 사용자에 대한 랭킹 엔티티 생성을 실패했습니다: " + email, cause);
    }
}
