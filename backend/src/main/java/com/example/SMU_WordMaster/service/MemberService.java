package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.UserDto;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service //스프링이 관리해주는 객체 == 스프링 빈
@RequiredArgsConstructor //controller와 같이. final 멤버변수 생성자 만드는 역할
public class MemberService {
    private final UsersRepository usersRepository; // 먼저 jpa, mysql dependency 추가
    // 회원 저장 → 저장된 엔티티를 DTO로 반환
    public UserDto save(UserDto userDto) {
        Users entity = Users.toUsers(userDto);
        Users saved = usersRepository.save(entity);
        return UserDto.toMemberDTO(saved);
    }
// 로그인 이메일 중복 검사 기능
    public boolean checkLoginIdDuplicate(String memberEmail) {
        return usersRepository.existsByLoginId(memberEmail);
    }

// 로그인 서비스
    public UserDto login(UserDto userDto){
        Optional<Users> byLoginId = usersRepository.findByLoginId(userDto.getLoginId());
        if(byLoginId.isPresent()){
            // 조회 결과가 있다
            Users users = byLoginId.get(); // Optional 에서 꺼냄
            if(users.getPassword().equals(userDto.getPassword())) {
                //비밀번호 일치
                //entity -> dto 변환 후 리턴
                UserDto dto = UserDto.toMemberDTO(users);
                return dto;
            }
            else {return null;}
        }
        // 조회 결과가 없다
        else {return null;}
    }
    public List<UserDto> findAll() {
        List<Users> usersList = usersRepository.findAll();
        //Controller로 dto로 변환해서 줘야 함
        List<UserDto> userDtoList = new ArrayList<>();
        for (Users users : usersList){
            userDtoList.add(UserDto.toMemberDTO(users));

        }
        return userDtoList;

    }
    // id 검색
    public UserDto findById(Long id) {
        Optional<Users> optionalMemberEntity = usersRepository.findById(id);     // 하나 조회할때 optional로 감싸줌
        if (optionalMemberEntity.isPresent()){   // optional을 벗겨내서 entity -> dto 변환
            return UserDto.toMemberDTO(optionalMemberEntity.get());
        }
        else {return null;}
    }
    // id 검색 후 삭제
    public void deleteByid(Long id) {
        usersRepository.deleteById(id);
    }
}