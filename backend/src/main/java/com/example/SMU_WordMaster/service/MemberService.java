package com.example.SMU_WordMaster.service;

import com.example.SMU_WordMaster.dto.UserDto;
import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service //스프링이 관리해주는 객체 == 스프링 빈
@RequiredArgsConstructor //controller와 같이. final 멤버변수 생성자 만드는 역할
public class MemberService {
    private final UsersRepository usersRepository; // 먼저 jpa, mysql dependency 추가
    private final ServiceUtils utils;

    // 회원 저장 → 저장된 엔티티를 DTO로 반환
    public UserDto save(UserDto userDto) {
        Users entity = Users.toUsers(userDto);
        Users saved = usersRepository.save(entity);
        return UserDto.toMemberDTO(saved);
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

    // 사용자 이름, 비밀번호 업데이트
    @Transactional
    public void updateNameOrPassword(String loginId, String name, String password) {
        if (name != null && !name.isEmpty() && password != null && !password.isEmpty())
            usersRepository.updateNameAndPassword(loginId, name, password);
        else if (name != null && !name.isEmpty())
            usersRepository.updateName(loginId, name);
        else if (password != null && !password.isEmpty())
            usersRepository.updatePassword(loginId, password);
    }

    // 마이페이지에서 입력한 현재 비밀번호와 실제 비밀번호의 일치여부 검증
    public boolean checkPassword(String loginId, String password) {
        boolean match = false;
        Users userEntity = utils.getUserEntity(loginId);
        if (password.equals(userEntity.getPassword()))
            match = true;
        return match;
    }

    // 아이디 중복 여부 검사
    public boolean existsLoginId(String loginId) {
        boolean result = true;
        if (!usersRepository.existsByLoginId(loginId))
            result = false;
        return result;
    }

    // 로그인이 안 될 경우, 아이디의 문제인지, 비밀번호의 문제인지 파악
    public boolean[] checkLoginIdAndPassword(String loginId, String password) {
        boolean loginIdExists = usersRepository.existsByLoginId(loginId);
        boolean passwordExists = usersRepository.existsByPassword(password);

        return new boolean[] { loginIdExists, passwordExists };
    }
}