// ai/simpleVideoAnalyzer.js
// Minimal, working implementation: send a small dataset to Groq and return strict JSON.
// Requires: Node 18+, GROQ_API_KEY in env. Optional: GROQ_MODEL (default: "llama-3.1-8b-instant").

const { Groq } = require("groq-sdk");

const MODEL_NAME = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

/**
 * analyzeVideos(dataset, channel)
 * @param {Array<Object>} dataset - e.g. [{ videoId, title, stats: { viewCount } }, ...]
 * @param {Object} [channel] - Optional channel meta to improve summary (e.g., { name, handle, niche, description, audience, subscribers })
 * @returns {Promise<Object>} Parsed JSON with:
 *   - summary (3–5 sentences, string) — ABOUT THE CHANNEL (positioning, audience, value prop, performance patterns)
 *   - engagement_insights (3–5 sentences, string)
 *   - recommendations (exactly 5 strings)
 *   - top_videos (3 video TITLES, strings)
 *   - suggested_topics (10 items: { topic, description (2–3 sentences) })
 */
const analyzeVideos = async (dataset = [], channel = {}) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing GROQ_API_KEY");

  // Keep payload compact to avoid truncation issues.
  const compact = (Array.isArray(dataset) ? dataset : [])
    .slice(0, 12)
    .map((v) => ({
      title: v?.title ?? "",
      videoId: v?.videoId ?? "",
      views: Number(v?.stats?.viewCount ?? v?.stats?.views ?? 0),
    }));

  // Precompute the 3 best performers to anchor strategy & reduce LLM mistakes.
  const topByViews = [...compact].sort((a, b) => b.views - a.views).slice(0, 3);

  // Lightweight stats to help the model write a channel-level summary.
  const viewNums = compact
    .map((v) => v.views)
    .filter((n) => Number.isFinite(n));
  const totalViews = viewNums.reduce((a, b) => a + b, 0);
  const avgViews = viewNums.length
    ? Math.round(totalViews / viewNums.length)
    : 0;
  const medianViews = (() => {
    if (!viewNums.length) return 0;
    const sorted = [...viewNums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? sorted[mid]
      : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  })();

  // Sanitize channel meta
  const CHANNEL_META = {
    name: channel?.name ?? "",
    handle: channel?.handle ?? "",
    niche: channel?.niche ?? "",
    description: channel?.description ?? "",
    audience: channel?.audience ?? "",
    subscribers: Number(channel?.subscribers ?? 0),
  };

  const groq = new Groq({ apiKey });

  const prompt = `
You are a YouTube strategist. Analyze INPUT_DATASET with special focus on TOP_BY_VIEWS and return STRICT JSON ONLY (no backticks, no commentary).

INPUT_DATASET:
${JSON.stringify(compact)}

TOP_BY_VIEWS (best performers by views, descending):
${JSON.stringify(topByViews)}

CHANNEL_META (use if helpful; otherwise infer from the data):
${JSON.stringify(CHANNEL_META)}

DATA_STATS:
{"video_count": ${
    compact.length
  }, "total_views": ${totalViews}, "avg_views": ${avgViews}, "median_views": ${medianViews}}

RESPONSE_SCHEMA (return EXACT keys):
{
  "ok": true,
  "summary": "3–5 sentences in ONE line (no line breaks). The summary MUST be about the CHANNEL overall (who it's for, niche/positioning, core value prop, and high-level performance patterns from TOP_BY_VIEWS and DATA_STATS).",
  "engagement_insights": "3–5 sentences in ONE line (no line breaks).",
  "recommendations": ["string","string","string","string","string"],
  "top_videos": ["string","string","string"],
  "suggested_topics": [
    { "topic": "string", "description": "2–3 sentences in ONE line (no line breaks)" }
  ]
}

RULES:
- "summary" MUST be channel-level, not a per-video recap. Use CHANNEL_META when available; otherwise infer from INPUT_DATASET + TOP_BY_VIEWS + DATA_STATS.
- Use TOP_BY_VIEWS as "top_videos" (return their TITLES ONLY in the same order).
- Base "recommendations" ONLY on analysis of TOP_BY_VIEWS. Output exactly 5 crisp, actionable items:
  1–2) Improvement actions that extend what's working in the top videos (e.g., hook structure, packaging: title/thumbnail, pacing/retention, CTA, chaptering). Reference at least one top video by title or a clear paraphrase.
  3–5) Concrete content types to create next, derived from patterns in TOP_BY_VIEWS. Each MUST specify: a proposed title formula, target format (Short ~60s or Long ~8–12min), and the key hook angle it borrows from the top videos. Reference at least one top video.
- "suggested_topics" MUST be exactly 10 items derived from recurring patterns in TOP_BY_VIEWS (themes, formats, angles). Avoid duplicates and vague topics.
- All strings MUST be single-line (no line breaks).
- No generic fluff; make every item specific and tied to observed patterns.
- No extra keys. Output ONLY the JSON object.
`;

  const resp = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 900,
    top_p: 1,
  });

  // Get raw text
  let raw = (resp?.choices?.[0]?.message?.content || "").trim();

  // Strip code fences if present
  if (raw.startsWith("```")) {
    raw = raw
      .replace(/^```[\s\S]*?\n/, "")
      .replace(/```$/, "")
      .trim();
  }

  // Extract the first top-level JSON object
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  const jsonText = start !== -1 && end !== -1 ? raw.slice(start, end + 1) : raw;

  // Parse or fail with raw
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed.ok) {
      throw new Error(
        "AI response indicates failure: " + (parsed.error || "Unknown error")
      );
    }
    return parsed;
  } catch (parseError) {
    throw new Error(
      "Failed to parse AI response as JSON: " + parseError.message
    );
  }
};

module.exports = analyzeVideos;
