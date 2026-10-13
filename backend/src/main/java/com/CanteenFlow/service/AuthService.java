package com.CanteenFlow.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.CanteenFlow.dto.LoginRequest;
import com.CanteenFlow.dto.RegisterRequest;
import com.CanteenFlow.entity.User;
import com.CanteenFlow.repository.UserRepository;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> adminLogin(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        // Default admin credentials check or DB check
        if (("admin@canteenflow.com".equals(email) || "admin".equals(email)) && "admin123".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("role", "ADMIN");
            response.put("name", "Canteen Manager");
            response.put("email", "admin@canteenflow.com");
            response.put("token", "admin-session-token-canteenflow");
            return response;
        }

        // Check if user is in database with role ADMIN
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials"));

        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Access denied: Not an administrator account.");
        }

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("role", "ADMIN");
        response.put("name", user.getFullName());
        response.put("email", user.getEmail());
        response.put("token", "admin-session-token-" + user.getId());
        return response;
    }

    public Map<String, Object> login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String password = request.getPassword().trim();

        // Admin shortcut check
        if (("admin@canteenflow.com".equals(email) || "admin".equals(email)) && "admin123".equals(password)) {
            return adminLogin(request);
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("No user found with email: " + email));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password. Please try again.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("role", user.getRole());
        response.put("name", user.getFullName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("id", user.getId());
        return response;
    }

    public Map<String, Object> register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("An account with this email already exists.");
        }

        User newUser = new User(
                request.getFullName().trim(),
                email,
                request.getPassword().trim(),
                request.getPhone() != null ? request.getPhone().trim() : null,
                "CUSTOMER"
        );

        User savedUser = userRepository.save(newUser);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered successfully.");
        response.put("id", savedUser.getId());
        response.put("name", savedUser.getFullName());
        response.put("email", savedUser.getEmail());
        return response;
    }
}
