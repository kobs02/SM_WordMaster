package com.example.SMU_WordMaster.entity;

import com.example.SMU_WordMaster.dto.UserDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.reflect.Member;
import java.util.ArrayList;
import java.util.List;

// 사용자 엔티티
@Entity
@Table(name = "users_table")
@Getter
@Setter
@ToString
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long userId;

    @Column(name = "login_id")
    private String loginId;

    @Column(name = "password")
    private String password;

    @Column(name = "name")
    private String name;

    @Column(name = "role")
    private MemberRole role;

    // Sentences 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sentences> sentences = new ArrayList<>();

    // Bookmarks 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Bookmarks> bookmarks = new ArrayList<>();

    // WrongAnswers 연관관계 (1:N)
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WrongAnswers> wrongAnswers= new ArrayList<>();

    // 객체 하나 만들어서 MemberEntity의 엔티티로 만들어주는 메서드
    public static Users toUsers(UserDto userDto){
        Users users = new Users();
        users.setLoginId(userDto.getLoginId());
        users.setName(userDto.getName());
        users.setPassword(userDto.getPassword());
        users.setRole(MemberRole.USER);
        return users;
    }
}
