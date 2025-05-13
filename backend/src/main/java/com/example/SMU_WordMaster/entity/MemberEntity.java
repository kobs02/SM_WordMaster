package com.example.SMU_WordMaster.entity;

import com.example.SMU_WordMaster.dto.MemberDTO;
import com.example.SMU_WordMaster.role.MemberRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity @Setter @Getter
@Table(name = "member_table") //Mysql에 해당 이름의 테이블 생성
public class MemberEntity { //table 역할
    @Id // Primary Key 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Id는 생성당 순차적으로 부여
    private Long id;
    @Column(unique = true) // 이메일(중복X)
    private String memberEmail;
    @Column // 비밀번호
    private String memberPassword;
    @Column // 이름
    private String memberName;
    @Column // 역할
    private MemberRole memberRole;

    // 객체 하나 만들어서 MemberEntity의 엔티티로 만들어주는 메서드
    public static MemberEntity toMemberEntity(MemberDTO memberDTO){
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setId(memberDTO.getId());
        memberEntity.setMemberEmail(memberDTO.getMemberEmail());
        memberEntity.setMemberName(memberDTO.getMemberName());
        memberEntity.setMemberPassword(memberDTO.getMemberPassword());
        memberEntity.setMemberRole(MemberRole.USER);
        return memberEntity;
    }
}