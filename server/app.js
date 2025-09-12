const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const {
  fetchChannelByName,
  fetchRecentUploads,
} = require("./services/fetchYoutubeData");
const analyzeVideos = require("./ai/videoAnalyzer");

// setupt middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", async (req, res, next) => {
  return res.json({ message: "content-generator" });
});

app.post("/api/analysis", async (req, res, next) => {
  const { username } = req.body;
  const { id } = await fetchChannelByName(username);
  const data = await fetchRecentUploads(id);
  const result = await analyzeVideos(data);
  return res.json(result);
});

app.post("/api/health", async (req, res, next) => {
  return res.json({ message: "checkout session" });
});

module.exports = app;
