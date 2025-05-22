// 실행, 테스트용 클래스
// 콘솔에 DB 결과 확인 가능
// ./gradlew bootRun 명령어로 실행가능

package com.example.SMU_WordMaster.runner;
import com.example.SMU_WordMaster.repository.dbLoaderWordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class WordTestRunner implements CommandLineRunner {
    private final dbLoaderWordRepository dbLoaderWordRepository;
    public WordTestRunner(dbLoaderWordRepository dbLoaderWordRepository) {
        this.dbLoaderWordRepository = dbLoaderWordRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        dbLoaderWordRepository.findAll().forEach(word ->
                System.out.println(word.getSpelling() + " - " + word.getMean() + " (" + word.getLevel() + ")")
        );
    }
}
