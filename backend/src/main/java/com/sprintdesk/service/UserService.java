package com.sprintdesk.service;

import com.sprintdesk.entity.User;
import com.sprintdesk.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repository;
    public UserService(UserRepository repository){this.repository=repository;}
    public User findByUsername(String username){return repository.findByUsername(username).orElse(null);}
    public User require(Long id){return repository.findById(id).orElseThrow(()->new IllegalArgumentException("User not found: "+id));}
    public User current(String username){return repository.findByUsername(username).orElseThrow(()->new IllegalArgumentException("User not found"));}
}
