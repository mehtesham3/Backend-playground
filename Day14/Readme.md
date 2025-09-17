# E-commerce API – Part 2 (Cart & Orders)

This project implements the **Cart, Orders, and Order Items workflow** for an e-commerce system using **PostgreSQL** and **Knex.js**, with JWT authentication for users and admin roles.

---

## Project Structure

````

├── db.js # Knex configuration
├── index.js # App entry point
├── Routes/
│ ├── User.js # User auth & signup/login
│ ├── Product.js # Product routes
│ ├── Cart.js # Cart routes
│ └── Orders.js # Orders & Order Items routes
├── Middleware/
│ ├── authMiddleware.js # JWT authentication & admin check
│ └── schemaValidation.js # Joi validation middleware
├── config/
│ └── passport.js # Passport Google OAuth setup
├── Migrations/
│ ├── create_cart_items.js
│ ├── create_orders.js
│ └── create_order_items.js
├── package.json
└── README.md

---

---

## Tables Implemented

### 1. `cart_items`
- Stores products added to a user's cart.
- **Columns:**
  - `id` (UUID, primary key)
  - `user_id` (UUID, references users)
  - `product_id` (UUID, references products)
  - `quantity` (integer, default 1)
  - `created_at` / `updated_at`

### 2. `orders`
- Stores order records.
- **Columns:**
  - `id` (UUID, primary key)
  - `user_id` (UUID, references users)
  - `total_amount` (decimal)
  - `status` (enum: pending, shipped, delivered, cancelled)
  - `idempotency_key` (optional, unique)
  - `created_at` / `updated_at`

### 3. `order_items`
- Stores products within an order.
- **Columns:**
  - `id` (UUID, primary key)
  - `order_id` (UUID, references orders)
  - `product_id` (UUID, references products)
  - `quantity` (integer)
  - `price` (decimal, snapshot at order time)
  - `created_at` / `updated_at`

---

## API Endpoints

### 1. **Cart Routes**

| Method | Endpoint           | Access       | Description |
|--------|------------------|--------------|-------------|
| POST   | `/cart/add`        | Auth User    | Add a product to cart. |
| GET    | `/cart`            | Auth User    | View current user's cart items. |
| PATCH  | `/cart/update`     | Auth User    | Update quantity of a product in cart. |
| DELETE | `/cart/delete/:product_id` | Auth User | Remove a product from cart. |

**Sample Request JSON – Add to Cart:**
```json
{
  "product_id": "uuid-of-product",
  "quantity": 2
}

````

# 🛒 Orders & Order Items API Documentation

This document explains the **Orders** and **Order Items** routes, their access rules, request/response formats, and usage.

---

## 📦 Orders Routes

| Method     | Endpoint             | Access          | Description                            |
| ---------- | -------------------- | --------------- | -------------------------------------- |
| **POST**   | `/orders/create`     | Auth User       | Create a new order from cart items.    |
| **GET**    | `/orders`            | Auth User       | Get all orders for the logged-in user. |
| **GET**    | `/orders/:id`        | Auth User/Admin | Get a single order with its items.     |
| **PATCH**  | `/orders/update/:id` | Admin Only      | Update order status.                   |
| **DELETE** | `/orders/delete/:id` | Admin Only      | Delete an order and its items.         |

---

### 1. Create Order

**Endpoint:**  
`POST /orders/create`

**Access:** Authenticated user

**Request Body:** (No body needed, items are taken from the cart)

```json
{}
```
