package com.example.Backend.service;

import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.Employee;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    private final List<Employee> employees = new ArrayList<>();
    private final AtomicInteger idCounter = new AtomicInteger(0);

    @PostConstruct
    public void seedData() {
        add(new Employee(null, "John", "Doe", "john.doe@company.com", "+1 555-010-1234",
                "Engineering", "Senior Software Engineer", 98000.0, LocalDate.of(2021, 3, 15), "Active"));
        add(new Employee(null, "Sarah", "Wilson", "sarah.wilson@company.com", "+1 555-010-5678",
                "Human Resources", "HR Manager", 76000.0, LocalDate.of(2020, 7, 1), "Active"));
        add(new Employee(null, "Michael", "Smith", "michael.smith@company.com", "+1 555-010-9012",
                "Sales", "Sales Executive", 62000.0, LocalDate.of(2022, 1, 10), "Active"));
        add(new Employee(null, "Emily", "Johnson", "emily.johnson@company.com", "+1 555-010-3456",
                "Marketing", "Marketing Specialist", 58000.0, LocalDate.of(2019, 11, 20), "Inactive"));
        add(new Employee(null, "David", "Brown", "david.brown@company.com", "+1 555-010-7890",
                "Finance", "Financial Analyst", 71000.0, LocalDate.of(2023, 5, 8), "Active"));
        add(new Employee(null, "Priya", "Nair", "priya.nair@company.com", "+1 555-010-2468",
                "Engineering", "Frontend Developer", 84000.0, LocalDate.of(2023, 9, 25), "Active"));
    }

    private String generateNextId() {
        int next = idCounter.incrementAndGet();
        return String.format("EMP%03d", next);
    }

    public List<Employee> getAll() {
        return new ArrayList<>(employees);
    }

    public Employee getById(String id) {
        return employees.stream()
                .filter(e -> e.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    public Employee add(Employee employee) {
        employee.setId(generateNextId());
        employees.add(employee);
        return employee;
    }

    public Employee update(String id, Employee updated) {
        Employee existing = getById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setDepartment(updated.getDepartment());
        existing.setPosition(updated.getPosition());
        existing.setSalary(updated.getSalary());
        existing.setJoiningDate(updated.getJoiningDate());
        existing.setStatus(updated.getStatus());
        return existing;
    }

    public void delete(String id) {
        Employee existing = getById(id);
        employees.remove(existing);
    }

    public List<Employee> search(String query, String department, String status) {
        return employees.stream()
                .filter(e -> matchesQuery(e, query))
                .filter(e -> department == null || department.isBlank() || "All".equalsIgnoreCase(department)
                        || e.getDepartment().equalsIgnoreCase(department))
                .filter(e -> status == null || status.isBlank() || "All".equalsIgnoreCase(status)
                        || e.getStatus().equalsIgnoreCase(status))
                .collect(Collectors.toList());
    }

    private boolean matchesQuery(Employee e, String query) {
        if (query == null || query.isBlank()) {
            return true;
        }
        String q = query.toLowerCase().trim();
        return e.getId().toLowerCase().contains(q)
                || e.getFirstName().toLowerCase().contains(q)
                || e.getLastName().toLowerCase().contains(q)
                || (e.getFirstName() + " " + e.getLastName()).toLowerCase().contains(q)
                || e.getEmail().toLowerCase().contains(q)
                || e.getDepartment().toLowerCase().contains(q);
    }

    public List<String> getDepartments() {
        return employees.stream()
                .map(Employee::getDepartment)
                .filter(Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        long total = employees.size();
        long active = employees.stream().filter(e -> "Active".equalsIgnoreCase(e.getStatus())).count();
        long inactive = total - active;
        long departments = employees.stream().map(Employee::getDepartment).distinct().count();

        List<Employee> recent = employees.stream()
                .sorted(Comparator.comparing(Employee::getId).reversed())
                .limit(5)
                .collect(Collectors.toList());

        Map<String, Long> byDepartment = employees.stream()
                .collect(Collectors.groupingBy(Employee::getDepartment, LinkedHashMap::new, Collectors.counting()));

        stats.put("totalEmployees", total);
        stats.put("activeEmployees", active);
        stats.put("inactiveEmployees", inactive);
        stats.put("totalDepartments", departments);
        stats.put("recentEmployees", recent);
        stats.put("employeesByDepartment", byDepartment);
        return stats;
    }
}
