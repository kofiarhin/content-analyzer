const { Groq } = require("groq-sdk");
const { videoChannelAnalysisPrompt } = require("./prompts");

// Configurable model
const MODEL_NAME = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

/**
 * videoChannelAnalyzer
 * @param {Array} data - Array of channel data objects with channel URL and videos
 * @returns {Promise<Object>} Parsed JSON object from Groq
 */
const videoChannelAnalyzer = async (data = []) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable");
  }

  const groq = new Groq({ apiKey });

  // Assume data[0] is the channel data
  const channelData = data[0] || {};
  const channelUrl = channelData.channel || "";
  const videos = channelData.videos || [];

  // Format videos for the prompt
  const videosText = videos
    .map(
      (vid, idx) =>
        `${idx + 1}. ${vid.title} - Duration: ${vid.duration}s, Views: ${
          vid.viewCount
        }`
    )
    .join("\n");

  const finalPrompt = `${videoChannelAnalysisPrompt}

Channel URL: ${channelUrl}
Videos:
${videosText}
`;

  try {
    const response = await groq.chat.completions.create({
      model: MODEL_NAME,
      messages: [{ role: "user", content: finalPrompt }],
      temperature: 0.4,
      max_tokens: 2048,
      top_p: 1,
      stream: false,
    });

    let raw = response?.choices?.[0]?.message?.content ?? "";

    raw = raw.trim();
    if (raw.startsWith("```")) {
      raw = raw
        .replace(/^```[\s\S]*?\n/, "")
        .replace(/```$/, "")
        .trim();
    }

    const jsonBlockMatch = raw.match(/{[\s\S]*}/);
    const jsonText = jsonBlockMatch ? jsonBlockMatch[0] : raw;

    try {
      const parsed = JSON.parse(jsonText);
      return parsed;
    } catch (parseErr) {
      return {
        ok: false,
        reason: "invalid_json_from_model",
        message: "Failed to parse model output as JSON.",
        raw: raw.slice(0, 5000),
      };
    }
  } catch (err) {
    console.error("Groq API Error:", err.response?.data || err);
    throw new Error(`videoChannelAnalyzer failed: ${err.message}`);
  }
};

module.exports = videoChannelAnalyzer;
