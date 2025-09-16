# 🛠️ Backend Project – Express + PostgreSQL + Knex + Google OAuth

This project demonstrates a backend API built with **Node.js, Express, PostgreSQL, Knex.js, Passport.js (Google OAuth)**.  
It supports **user authentication, product management, categories, brands, and validation**.

---

## 🚀 Features

- RESTful API with Express
- PostgreSQL database with Knex.js query builder
- Authentication via Google OAuth 2.0
- Input validation (Joi/Zod)
- Organized routes for modularity
- Supports Products, Categories, Brands

---

## 📂 Project Structure

.
├── db.js # Knex configuration
├── index.js # App entry point
├── Routes/
│ ├── User.js # Auth & user routes
│ ├── Product.js # Product routes
├── Middleware/
│ ├── authMiddelware.js # Auth middlewares
│ ├── schemaValidation.js # Joi schemas
├── config/
│ └── passport.js # Passport Google OAuth setup
├── package.json
└── README.md

---

## 🗄️ Database Schema (PostgreSQL)

### `users`

| Field      | Type         | Constraints      |
| ---------- | ------------ | ---------------- |
| id         | SERIAL PK    |                  |
| name       | VARCHAR(255) | NOT NULL         |
| email      | VARCHAR(255) | UNIQUE, NOT NULL |
| google_id  | VARCHAR(255) | UNIQUE, NULLABLE |
| created_at | TIMESTAMP    | DEFAULT now()    |

### `categories`

| Field | Type         | Constraints      |
| ----- | ------------ | ---------------- |
| id    | SERIAL PK    |                  |
| name  | VARCHAR(255) | UNIQUE, NOT NULL |

### `brands`

| Field | Type         | Constraints      |
| ----- | ------------ | ---------------- |
| id    | SERIAL PK    |                  |
| name  | VARCHAR(255) | UNIQUE, NOT NULL |

### `products`

| Field       | Type          | Constraints               |
| ----------- | ------------- | ------------------------- |
| id          | SERIAL PK     |                           |
| name        | VARCHAR(255)  | NOT NULL                  |
| description | TEXT          |                           |
| price       | DECIMAL(10,2) | NOT NULL                  |
| stock       | INTEGER       | DEFAULT 0                 |
| category_id | INT FK        | REFERENCES categories(id) |
| brand_id    | INT FK        | REFERENCES brands(id)     |

---

## 🔑 Authentication – Google OAuth 2.0

### Flow

1. User hits `/auth/google` → redirects to Google login
2. Google redirects back to `/auth/google/callback`
3. Passport checks if user exists in DB → if not, creates user
4. Session is created and user is logged in

---

## 📌 API Routes

### **Auth**

| Method | Endpoint                | Description        |
| ------ | ----------------------- | ------------------ |
| GET    | `/auth/google`          | Start Google login |
| GET    | `/auth/google/callback` | OAuth callback     |

---

### **Products**

| Method | Endpoint        | Description                                                |
| ------ | --------------- | ---------------------------------------------------------- |
| POST   | `/products`     | Create product (auto-create category & brand if not exist) |
| GET    | `/products`     | Get all products                                           |
| PATCH  | `/products/:id` | Update product                                             |
| DELETE | `/products/:id` | Delete product                                             |

**Sample Request – Create Product**

```json
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple flagship phone",
  "price": 1299.99,
  "stock": 50,
  "category_name": "Smartphones",
  "brand_name": "Apple"
}
```
