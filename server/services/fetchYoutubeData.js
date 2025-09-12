// youtubeChannelByName.js
// Arrow-function version: takes a channel name/handle and returns channel data.
// Requires Node 18+ (global fetch) and process.env.YOUTUBE_API_KEY.

const API = "https://www.googleapis.com/youtube/v3";

const buildUrl = (path, params) => {
  const u = new URL(`${API}/${path}`);
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, String(v)));
  return u;
};

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API ${res.status}`);
  return res.json();
};

const fetchChannelByName = async (name, key = process.env.YOUTUBE_API_KEY) => {
  if (!key) throw new Error("Missing YOUTUBE_API_KEY");
  if (!name) throw new Error("Channel name is required");

  // 1) Resolve channelId via search
  const searchUrl = buildUrl("search", {
    part: "snippet",
    type: "channel",
    q: String(name).replace(/^@/, ""),
    maxResults: 1,
    key,
  });
  const searchData = await fetchJson(searchUrl);
  const channelId = searchData?.items?.[0]?.id?.channelId;
  if (!channelId) throw new Error(`Channel not found for "${name}"`);

  // 2) Fetch channel details
  const channelUrl = buildUrl("channels", {
    part: "snippet,statistics,brandingSettings",
    id: channelId,
    key,
  });
  const channelData = await fetchJson(channelUrl);
  const ch = channelData?.items?.[0];
  if (!ch) throw new Error("No channel data returned");

  return {
    id: ch.id,
    title: ch.snippet?.title ?? null,
    description: ch.snippet?.description ?? null,
    customUrl:
      ch.snippet?.customUrl ?? ch.brandingSettings?.channel?.customUrl ?? null,
    thumbnails: ch.snippet?.thumbnails ?? null,
    country: ch.snippet?.country ?? null,
    publishedAt: ch.snippet?.publishedAt ?? null,
    statistics: {
      subscribers: ch.statistics?.subscriberCount
        ? Number(ch.statistics.subscriberCount)
        : null,
      views: ch.statistics?.viewCount ? Number(ch.statistics.viewCount) : null,
      videos: ch.statistics?.videoCount
        ? Number(ch.statistics.videoCount)
        : null,
    },
  };
};

const fetchRecentUploads = async (
  channelId,
  limit = 20,
  key = process.env.YOUTUBE_API_KEY
) => {
  if (!key) throw new Error("Missing YOUTUBE_API_KEY");
  if (!channelId) throw new Error("Channel ID is required");

  // 1) Get uploads playlistId
  const chUrl = buildUrl("channels", {
    part: "contentDetails",
    id: channelId,
    key,
  });
  const chData = await fetchJson(chUrl);
  const uploadsId =
    chData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error("Uploads playlist not found");

  // 2) Page through playlistItems
  const playlistItems = [];
  let pageToken;
  while (playlistItems.length < limit) {
    const plUrl = buildUrl("playlistItems", {
      part: "contentDetails,snippet",
      playlistId: uploadsId,
      maxResults: Math.min(50, limit - playlistItems.length),
      ...(pageToken ? { pageToken } : {}),
      key,
    });
    const plData = await fetchJson(plUrl);
    playlistItems.push(...(plData.items || []));
    if (!plData.nextPageToken || playlistItems.length >= limit) break;
    pageToken = plData.nextPageToken;
  }

  const videoIds = playlistItems.map((i) => i.contentDetails.videoId).join(",");
  if (!videoIds) return [];

  // 3) Enrich with video details
  const vidsUrl = buildUrl("videos", {
    part: "snippet,contentDetails,statistics",
    id: videoIds,
    key,
  });
  const vidsData = await fetchJson(vidsUrl);
  const map = new Map(vidsData.items.map((v) => [v.id, v]));

  return playlistItems.map((i) => {
    const v = map.get(i.contentDetails.videoId);
    return {
      videoId: i.contentDetails.videoId,
      publishedAt: i.contentDetails.videoPublishedAt,
      title: v?.snippet?.title ?? i.snippet?.title,
      thumbnails: v?.snippet?.thumbnails ?? i.snippet?.thumbnails,
      duration: v?.contentDetails?.duration ?? null,
      stats: v?.statistics ?? {},
    };
  });
};

module.exports = { fetchChannelByName, fetchRecentUploads };
