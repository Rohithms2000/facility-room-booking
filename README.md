# Facility Room Booking System

A full-stack web application for managing facility room bookings with role-based dashboards, conflict-free booking logic, calendar scheduling, and room availability rules.

This project is built using:

- **Next.js 14 (App Router)** — Frontend
- **Spring Boot (JWT Authentication)** — Backend
- **MongoDB** — Database

---

## Features

### Authentication & Authorization

- JWT-based login and registration
- Role-based dashboards:
  - **Admin** → Manage rooms, bookings, rules
  - **User** → View rooms, make bookings

---

### Room Booking System

- Calendar view for each room
- Book time slots without conflicts
- View booked slots and blocked rules visually

---

### Admin Features

- CRUD for Rooms
- CRUD for Availability Rules:
  - **Holiday** (full-day closed)
  - **Weekly Closed** (e.g., Sundays)
  - **Time Blocks** (specific unavailable time ranges)
- View & approve/reject user bookings

---

### Frontend (Next js)

- App router and typescript
- Client-side auth with React Context
- Axios for api calls
- FullCalendar for scheduling
- React hook form for form handling
- Tailwind CSS styling
- Resact-Toastify for notifications

### Backend (Spring Boot)

- Spring Security with JWT
- MongoDB repositories
- Booking conflict logic:
  - Time overlap checks
  - Weekly closed days
  - Holiday blocks
  - Custom time blocks
- REST APIs following clean structure

---

## Tech Stack

### Frontend

- Next.js
- React Hook Form
- Axios
- Tailwind CSS
- FullCalendar
- React-Toastify
- Shadcn modals

### Backend

- Spring Boot
- Spring Security (JWT)
- MongoDB
- Lombok
- Gradle

---

### Frontend Setup

**Create .env inside /frontend:**

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Run frontend dev server**

```
npm run dev
```

---

### Backend Setup

**Open backend project**

```
cd backend
```

**Configure application.properties**

```
spring.data.mongodb.uri=mongodb://localhost:27017/db_name
jwt.secret=your_secret_key
```

**Run backend**

```
gradlew bootRun
```

---

### Authentication Flow

- User logs in
- Backend returns token + role
- Token stored in localStorage
- Axios interceptor attaches token for every request
- Spring validates token & sets SecurityContext
- Protected routes allow/deny access

---

## API Endpoints Overview

**Auth**

```
POST /auth/login
POST /auth/register-user
POST /auth/register-admin
```

**User**

```
POST  /user/bookings
GET   /user/bookings
GET   /user/rooms
GET   /user/rooms/{roomId}/bookings
PATCH /user/bookings/cancel/{id}
```

**Admin**

```
POST   /admin/rooms
GET    /admin/rooms
PUT    /admin/rooms/{id}
DELETE /admin/rooms/{id}
PATCH  /admin/bookings/status/{id}
GET    /admin/bookings
GET    /admin/bookingStats
```

**Availability Rules**

```
POST   /availability
GET    /availability/{roomId}
DELETE /availability/{ruleId}
```

**Full API Documentation** → [API_documentation.md](docs/API_documentation.md)
