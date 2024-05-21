"use strict";

const mongoose = require("mongoose");

const connectString = "mongodb://localhost:27017/shopDEV";

const TestSchema = new mongoose.Schema({ user: String });
const Test = mongoose.model("Test", TestSchema);

describe("MongoDB Connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  // Close the connection to mongodb
  afterAll(async () => {
    await connection.disconnect();
  });

  it("should connect to successful MongoDB", async () => {
    expect(connection.connection.readyState).toBe(1);
  });

  it("should create a new document", async () => {
    const test = new Test({ user: "cuongpham" });
    await test.save();
    expect(test.isNew).toBe(false);
  });

  it("should find a document", async () => {
    const test = await Test.findOne({ user: "cuongpham" });
    expect(test).toBeDefined();
    expect(test.user).toBe("cuongpham");
  });
});
