# 🚀 Day 15 – Performance & Scalability Basics

## 📌 Core Topic Focus

Today we focused on key concepts that make backends **faster, scalable, and production-ready**:

- **Scalability Concepts**
  - **Vertical Scaling**: Adding more power (CPU, RAM) to a single server.
  - **Horizontal Scaling**: Adding more servers and distributing traffic across them.
- **Load Balancing Basics**
  - Distributes traffic among multiple servers for reliability and performance.
- **Caching Strategies**
  - **In-memory (e.g., node-cache, Redis)**: Fastest, but data lost on restart.
  - **Database-level caching**: Query-level or materialized views.
  - **CDN caching**: For static assets like images, CSS, JS.
- **N+1 Query Problem**
  - A common inefficiency where one query triggers many additional queries (e.g., fetching each post’s author separately).

---

## 🛠 Hands-on Coding

1. **Compared API response times**:
   - Without caching → every request hits DB.
   - With caching (`node-cache`) → subsequent requests serve from memory.
2. **Optimized Queries**:
   - Used **MongoDB `.populate()`** or **Postgres JOINs** to prevent N+1 queries.

---

### Example (Node.js + Express + node-cache)

```js
const express = require("express");
const NodeCache = require("node-cache");
const Post = require("./models/Post"); // Mongoose model
const app = express();

const cache = new NodeCache({ stdTTL: 60 }); // cache for 60 seconds

app.get("/posts", async (req, res) => {
  const cachedPosts = cache.get("posts");

  if (cachedPosts) {
    return res.json({ source: "cache", data: cachedPosts });
  }

  const posts = await Post.find().populate("author", "name email");
  cache.set("posts", posts);

  res.json({ source: "db", data: posts });
});
```
