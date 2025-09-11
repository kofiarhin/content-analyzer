const express = require("express");
const app = express();
const fetchYouTubeDataForChannels = require("./utils/fetchYouTubeDataForChannels");
const dotenv = require("dotenv").config();
const cors = require("cors");
const videoChannelAnalyzer = require("./ai/videoAnalyzer");

// setupt middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", async (req, res, next) => {
  const result = await fetchYouTubeDataForChannels(
    [
      "https://www.youtube.com/@devkofi",
      "https://www.youtube.com/@ThePrimeTimeagen",
      "https://www.youtube.com/@t3dotgg",
      "https://www.youtube.com/@TraversyMedia",
    ],
    { limit: 600, debug: true }
  );
  return res.json(result);
});

app.post("/api/analysis", async (req, res, next) => {
  try {
    const { url } = req.body;
    const result = await fetchYouTubeDataForChannels([url], {
      limit: 600,
      debug: true,
    });
    const dataAnalysis = await videoChannelAnalyzer(result);
    return res.json(dataAnalysis);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/health", async (req, res, next) => {
  return res.json({ message: "checkout session" });
});

module.exports = app;
