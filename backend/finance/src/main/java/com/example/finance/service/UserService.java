package com.example.finance.service;

import com.example.finance.entity.User;

public interface UserService {
    User register(String username, String password, String email);
    User login(String username, String password);
    User getById(Long id);
    User updateEmail(Long userId, String email);
    void updatePassword(Long userId, String oldPassword, String newPassword);
}