package com.example.SMU_WordMaster.dto;

import com.example.SMU_WordMaster.entity.Users;
import com.example.SMU_WordMaster.role.MemberRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class UserDto { //회원 정보를 필드로 정의
    private Long id;
    private String loginId;
    // Request 바디에서는 받되, Response 바디에는 노출되지 않습니다.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String name;
    private MemberRole role;

    /** Entity → DTO 변환 (응답용) */
    public static UserDto toMemberDTO(Users users) {
        return new UserDto(
                users.getId(),
                users.getLoginId(),
                null,                             // password는 null 처리
                users.getName(),
                users.getRole()
        );
    }

    /** DTO → Entity 변환 (저장/로그인 요청용) */
    public Users toEntity() {
        Users entity = new Users();
        entity.setLoginId(this.loginId);
        entity.setPassword(this.password);
        entity.setName(this.name);
        entity.setRole(this.role);
        return entity;
    }
}