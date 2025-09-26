# 📝 Blog API – Microservices Version

This project is a simple **Blog API** split into **two microservices**:

- **user-service** → Handles authentication & user management
- **post-service** → Handles blog posts (CRUD), with token verification via user-service

An optional **API Gateway** can be added later to combine both services under a single entry point.

---

## 📂 Project Structure

````bash
blog-microservices/
│── userServices/
│ ├── index.js
│ ├── models/
│ │ └── userSchema.js
│ ├── routes/
│ │ └── userRoutes.js
│ ├── package-lock.json
│ └── package.json
│
│── blogServices/
│ ├── index.js
│ ├── models/
│ │ └── blogSchema.js
│ ├── routes/
│ │ └── blogRoutes.js
│ ├── package-lock.json
│ └── package.json
│
└── README.md

---

## 🚀 Services

### 1. **User Service** (Port: `5001`)

#### Routes

| Method | Endpoint    | Description                     |
| ------ | ----------- | ------------------------------- |
| POST   | `/register` | Register a new user             |
| POST   | `/login`    | Login user & return JWT         |
| GET    | `/verify`   | Verify JWT (used by other svcs) |
| GET    | `/health`   | Health check for monitoring     |
| \*     | `/*`        | Catch-all → `404 Not Found`     |

---

### 2. **Post Service** (Port: `5002`)

#### Routes

| Method | Endpoint  | Description                      |
| ------ | --------- | -------------------------------- |
| POST   | `/posts`  | Create a new post (JWT required) |
| GET    | `/posts`  | Fetch all posts                  |
| GET    | `/health` | Health check for monitoring      |
| \*     | `/*`      | Catch-all → `404 Not Found`      |

> 🔒 **Authentication:**
>
> - The `Authorization` header must include the **JWT** returned from `/login`.
> - Example:
>   ```http
>   Authorization: Bearer <token>
>   ```

---

## 🛠️ Setup & Run

1. Clone repo
   ```bash
   git clone https://github.com/mehtsham3/blog-microservices.git
   cd blog-microservices
````
