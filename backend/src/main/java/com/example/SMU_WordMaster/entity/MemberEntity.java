package com.example.SMU_WordMaster.entity;

import com.example.SMU_WordMaster.dto.MemberDTO;
import com.example.SMU_WordMaster.role.MemberRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity @Setter @Getter
@Table(name = "users_table",
        uniqueConstraints = @UniqueConstraint(columnNames = "login_id")
) //Mysql에 해당 이름의 테이블 생성
public class MemberEntity { //table 역할
    @Id // Primary Key 설정
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Id는 생성당 순차적으로 부여
    private Long id;
    @Column(unique = true, nullable = false) // 로그인용 아이디
    private String loginId;
    @Column(nullable = false)// 비밀번호
    private String password;
    @Column(nullable = false) // 이름
    private String name;
    @Column // 역할
    private MemberRole role;

    // 객체 하나 만들어서 MemberEntity의 엔티티로 만들어주는 메서드
    public static MemberEntity toMemberEntity(MemberDTO memberDTO){
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setId(memberDTO.getId());
        memberEntity.setLoginId(memberDTO.getLoginId());
        memberEntity.setName(memberDTO.getName());
        memberEntity.setPassword(memberDTO.getPassword());
        memberEntity.setRole(MemberRole.USER);
        return memberEntity;
    }
}