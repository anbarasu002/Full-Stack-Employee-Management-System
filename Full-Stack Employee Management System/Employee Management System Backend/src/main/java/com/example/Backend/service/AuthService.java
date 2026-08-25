package com.example.Backend.service;

import com.example.Backend.dto.AuthResponse;
import com.example.Backend.dto.LoginRequest;
import com.example.Backend.dto.RegisterRequest;
import com.example.Backend.dto.UserResponse;
import com.example.Backend.exception.DuplicateResourceException;
import com.example.Backend.exception.UnauthorizedException;
import com.example.Backend.model.User;
import com.example.Backend.util.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class AuthService {

    private final List<User> users = new CopyOnWriteArrayList<>();
    private final AtomicInteger idCounter = new AtomicInteger(0);

    private final Map<String, String> activeSessions = new ConcurrentHashMap<>();

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Password and confirm password do not match");
        }

        boolean emailTaken = users.stream()
                .anyMatch(u -> u.getEmail().equalsIgnoreCase(normalizedEmail));
        if (emailTaken) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = new User(
                "USR" + String.format("%03d", idCounter.incrementAndGet()),
                request.getName().trim(),
                normalizedEmail,
                PasswordUtil.hash(request.getPassword())
        );
        users.add(user);

        String token = issueToken(user.getEmail());
        return new AuthResponse(token, UserResponse.fromUser(user));
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail() == null ? "" : request.getEmail().trim().toLowerCase();

        User user = users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(normalizedEmail))
                .findFirst()
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!PasswordUtil.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = issueToken(user.getEmail());
        return new AuthResponse(token, UserResponse.fromUser(user));
    }

    public void logout(String token) {
        if (token != null) {
            activeSessions.remove(token);
        }
    }

    public UserResponse getCurrentUser(String token) {
        String email = validateAndGetEmail(token);
        User user = users.stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(() -> new UnauthorizedException("Session is no longer valid"));
        return UserResponse.fromUser(user);
    }

    public boolean isValidToken(String token) {
        return token != null && activeSessions.containsKey(token);
    }

    private String validateAndGetEmail(String token) {
        String email = token == null ? null : activeSessions.get(token);
        if (email == null) {
            throw new UnauthorizedException("Invalid or expired session. Please log in again.");
        }
        return email;
    }

    private String issueToken(String email) {
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, email);
        return token;
    }
}
