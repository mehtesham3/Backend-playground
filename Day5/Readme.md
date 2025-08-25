# 🚀 Day 5 – MongoDB Basics (CRUD with Mongoose)

## 📌 Overview

Today’s focus was on learning the **MongoDB data model** and performing **CRUD operations** using **Mongoose** in a Node.js + Express environment.

We built a simple **User API** with the following features:

- User Registration (Create)
- Fetch All Users (Read)
- Update User (Update)
- Delete User (Delete)

---

## 🗂 MongoDB Data Model

MongoDB organizes data as:

- **Database** → container for collections
- **Collection** → group of documents (like a SQL table)
- **Document** → individual data record (JSON-like object)

👉 Example:

```json
{
  "_id": "64a7f0c5f93d3b001f7c1a12",
  "name": "Ehtesham",
  "email": "ehtesham@example.com",
  "age": 21
}
```
