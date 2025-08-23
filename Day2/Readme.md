# Day 2 – Node.js Core Modules

## 📚 Core Topic Focus

Today we explored the foundational Node.js core modules that enable powerful server-side JavaScript development:

- **File System (fs) Module:** File operations using both synchronous (blocking) and asynchronous (non-blocking) methods
- **Path Module:** Cross-platform file path manipulation and normalization
- **OS Module:** Accessing system information and operating system utilities
- **HTTP Module:** Creating servers and making HTTP requests
- **Events Module:** Implementing event-driven architecture with EventEmitter

We also covered:

- **Streams and Buffers** for efficient data handling
- **Asynchronous file reading and writing patterns**
- **Error handling strategies** for file operations

---

## 🛠️ Hands-on Coding

### 1. JSON File Operations

Created scripts to **read, write, and manipulate JSON files** with proper error handling.

### 2. Simple HTTP Server

Built a **basic HTTP server without Express** to handle different routes and HTTP methods.

### 3. Custom Event Emitter

Implemented a **custom event emitter class** extending Node.js’s EventEmitter for application events.

---

## 🚀 Mini Project: File Logger

**Repo:** `node-core-basics`

We built an efficient **file logger** that:

- Logs **HTTP requests** into timestamped files
- Uses **streams** for memory-efficient writing
- Implements **event emitters** for logging events
- Provides both synchronous and asynchronous logging methods

### 🔑 Key Features

- **Rotating log files** based on size or date
- **Configurable log levels**: INFO, WARN, ERROR
- **Structured JSON logging format**

---

## ❓ Checkpoints & Questions

### 1. Difference between `fs.readFile` vs `fs.createReadStream`?

- `fs.readFile`: Reads the **entire file into memory at once**, suitable for small files.

  - ✅ Simple to use
  - ⚠️ Can cause memory issues with large files

- `fs.createReadStream`: Reads files in **chunks using streams**, memory-efficient for large files.
  - ✅ Better for performance with large datasets or continuous data flow

---

### 2. How does event-driven programming work in Node.js?

- Node.js uses an **event-driven architecture** where objects (**emitters**) emit named events that trigger **listener functions**.
- This non-blocking I/O model allows Node.js to handle **many connections concurrently**.
- The **event loop** processes events as they occur, making applications scalable and efficient.

---
