# 📈 Day 27 – Scaling APIs (Load Balancing & Horizontal Scaling)

Today’s focus is on how to **scale backend APIs** to handle increasing traffic efficiently.  
We explore the difference between **vertical vs horizontal scaling**, how **load balancers** like NGINX work, and why **stateless services** are essential for scaling.

---

## 🎯 Core Topics

### 🔹 1. Vertical Scaling

- **Definition**: Adding more power (CPU, RAM, storage) to a single machine.
- ✅ Simple to implement.
- ❌ Limited by hardware capacity & single point of failure.

Example: Upgrading from a 2-core, 4GB server → to an 8-core, 32GB server.

---

### 🔹 2. Horizontal Scaling

- **Definition**: Adding more servers/instances to distribute load.
- ✅ Practically unlimited scaling.
- ✅ More fault tolerant (one server down → others still work).
- ❌ Requires **load balancing** and **stateless services**.

Example: Running 5 smaller API servers instead of 1 large one.

---

### 🔹 3. Load Balancers (NGINX Basics)

When scaling horizontally, a **load balancer** distributes traffic across multiple servers.

**Simple NGINX config for load balancing:**

```nginx
http {
    upstream backend_api {
        server 127.0.0.1:3001;
        server 127.0.0.1:3002;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://backend_api;
        }
    }
}
```
