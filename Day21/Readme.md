# 📅 Day 21 – Deployment (Cloud Basics + MongoDB Atlas)

## 🌟 Core Topic Focus

- Cloud hosting providers (Render, Railway, AWS EC2, Heroku)
- Environment variables & secrets management
- Deploying containerized apps (Docker)
- Using MongoDB Atlas for cloud database storage

---

## 📝 Concepts Explained

### 1. What is Deployment?

Deployment means putting your backend application online so that **anyone on the internet can access it**.

- Localhost → only works on your machine.
- Cloud Deployment → hosted on a cloud server accessible 24/7.

---

### 2. Cloud Hosting Providers

Some popular cloud platforms for beginners:

- **Render** → Free tier, easy GitHub integration.
- **Railway** → Free tier (limited hours), very beginner-friendly.

👉 Start with Render or Railway for practice.

---

### 3. Environment Variables & Secrets

Store sensitive information (DB URIs, API keys, JWT secrets) securely.

**Example `.env`:**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogapi
JWT_SECRET=mysecretkey
```
