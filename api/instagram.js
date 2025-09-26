import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 8000
    });

    const html = response.data;

    // Look for "video_url" or "display_url" in the HTML
    const videoMatch = html.match(/"video_url":"([^"]+)"/);
    const imageMatch = html.match(/"display_url":"([^"]+)"/);

    if (videoMatch) {
      const videoUrl = videoMatch[1].replace(/\\u0026/g, "&");
      return res.status(200).json({ media_url: videoUrl });
    }

    if (imageMatch) {
      const imageUrl = imageMatch[1].replace(/\\u0026/g, "&");
      return res.status(200).json({ media_url: imageUrl });
    }

    return res.status(404).json({ error: "Media not found or private account" });

  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch Instagram media", details: err.message });
  }
}
