// WordRepository클래스를 통해 DB에서 받아온 데이터를 담는 클래스.

package com.example.DBLoader.dto;

public class Word {
    private int wordId;
    private String word;
    private String mean;
    private String level;

    public Word(int wordId, String word, String mean, String level) {
        this.wordId = wordId;
        this.word = word;
        this.mean = mean;
        this.level = level;
    }

    // getters (필요하면 setters도 추가)
    public int getWordId() { return wordId; }
    public String getWord() { return word; }
    public String getMean() { return mean; }
    public String getLevel() { return level; }
}
