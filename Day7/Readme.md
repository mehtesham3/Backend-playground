# Blog API

A RESTful API for a blogging platform built with Node.js, Express, and MongoDB. Features user authentication with JWT and full CRUD operations for blog posts.

## Features

- **User Authentication**: JWT-based signup and login system
- **CRUD Operations**: Create, read, update, and delete blog posts
- **Protected Routes**: Authentication required for post modifications
- **MongoDB Integration**: MongoDB with Mongoose ODM for data persistence
- **RESTful Design**: Clean and predictable API endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcrypt for password hashing
- **Environment Management**: dotenv

## API Endpoints

### Authentication Endpoints

| Method | Endpoint  | Description         | Auth Required |
| ------ | --------- | ------------------- | ------------- |
| POST   | `/signup` | Register a new user | No            |
| POST   | `/login`  | Login existing user | No            |

### Blog Endpoints

| Method | Endpoint    | Description          | Auth Required |
| ------ | ----------- | -------------------- | ------------- |
| GET    | `/blog`     | Get all blog posts   | No            |
| POST   | `/blog`     | Create new blog post | Yes           |
| PATCH  | `/blog/:id` | Update blog post     | Yes           |
| DELETE | `/blog/:id` | Delete blog post     | Yes           |

## Detailed API Documentation

### Authentication

#### Register User

```http
POST /signup
Content-Type: application/json

{
  "email": "MohammadEhtesham@duck.com",
  "password": "password123Secure@89283",
}
```
