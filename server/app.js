const express = require("express");
const app = express();
const fetchYouTubeDataForChannels = require("./utils/fetchYouTubeDataForChannels");
const dotenv = require("dotenv").config();
const cors = require("cors");

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

app.post("/api/health", async (req, res, next) => {
  return res.json({ message: "checkout session" });
});

module.exports = app;
