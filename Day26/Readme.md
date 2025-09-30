# 🛍️ ECommerce API Documentation (with Swagger)

A complete RESTful ECommerce API built with **Node.js**, **Express**, and **PostgreSQL**.  
Features user authentication, product management, shopping cart, orders, and admin functionalities.

---

## 📋 API Overview

| Feature        | Description                              | Endpoints   |
| -------------- | ---------------------------------------- | ----------- |
| Authentication | JWT-based auth with Google OAuth         | 4 endpoints |
| Products       | CRUD operations with categories & brands | 4 endpoints |
| Shopping Cart  | Add, update, view, and remove items      | 4 endpoints |
| Orders         | Order creation, tracking, and management | 4 endpoints |
| Order Items    | Detailed order item management           | 3 endpoints |

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/mehtesham3/Backend-playground/tree/main/Day26
cd Day26/Ecommerce
```

Install dependencies:

```bash
npm install
```

Edit .env with your configuration:

```bash
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce
JWT_SECRET_KEY=your-jwt-secret-key
SESSION_SECRET=your-session-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Set up database:

```bash
# Run migrations
npx knex migrate:latest
# Seed initial data (optional)
npx knex seed:run
```

Start the server:

```bash
npm start
# or for development
npm run dev
```

# 📚 API Documentation

This document provides details about the available endpoints, authentication, user roles, and security features for the ECommerce API.

---

## 📖 Interactive Documentation

Swagger UI is available at:
http://localhost:3000/api-docs

### Base URL

http://localhost:3000

---

## 🔐 Authentication

### JWT Token

All protected endpoints require a JWT token in the `Authorization` header:

### Available Authentication Methods

- **Email/Password Registration & Login**

  - `POST /auth/signup` – Create new account
  - `POST /auth/login` – Login with credentials

- **Google OAuth**
  - `GET /auth/google` – Initiate Google OAuth
  - `GET /auth/google/callback` – OAuth callback

---

## 👥 User Roles

- **User** → Can browse products, manage cart, place orders
- **Admin** → Full access including product management and order administration

---

## 🛒 API Endpoints Summary

### General

- `GET /` – Health check
- `GET /db-test` – Database connection test

### Authentication

- `POST /auth/signup` – User registration
- `POST /auth/login` – User login
- `GET /auth/profile` – Get user profile
- `GET /auth/google` – Google OAuth

### Products

- `POST /products` – Create product (Admin only)
- `GET /products` – Get all products (Public)
- `PATCH /products/:id` – Update product (Admin only)
- `DELETE /products/:id` – Delete product (Admin only)

### Cart

- `POST /cart/items` – Add item to cart
- `GET /cart` – Get cart items
- `PATCH /cart/items/:itemId` – Update cart item quantity
- `DELETE /cart/items/:itemId` – Remove item from cart

### Orders

- `POST /orders` – Create order from cart
- `GET /orders` – Get user orders
- `PATCH /orders/:id/status` – Update order status (Admin only)
- `DELETE /orders/:id` – Delete order (Admin only)

### Order Items

- `GET /order-items` – Get order items (Role-based access)
- `GET /orders/:orderId/items` – Get items by order ID
- `DELETE /order-items/:id` – Delete order item (Admin only)

---

## 🔧 Database Schema

### Key Tables

- `users` – User accounts and authentication
- `products` – Product catalog
- `categories` – Product categories
- `brands` – Product brands
- `cart_items` – Shopping cart items
- `orders` – Order headers
- `order_items` – Order line items

---

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on login attempts
- Input validation with Joi
- SQL injection prevention with Knex
- CORS protection
- Helmet.js security headers

---
