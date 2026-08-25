<div align="center">

# 🧑‍💼 Employee Management System

### A Full-Stack HR Solution built with React (Vite) + Spring Boot

**[🚀 Live Demo](https://employee-management-system-eight-gules.vercel.app/)**

</div>

---

## 📌 Overview

**Employee Management System (EMS)** is a modern, full-stack web application designed to simplify how organizations manage their workforce. It combines a fast, responsive **React** frontend with a robust **Spring Boot** REST API backend, offering secure authentication and complete employee lifecycle management — from onboarding to offboarding.

The system is built with clean separation between frontend and backend, RESTful API design, and an in-memory data layer, making it lightweight, easy to run locally, and simple to extend with a persistent database (MySQL, PostgreSQL, MongoDB, etc.) when needed.

Whether you're an HR administrator tracking headcount across departments or a developer looking for a well-structured MERN/Spring Boot-style reference project, this repository provides a solid, production-style foundation.

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Backend](#1-running-the-backend)
  - [Running the Frontend](#2-running-the-frontend)
  - [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
- [Data Model](#-data-model)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## ✨ Features

### 🔐 Authentication & Security
- User **registration** and **login** with token-based session handling
- **Protected routes** on the frontend — unauthenticated users are redirected to login
- **Public-only routes** — logged-in users can't revisit login/register screens
- Persistent sessions using stored auth tokens
- Centralized **401 handling** — expired/invalid sessions automatically redirect to login
- Server-side request validation with descriptive field-level error messages

### 📊 Dashboard & Analytics
- Real-time snapshot of **total, active, and inactive employees**
- **Department-wise breakdown** with visual distribution
- **Recently added employees** feed
- At-a-glance stat cards with icons and color-coded accents

### 👥 Employee Management
- Full **CRUD** operations — Create, Read, Update, Delete
- **Search** employees by name/keyword
- **Filter** by department and employment status
- Dedicated **Add**, **Edit**, and **View** employee screens
- Form validation for name, email format, phone number pattern, salary (positive number), department, position, and joining date
- Confirmation dialogs before destructive actions (e.g., deleting an employee)

### 🎨 User Experience
- Clean, responsive UI that adapts across screen sizes
- Toast notifications for success/error feedback
- Loading states and skeleton loaders for async operations
- Friendly **empty states** and **error states** with retry actions
- Sidebar and topbar navigation with an intuitive layout

### ⚙️ Engineering Quality
- RESTful API design with consistent status codes and JSON payloads
- Centralized global exception handling on the backend (`GlobalExceptionHandler`)
- Custom exceptions for not-found, duplicate, and unauthorized scenarios
- CORS configuration for safe cross-origin frontend↔backend communication
- Clean separation of concerns: controllers, services, DTOs, and models
- ESLint-configured frontend for consistent code style

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Routing** | React Router DOM 6 |
| **HTTP Client** | Axios |
| **Backend Framework** | Spring Boot 3.3 |
| **Language** | Java 17 |
| **Validation** | Jakarta Bean Validation (`spring-boot-starter-validation`) |
| **Web Server** | Embedded Apache Tomcat |
| **Data Storage** | In-memory (easily swappable for MySQL/PostgreSQL/MongoDB) |
| **Build Tools** | Maven (backend), npm (frontend) |
| **Linting** | ESLint |
| **Hosting** | Vercel (frontend) |

---

## 🏗️ Architecture

```
┌─────────────────────┐          HTTPS / REST (JSON)          ┌──────────────────────┐
│                      │  ───────────────────────────────────▶ │                      │
│   React (Vite) SPA   │                                        │   Spring Boot API    │
│  Frontend (Vercel)   │  ◀─────────────────────────────────── │  (Employee & Auth)   │
│                      │           Axios + Bearer Token          │                      │
└─────────────────────┘                                        └──────────┬───────────┘
                                                                            │
                                                                            ▼
                                                                 ┌──────────────────────┐
                                                                 │  In-Memory Data Store │
                                                                 │ (List/Map — swappable │
                                                                 │  for a real database) │
                                                                 └──────────────────────┘
```

- The **frontend** is a single-page application that communicates exclusively through the REST API using Axios, with an interceptor that attaches the auth token and gracefully handles session expiry.
- The **backend** exposes two resource groups — `/api/auth` and `/api/employees` — following REST conventions, and returns structured error responses via a global exception handler.
- The **service layer** on the backend contains all business logic (searching, filtering, dashboard aggregation), keeping controllers thin.

---

## 📁 Project Structure

```
Full-Stack Employee Management System/
│
├── Employee Management System Backend/         # Spring Boot API
│   ├── src/main/java/com/example/Backend/
│   │   ├── BackendApplication.java              # Application entry point
│   │   ├── config/
│   │   │   ├── AuthInterceptor.java              # Request auth interception
│   │   │   └── CorsConfig.java                   # CORS policy
│   │   ├── controller/
│   │   │   ├── AuthController.java               # /api/auth endpoints
│   │   │   └── EmployeeController.java           # /api/employees endpoints
│   │   ├── dto/
│   │   │   ├── AuthResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── UserResponse.java
│   │   ├── exception/
│   │   │   ├── DuplicateResourceException.java
│   │   │   ├── ErrorResponse.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── ResourceNotFoundException.java
│   │   │   └── UnauthorizedException.java
│   │   ├── model/
│   │   │   ├── Employee.java                     # Employee entity
│   │   │   └── User.java                         # User entity
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   └── EmployeeService.java
│   │   └── util/
│   │       └── PasswordUtil.java
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
└── Employee Management System Frontend/         # React (Vite) client
    ├── src/
    │   ├── components/
    │   │   ├── AppLayout.jsx / .css              # Main authenticated layout
    │   │   ├── AuthLayout.jsx / .css              # Login/Register layout
    │   │   ├── Sidebar.jsx / .css                 # Navigation sidebar
    │   │   ├── Topbar.jsx / .css                  # Top navigation bar
    │   │   ├── EmployeeForm.jsx                   # Reusable add/edit form
    │   │   ├── StatCard.jsx                       # Dashboard stat widget
    │   │   ├── StatusBadge.jsx                    # Active/Inactive badge
    │   │   ├── ConfirmDialog.jsx                  # Confirmation modal
    │   │   ├── Toast.jsx                          # Notification toast
    │   │   ├── Loader.jsx / EmptyState.jsx / ErrorState.jsx
    │   │   ├── ProtectedRoute.jsx                 # Auth guard
    │   │   └── PublicOnlyRoute.jsx                # Guest-only guard
    │   ├── context/
    │   │   └── AuthContext.jsx                    # Global auth state
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── EmployeeList.jsx
    │   │   ├── AddEmployee.jsx
    │   │   ├── EditEmployee.jsx
    │   │   ├── ViewEmployee.jsx
    │   │   ├── Login.jsx / Register.jsx
    │   │   ├── About.jsx
    │   │   └── NotFound.jsx
    │   ├── services/
    │   │   ├── api.js                             # Axios instance & interceptors
    │   │   ├── authService.js
    │   │   └── employeeService.js
    │   ├── utils/format.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

| Tool | Minimum Version | Notes |
|------|-----------------|-------|
| [Java JDK](https://adoptium.net/) | 17+ | Required to run the Spring Boot backend |
| [Node.js](https://nodejs.org/) | 18+ | Required to run the React frontend |
| npm | 9+ | Bundled with Node.js |
| Maven | 3.9+ (optional) | The project ships with the `mvnw` wrapper, so a global install isn't required |
| Git | Any recent version | To clone the repository |

### Installation

Clone the repository:

```bash
git clone https://github.com/anbarasu002/Full-Stack-Employee-Management-System.git
cd "Full-Stack-Employee-Management-System/Full-Stack Employee Management System"
```

### 1. Running the Backend

```bash
cd "Employee Management System Backend"

# Using the Maven wrapper (recommended, no local Maven install needed)
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

The API will start on:

```
http://localhost:8080
```

You should see Spring Boot's startup banner in the console, followed by a confirmation that the embedded Tomcat server is running on port `8080`.

### 2. Running the Frontend

Open a new terminal window/tab:

```bash
cd "Employee Management System Frontend"
npm install
npm run dev
```

The frontend will start on:

```
http://localhost:5173
```

Open that URL in your browser. Register a new account, log in, and you'll land on the dashboard.

### 🔧 Environment Configuration

By default, the frontend points to the backend at `http://localhost:8080/api`, configured in:

```js
// src/services/api.js
export const API_BASE_URL = 'http://localhost:8080/api'
```

If you deploy the backend elsewhere (e.g., Render, Railway, an EC2 instance), update `API_BASE_URL` accordingly — or refactor it to read from a Vite environment variable (`import.meta.env.VITE_API_BASE_URL`) for environment-specific builds.

The backend's server port and Jackson date formatting are configured in:

```properties
# src/main/resources/application.properties
spring.application.name=Backend
server.port=8080
spring.jackson.date-format=yyyy-MM-dd
spring.jackson.serialization.write-dates-as-timestamps=false
```

---

## 📡 API Reference

Base URL: `http://localhost:8080/api`

### Authentication — `/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/auth/register` | Register a new user account | ❌ |
| `POST` | `/auth/login` | Authenticate and receive a bearer token | ❌ |
| `POST` | `/auth/logout` | Invalidate the current session | ✅ |
| `GET`  | `/auth/me` | Retrieve the currently authenticated user's profile | ✅ |

### Employees — `/employees`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/employees` | List employees — supports `?query=`, `?department=`, `?status=` query params | ✅ |
| `GET` | `/employees/{id}` | Retrieve a single employee by ID | ✅ |
| `POST` | `/employees` | Create a new employee record | ✅ |
| `PUT` | `/employees/{id}` | Update an existing employee record | ✅ |
| `DELETE` | `/employees/{id}` | Delete an employee record | ✅ |
| `GET` | `/employees/departments` | List all distinct department names | ✅ |
| `GET` | `/employees/dashboard/stats` | Aggregated dashboard statistics | ✅ |

**Example — Create Employee**

```http
POST /api/employees
Content-Type: application/json
Authorization: Bearer <token>

{
  "firstName": "Priya",
  "lastName": "Nair",
  "email": "priya.nair@company.com",
  "phoneNumber": "+1 555-010-2468",
  "department": "Engineering",
  "position": "Frontend Developer",
  "salary": 84000,
  "joiningDate": "2023-09-25",
  "status": "Active"
}
```

**Example — Dashboard Stats Response**

```json
{
  "totalEmployees": 6,
  "activeEmployees": 5,
  "inactiveEmployees": 1,
  "totalDepartments": 4,
  "recentEmployees": [ /* ...array of Employee objects... */ ],
  "employeesByDepartment": {
    "Engineering": 2,
    "Human Resources": 1,
    "Sales": 1,
    "Marketing": 1,
    "Finance": 1
  }
}
```

All error responses follow a consistent shape via `GlobalExceptionHandler`, including a message and, where applicable, field-level validation errors — making it easy for the frontend to surface precise feedback to the user.

---

## 🧬 Data Model

### Employee

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | `String` | Auto-generated |
| `firstName` | `String` | Required |
| `lastName` | `String` | Required |
| `email` | `String` | Required, valid email format |
| `phoneNumber` | `String` | Required, matches `^[+]?[0-9\s-]{7,15}$` |
| `department` | `String` | Required |
| `position` | `String` | Required |
| `salary` | `Double` | Required, must be positive |
| `joiningDate` | `LocalDate` | Required |
| `status` | `String` | Required (`Active` / `Inactive`) |

### User

Handles account credentials for authentication, with passwords processed via `PasswordUtil` before storage.

---

## ☁️ Deployment

- **Frontend:** Deployed on [Vercel](https://vercel.com) → [Live Demo](https://employee-management-system-eight-gules.vercel.app/)
- **Backend:** Can be deployed to any Java-friendly host such as Render, Railway, Fly.io, AWS Elastic Beanstalk, or a Docker container. Build a production JAR with:

```bash
cd "Employee Management System Backend"
./mvnw clean package
java -jar target/Backend.jar
```

- Remember to update the frontend's `API_BASE_URL` (or environment variable) to point to your deployed backend URL, and configure `CorsConfig.java` to allow your deployed frontend origin.

---

## 🗺️ Roadmap

- [ ] Replace in-memory storage with a persistent database (PostgreSQL/MySQL) via Spring Data JPA
- [ ] Add role-based access control (Admin vs. Employee views)
- [ ] Add pagination and sorting to the employee list
- [ ] Add employee profile photo upload
- [ ] Add unit and integration test coverage
- [ ] Add Dockerfile and docker-compose for one-command local setup
- [ ] Add CI/CD pipeline (GitHub Actions) for automated build/test/deploy

---

## 🩺 Troubleshooting

| Issue | Likely Cause | Fix |
|-------|--------------|-----|
| Frontend shows "Unable to connect to the server" | Backend isn't running or is on a different port | Start the Spring Boot backend and confirm it's on port `8080` |
| CORS errors in the browser console | Frontend origin not allowed by backend | Update `CorsConfig.java` to include your frontend's URL |
| `401 Unauthorized` after login | Token not attached or expired | Check `localStorage` for the `orbithr_token` key; log in again |
| `mvnw: Permission denied` (macOS/Linux) | Wrapper script isn't executable | Run `chmod +x mvnw` |
| Port `8080` already in use | Another process is using the port | Change `server.port` in `application.properties` or stop the conflicting process |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure your code follows the existing style conventions (ESLint for the frontend) and includes clear commit messages.

---

## 📄 License

This project is available for learning, portfolio, and personal use. Feel free to fork and build on top of it — attribution is appreciated but not required.

---

## 🙏 Acknowledgements

- [React](https://react.dev/) & [Vite](https://vitejs.dev/) for a fast frontend development experience
- [Spring Boot](https://spring.io/projects/spring-boot) for a productive, convention-driven backend framework
- [Vercel](https://vercel.com/) for effortless frontend hosting

---

<div align="center">

**[⬆ Back to top](#-employee-management-system)**

</div>
