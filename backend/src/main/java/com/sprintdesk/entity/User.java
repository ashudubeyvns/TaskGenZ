package com.sprintdesk.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false, unique=true, length=80)
    private String username;
    @Column(nullable=false, unique=true, length=180)
    private String email;
    @Column(nullable=false)
    private String passwordHash;
    @Column(nullable=false, length=120)
    private String name;
    private String avatar;
    @Column(nullable=false)
    private boolean active = true;

    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getUsername(){return username;} public void setUsername(String username){this.username=username;}
    public String getEmail(){return email;} public void setEmail(String email){this.email=email;}
    public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String passwordHash){this.passwordHash=passwordHash;}
    public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getAvatar(){return avatar;} public void setAvatar(String avatar){this.avatar=avatar;}
    public boolean isActive(){return active;} public void setActive(boolean active){this.active=active;}
}
