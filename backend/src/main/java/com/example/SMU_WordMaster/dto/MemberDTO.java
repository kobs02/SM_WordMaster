package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.MemberEntity;
import com.example.SMU_WordMaster.role.MemberRole;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString

public class MemberDTO { //회원 정보를 필드로 정의
    private Long id;
    private String loginId;
    private String password;
    private String name;
    private MemberRole role;

    public static MemberDTO toMemberDTO(MemberEntity memberEntity){
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setId(memberEntity.getId());
        memberDTO.setLoginId(memberEntity.getLoginId());
        memberDTO.setName(memberEntity.getName());
        memberDTO.setPassword(memberEntity.getPassword());
        memberDTO.setRole(memberEntity.getRole());
        return memberDTO;
    }
}