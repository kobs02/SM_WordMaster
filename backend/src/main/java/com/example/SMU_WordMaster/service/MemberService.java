package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.MemberDTO;
import com.example.SMU_WordMaster.entity.MemberEntity;
import com.example.SMU_WordMaster.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service //스프링이 관리해주는 객체 == 스프링 빈
@RequiredArgsConstructor //controller와 같이. final 멤버변수 생성자 만드는 역할
public class MemberService {
    private final MemberRepository memberRepository; // 먼저 jpa, mysql dependency 추가
    // 회원 저장 → 저장된 엔티티를 DTO로 반환
    public MemberDTO save(MemberDTO memberDTO) {
        MemberEntity entity = MemberEntity.toMemberEntity(memberDTO);
        MemberEntity saved = memberRepository.save(entity);
        return MemberDTO.toMemberDTO(saved);
    }
// 로그인 이메일 중복 검사 기능
    public boolean checkLoginIdDuplicate(String memberEmail) {
        return memberRepository.existsByLoginId(memberEmail);
    }

// 로그인 서비스
    public MemberDTO login(MemberDTO memberDTO){
        Optional<MemberEntity> byLoginId = memberRepository.findByLoginId(memberDTO.getLoginId());
        if(byLoginId.isPresent()){
            // 조회 결과가 있다
            MemberEntity memberEntity = byLoginId.get(); // Optional에서 꺼냄
            if(memberEntity.getPassword().equals(memberDTO.getPassword())) {
                //비밀번호 일치
                //entity -> dto 변환 후 리턴
                MemberDTO dto = MemberDTO.toMemberDTO(memberEntity);
                return dto;
            }
            else {return null;}
        }
        // 조회 결과가 없다
        else {return null;}
    }
    public List<MemberDTO> findAll() {
        List<MemberEntity> memberEntityList = memberRepository.findAll();
        //Controller로 dto로 변환해서 줘야 함
        List<MemberDTO> memberDTOList = new ArrayList<>();
        for (MemberEntity memberEntity : memberEntityList){
            memberDTOList.add(MemberDTO.toMemberDTO(memberEntity));

        }
        return memberDTOList;

    }
    // id 검색
    public MemberDTO findById(Long id) {
        Optional<MemberEntity> optionalMemberEntity = memberRepository.findById(id);     // 하나 조회할때 optional로 감싸줌
        if (optionalMemberEntity.isPresent()){   // optional을 벗겨내서 entity -> dto 변환
            return MemberDTO.toMemberDTO(optionalMemberEntity.get());
        }
        else {return null;}
    }
    // id 검색 후 삭제
    public void deleteByid(Long id) {
        memberRepository.deleteById(id);
    }
}