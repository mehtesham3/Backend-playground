//Write tests for user authentication routes

const request = require("supertest");
const app = require("./Q2App.js");

describe("Auth Routes", () => {
  let token;

  // Test Signup
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "Ehtesham", email: "e@test.com", password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("e@test.com");
  });

  it("should not register duplicate user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "Ehtesham", email: "e@test.com", password: "123456" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  // Test Login
  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "e@test.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token; // store token for protected route
  });

  it("should reject login with wrong credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "e@test.com", password: "wrong" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  // Test Protected Route
  it("should access profile with valid token", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access granted");
    expect(res.body.user).toHaveProperty("email", "e@test.com");
  });

  it("should block access without token", async () => {
    const res = await request(app).get("/auth/profile");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("No token provided");
  });

  it("should block access with invalid token", async () => {
    const res = await request(app)
      .get("/auth/profile")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Invalid token");
  });
});
