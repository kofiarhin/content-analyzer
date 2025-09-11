const app = require("../app");
const request = require("supertest");

describe("testing server", () => {
  it("just a passing test", async () => {
    const { statusCode, body } = await request(app).get("/");
    console.log({ statusCode });
  });

  it("should test for checkout session", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/checkout")
      .send({ message: "some pricing details" });
    console.log({ statusCode, body });
  });
});
