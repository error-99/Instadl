import Insta from "instagram-scraper-api";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    const media = await Insta.getMedia(url);

    if (!media) {
      return res.status(404).json({ error: "Media not found or private account" });
    }

    // Get video or image
    const media_url = media.is_video ? media.video_url : media.display_url;

    res.status(200).json({ media_url });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Instagram media", details: err.message });
  }
}
