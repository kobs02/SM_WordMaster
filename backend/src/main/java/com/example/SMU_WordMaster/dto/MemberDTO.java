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
    private String memberEmail;
    private String memberPassword;
    private String memberName;
    private MemberRole memberRole;

    public static MemberDTO toMemberDTO(MemberEntity memberEntity){
        MemberDTO memberDTO = new MemberDTO();
        memberDTO.setId(memberEntity.getId());
        memberDTO.setMemberEmail(memberEntity.getMemberEmail());
        memberDTO.setMemberName(memberEntity.getMemberName());
        memberDTO.setMemberPassword(memberEntity.getMemberPassword());
        memberDTO.setMemberRole(memberEntity.getMemberRole());
        return memberDTO;
    }
}