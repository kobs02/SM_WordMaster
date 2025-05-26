package com.example.SMU_WordMaster.repository;
import com.example.SMU_WordMaster.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
public interface WordRepository extends JpaRepository<Word, Long> {}