# 🚀 Day 4 – REST APIs & Postman

## 📌 Core Topic Focus

- REST principles
- CRUD operations
- Postman / Thunder Client for API testing

---

## 📖 REST Principles

- **Stateless** → Each request contains all necessary information (no server-side sessions).
- **Client-Server Architecture** → Client handles UI, server handles data.
- **Uniform Interface** → Standardized endpoints (nouns, not verbs).
- **Resource-based** → Everything is treated as a resource (`/tasks`, `/users`).
- **Representations** → Resources can be returned in JSON, XML, etc.

---

## 🔨 CRUD Operations

- **C**reate → `POST /tasks`
- **R**ead → `GET /tasks` or `GET /tasks/:id`
- **U**pdate → `PUT /tasks/:id` (replace) / `PATCH /tasks/:id` (modify part)
- **D**elete → `DELETE /tasks/:id`

---

## 🧪 Example Postman Requests

### 1️⃣ Create a Task (POST `/tasks`)

**Request Body (JSON):**

```json
{
  "title": "Learn REST APIs",
  "description": "Study REST principles and CRUD operations",
  "completed": false
}
```
