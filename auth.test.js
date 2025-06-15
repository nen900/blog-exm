const request = require("supertest");
const app = require("./index");
const mongoose = require("mongoose");
const USER = require("./models/userSchema");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.mongodb_url);
}, 20000);

beforeEach(async () => {
  await USER.deleteMany({});
});

describe("Auth routes", () => {

  it("should return 201 when signup is successful", async () => {
    const res = await request(app).post("/signup").send({
      first_name: "Jane",
      last_name: "Doe",
      username: "janedoe_test",
      email: "janedoe_test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("id");
  });

  it("should return 409 if email or username already exists", async () => {
    // First signup
    await request(app).post("/signup").send({
      first_name: "Jane",
      last_name: "Doe",
      username: "janedoe_test",
      email: "janedoe_test@example.com",
      password: "password123",
    });

    // Try signing up again with same email + username
    const res = await request(app).post("/signup").send({
      first_name: "Jane",
      last_name: "Doe",
      username: "janedoe_test",
      email: "janedoe_test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty("errors");
  });

  it("should return 201 on successful login", async () => {
    // First signup
    await request(app).post("/signup").send({
      first_name: "Jane",
      last_name: "Doe",
      username: "janedoe_test",
      email: "janedoe_test@example.com",
      password: "password123",
    });

    // Now login
    const res = await request(app).post("/login").send({
      username: "janedoe_test",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("username", "janedoe_test");
  });

});

afterAll(async () => {
  await mongoose.disconnect();
});
