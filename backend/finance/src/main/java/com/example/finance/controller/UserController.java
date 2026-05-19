package com.example.finance.controller;

import com.example.finance.common.Result;
import com.example.finance.entity.User;
import com.example.finance.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public Result<User> register(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");
        String email = params.get("email");
        if (username == null || username.trim().isEmpty()) {
            return Result.error(400, "用户名不能为空");
        }
        if (password == null || password.length() < 6) {
            return Result.error(400, "密码长度不能少于6位");
        }
        User user = userService.register(username, password, email);
        user.setPassword(null);
        return Result.success("注册成功", user);
    }

    @PostMapping("/login")
    public Result<User> login(@RequestBody Map<String, String> params) {
        String username = params.get("username");
        String password = params.get("password");
        User user = userService.login(username, password);
        user.setPassword(null);
        return Result.success("登录成功", user);
    }

    @GetMapping("/info")
    public Result<User> getUserInfo(@RequestParam Long userId) {
        User user = userService.getById(userId);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }
        user.setPassword(null);
        return Result.success(user);
    }

    // 新增修改邮箱
    @PutMapping("/info")
    public Result<User> updateEmail(@RequestBody Map<String, Object> params) {
        Long userId = ((Number) params.get("userId")).longValue();
        String email = (String) params.get("email");
        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            return Result.error(400, "邮箱格式不正确");
        }
        try {
            User updated = userService.updateEmail(userId, email);
            updated.setPassword(null);
            return Result.success("邮箱修改成功", updated);
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        }
    }

    // 新增修改密码
    @PutMapping("/password")
    public Result<Void> updatePassword(@RequestBody Map<String, String> params) {
        Long userId;
        try {
            userId = Long.parseLong(params.get("userId"));
        } catch (NumberFormatException e) {
            return Result.error(400, "用户ID无效");
        }
        String oldPassword = params.get("oldPassword");
        String newPassword = params.get("newPassword");
        if (oldPassword == null || newPassword == null) {
            return Result.error(400, "密码不能为空");
        }
        try {
            userService.updatePassword(userId, oldPassword, newPassword);
            return Result.success("密码修改成功", null);
        } catch (IllegalArgumentException e) {
            return Result.error(400, e.getMessage());
        }
    }
}