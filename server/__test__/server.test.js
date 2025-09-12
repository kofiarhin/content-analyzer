const app = require("../app");
const request = require("supertest");
const sampleData = require("./sampleData.json");
const videoChannelAnalyzer = require("../ai/videoAnalyzer");
const fetchYouTubeDataForChannels = require("../utils/fetchYouTubeDataForChannels");
const {
  fetchChannelByName,
  fetchRecentUploads,
} = require("../services/fetchYoutubeData");

describe("testing server", () => {
  // it("just a passing test", async () => {
  //   const res = await request(app).get("/api/health");
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty("message");
  // });

  it("should fetch data from youtube succesfully", async () => {
    const { id } = await fetchChannelByName("@devkofi");
    expect(id).toBeDefined();
  }, 30000);

  it("should fetch recent videos successfully", async () => {
    const id = "UCKHAmydXRabltNm9hSoFzbA";
    const result = await fetchRecentUploads(id);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  }, 30000);

  it("should test for channel analysis successfully", async () => {
    const { statusCode, body } = await request(app)
      .post("/api/analysis")
      .send({ username: "@devkofi" });
    expect(statusCode).toBe(200);
    console.log({ body });
  }, 30000);
});
