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
  try {
    const { username } = req.body || {};

    if (!username || typeof username !== "string" || !username.trim()) {
      return res.status(400).json({
        error: "Invalid 'username' provided. Expected non-empty string.",
      });
    }

    // Validate required env vars early for clearer errors in production
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        error:
          "Server configuration error: YOUTUBE_API_KEY is missing. Set it in your environment (e.g., Heroku config vars).",
      });
    }
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error:
          "Server configuration error: GROQ_API_KEY is missing. Set it in your environment (e.g., Heroku config vars).",
      });
    }

    const { id } = await fetchChannelByName(username);
    const data = await fetchRecentUploads(id);
    const result = await analyzeVideos(data);

    return res.json(result);
  } catch (err) {
    // Normalize error responses to help the client display actionable messages
    const message = err?.message || "Unexpected server error";
    const status =
      message.includes("Channel not found") ||
      message.includes("Channel name is required")
        ? 404
        : message.includes("Missing YOUTUBE_API_KEY") ||
          message.includes("Missing GROQ_API_KEY")
        ? 500
        : message.startsWith("YouTube API ")
        ? 502
        : 500;

    return res.status(status).json({ error: message });
  }
});

app.post("/api/health", async (req, res, next) => {
  return res.json({ message: "checkout session" });
});

app.get("/api/health", async (req, res, next) => {
  return res.json({ message: "Content Analyzer" });
});

module.exports = app;
