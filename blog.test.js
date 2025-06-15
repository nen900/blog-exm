

jest.setTimeout(20000); // 20 seconds

const request = require("supertest");
const app = require("./index");
const mongoose = require("mongoose");
const USER = require("./models/userSchema");
const Article = require("./models/articleSchema");

require("dotenv").config();

let token = "";
let articleId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.mongodb_url);

  const res = await request(app).post("/signup").send({
    first_name: "Blog",
    last_name: "Tester",
    username: "blogtester",
    email: "blogtester@example.com",
    password: "password123",
  });

  token = res.body.token;
});

afterAll(async () => {
  await USER.deleteMany({});
  await Article.deleteMany({});
  await mongoose.connection.close();
});

describe("Blog Routes", () => {
  it("should create a new blog post", async () => {
    const res = await request(app)
      .post("/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Blog Title",
        description: "This is a blog description.",
        body: "This is the full content of the blog post.",
        tags: ["test", "api", "jest"]
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("article");
expect(res.body.article).toHaveProperty("title", "Test Blog Title");

articleId = res.body.article._id;
  }); 
});
