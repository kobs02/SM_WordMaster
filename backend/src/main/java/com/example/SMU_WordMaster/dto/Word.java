// WordRepository클래스를 통해 DB에서 받아온 데이터를 담는 클래스.

package com.example.SMU_WordMaster.dto;

public class Word {
    private int wordId;
    private String spelling;
    private String mean;
    private String level;

    public Word() {}
    public Word(int wordId, String spelling, String mean, String level) {
        this.wordId = wordId;
        this.spelling = spelling;
        this.mean = mean;
        this.level = level;
    }

    // getters
    public int getWordId() { return wordId; }
    public String getSpelling() { return spelling; }
    public String getMean() { return mean; }
    public String getLevel() { return level; }

    // setters
    public void setWordId(int wordId) { this.wordId = wordId; }
    public void setSpelling(String spelling) { this.spelling = spelling; }
    public void setMean(String mean) { this.mean = mean; }
    public void setLevel(String level) { this.level = level; }
}
