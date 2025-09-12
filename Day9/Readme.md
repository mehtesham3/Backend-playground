# 📅 Day 09 – SQL Basics

## 📌 Core Topics

- Introduction to Relational Databases
- Tables, Rows, and Relationships (1:1, 1:N, M:N)
- Basic SQL Queries: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `JOIN`

---

## 🛠️ Setup

- Installed **PostgreSQL** locally using SQL Shell (psql)
- Created a database:

```sql
CREATE DATABASE shopdb;
\c shopdb;

```

## 🛍️ Project Context: Mini E-commerce System

Today, I designed a **mini E-commerce database** to learn SQL concepts in a real-world scenario.

In an E-commerce app:

- **Users** register with their details (name, email).
- **Products** are listed with price and stock.
- **Orders** are created when a user purchases items.
- **Order Items** track which products were bought, their quantity, and price.

This structure is widely used in online shops like **Amazon, Flipkart, or Myntra**, making it an ideal case study to practice SQL.

---

## 🛠️ Setup

- Installed **PostgreSQL** locally using SQL Shell (psql)
- Created a database:

```sql
CREATE DATABASE shopdb;
\c e_commerce;
```
