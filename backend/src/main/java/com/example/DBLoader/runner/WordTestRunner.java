// 실행, 테스트용 클래스
// 콘솔에 DB 결과 확인 가능
// ./gradlew bootRun 명령어로 실행가능

package com.example.DBLoader.runner;
import com.example.DBLoader.repository.WordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class WordTestRunner implements CommandLineRunner {
    private final WordRepository wordRepository;
    public WordTestRunner(WordRepository wordRepository) {
        this.wordRepository = wordRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        wordRepository.findAll().forEach(word ->
                System.out.println(word.getWord() + " - " + word.getMean() + " (" + word.getLevel() + ")")
        );
    }
}
