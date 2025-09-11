const app = require("../app");
const request = require("supertest");
const sampleData = require("./sampleData.json");
const videoChannelAnalyzer = require("../ai/videoAnalyzer");

describe("testing server", () => {
  // it("just a passing test", async () => {
  //   const res = await request(app).get("/api/health");
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty("message");
  // });

  it("should analyze data properly", async () => {
    const result = await videoChannelAnalyzer(sampleData);
    console.log(result);
  });
});
