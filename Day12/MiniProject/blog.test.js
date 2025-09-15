import request from "supertest";
import mongoose from 'mongoose'
import app from "../../Day7/Miniproject/index.js";
import user from '../../Day7/Miniproject/Schema.js'
import { blog } from '../../Day7/Miniproject/Schema.js'

let token;
let blogid;

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/Blog");

  //Clear user + blog before test
  await user.deleteMany({});
  await blog.deleteMany({});

  //Create test user and login 
  await request(app).post("/signup").send({
    email: "test@example.com",
    password: "test@123"
  });

  const logins = await request(app).post("/login").send({
    email: "test@example.com",
    password: "test@123"
  })
  token = logins.body.token;    //JWT
});

afterAll(async () => {
  await mongoose.connection.close();
})

describe("Blog API", () => {

  it("should create a blog ", async () => {
    const res = await request(app).post("/blog").set("Authorization", `Bearer ${token}`).send({
      title: "My First Blog",
      content: "This is some long blog content with more than 20 characters.",
      author: "Ehtesham",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("_id");
    blogid = res.body.data._id;
  });

  it("should fail validation with short title", async () => {
    const res = await request(app)
      .post("/blog")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Hi",
        content: "short",
        author: "E",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should get all blogs", async () => {
    const res = await request(app).get("/blog");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.Blog)).toBe(true);
  });

  it("should update a blog", async () => {
    const res = await request(app)
      .patch(`/blog/${blogid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Blog",
        content: "This is updated content with enough characters.",
        author: "Ehtesham",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.Success).toBe(true);
  });

  it("should delete a blog", async () => {
    const res = await request(app)
      .delete(`/blog/${blogid}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Deleted successfully");
  });


})