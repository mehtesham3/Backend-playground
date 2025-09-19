# Day 16 – Redis Caching

## 📌 Core Topic Focus

- **Introduction to Redis**

  - Redis is an open-source, in-memory data store.
  - Used as a cache, message broker, and session store.
  - Very fast because it stores data in RAM (instead of disk).

- **Key-value caching patterns**

  - Store API responses as key-value pairs (`key = request`, `value = response`).
  - Cache-aside pattern:
    - On request → Check cache first.
    - If hit → Return cached data.
    - If miss → Fetch from DB, then update cache.
  - TTL (time-to-live) ensures cache expires and stays fresh.

- **Session storage in Redis**
  - Store user sessions in Redis instead of DB or in-memory server storage.
  - Benefits:
    - Fast lookup
    - Works well in distributed systems (multiple servers can share sessions).
    - Prevents data loss on server restart.

---

# 📦 E-commerce API – `/products` with Redis Caching

## 🔹 Route Overview

The `/products` route is used to **fetch all products** from the database.  
To improve performance, we integrate **Redis caching** so repeated requests are served faster.  
The `\del-redis` route is used to **delete the redis cache** from the redis

---

## ⚡ Endpoints

### 1. **GET /products**

- **Description:** Fetch all products.
- **Logic:**
  - Check Redis cache for key `products:all`.
  - If cache exists → return cached data (fast).
  - If cache is missing → fetch from DB, save to Redis, then return response.
