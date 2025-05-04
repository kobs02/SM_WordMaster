package com.example.SMU_WordMaster.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "user")
@Getter
@Setter
@ToString
public class User {
    @Id
    @Column(name = "id")
    private String userId;;

    @Column(name = "name")
    private String name;
    @Column(name = "password")
    private String password;
    @Column(name = "user_type")
    private boolean userType;
    @Column(name = "experience_point")
    private int exp;
}
