# 🚀 Day 19 – Docker Compose & Multi-Service Setup

## 📌 Core Topic Focus

- Multi-container apps (API + DB + Redis)
- Docker Compose basics (`docker-compose.yml`)

---

## 📖 Overview

Today we learned how to use **Docker Compose** to manage multi-service applications.  
Instead of starting each container separately (API, Database, Cache), we can define them in a single file (`docker-compose.yml`) and run everything with **one command**.

---

## 🛠 Example Setup (Blog API + MongoDB + Redis)

### `docker-compose.yml`

```yaml
version: "3.9"
services:
  api:
    build: .
    container_name: blog_api
    ports:
      - "5000:5000"
    depends_on:
      - mongo
      - redis
    environment:
      - MONGO_URL=mongodb://mongo:27017/blogdb
      - REDIS_HOST=redis
      - REDIS_PORT=6379

  mongo:
    image: mongo:latest
    container_name: blog_mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:latest
    container_name: blog_redis
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```
