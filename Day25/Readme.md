# 🛒 E-Commerce API – Day 25 (Advanced Authentication & Security)

This project demonstrates **Advanced Authentication & Security** concepts in a simple **E-commerce API**.  
It includes **Role-Based Access Control (RBAC)**, **Rate Limiting**, **Input Sanitization**, **Helmet Security Headers**, and **JWT Authentication**.

---

## 🚀 Features Implemented

- ✅ User Authentication (Signup, Login, Google OAuth)
- ✅ JWT-based Authentication with Role-based Authorization (Admin / User)
- ✅ Rate Limiting on login route (Brute-force protection)
- ✅ Secure Headers with Helmet
- ✅ Secure Endpoints with Middleware
- ✅ Products, Cart, Orders & Order Items Management

---

## 📌 API Endpoints

### 🌍 Server & Database

| Method | Endpoint   | Description                                  |
| ------ | ---------- | -------------------------------------------- |
| GET    | `/`        | Returns `"ECommerce server is running well"` |
| GET    | `/db-test` | Returns database connection info             |

---

### 👤 User Authentication

| Method | Endpoint        | Description                                            |
| ------ | --------------- | ------------------------------------------------------ |
| POST   | `/auth/signup`  | Create a new user with `email`, `password`, and `role` |
| POST   | `/auth/login`   | Login with credentials → Returns **JWT Token**         |
| POST   | `/auth/profile` | Returns **id, name, email, role** (Protected)          |
| GET    | `/auth/google`  | Login using Google OAuth                               |

---

### 📦 Products

| Method | Endpoint        | Description                                        |
| ------ | --------------- | -------------------------------------------------- |
| POST   | `/products`     | Create a product (**Protected, Admin Only**)       |
| PATCH  | `/products/:id` | Update a product field (**Protected, Admin Only**) |
| DELETE | `/products/:id` | Delete a product (**Protected, Admin Only**)       |
| GET    | `/products`     | Get all products (Public)                          |

---

### 🛒 Cart

| Method | Endpoint              | Description                                  |
| ------ | --------------------- | -------------------------------------------- |
| POST   | `/cart/items`         | Add item to cart (**Protected, User Only**)  |
| PATCH  | `/cart/items/:itemId` | Update item quantity in cart (**Protected**) |
| GET    | `/cart`               | Get all cart items (**Protected**)           |
| DELETE | `/cart/items/:itemId` | Delete item from cart (**Protected**)        |

---

### 📑 Orders

| Method | Endpoint             | Description                                     |
| ------ | -------------------- | ----------------------------------------------- |
| POST   | `/orders`            | Create order from cart (**Protected**)          |
| GET    | `/orders`            | Get all orders (**Protected**)                  |
| PATCH  | `/orders/:id/status` | Update order status (**Protected, Admin Only**) |
| DELETE | `/orders/:id`        | Delete order (**Protected, Admin Only**)        |

---

### 📦 Order Items

| Method | Endpoint                 | Description                                                               |
| ------ | ------------------------ | ------------------------------------------------------------------------- |
| GET    | `/order-items`           | Get all order items with order & user details (**Protected, Admin Only**) |
| GET    | `/orders/:orderId/items` | Get order details (**Protected → Admin or Owner**)                        |
| DELETE | `/order-items/:id`       | Delete an order item (**Protected, Admin Only**)                          |

---

## 🔒 Security Implementations

### 1. Role-Based Access Control (RBAC)

- Roles: **`admin`** and **`user`**
- Admin can: manage products, manage all orders, view all order items.
- User can: manage their own cart, place orders, view their own order items.

```js
// Example usage
router.post("/products", authenticate, authorize(["admin"]), createProduct);
router.post("/cart/items", authenticate, authorize(["user"]), addToCart);
```
