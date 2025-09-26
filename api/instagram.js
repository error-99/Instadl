import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    let apiUrl = url.endsWith("/") ? url : url + "/";
    apiUrl += "?__a=1&__d=dis";

    const response = await axios.get(apiUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 8000 // avoid long delays
    });

    const media = response.data?.graphql?.shortcode_media;

    if (!media) {
      return res.status(404).json({ error: "Media not found or private account" });
    }

    const media_url = media.is_video ? media.video_url : media.display_url;

    res.status(200).json({ media_url });

  } catch (err) {
    // catch all errors and return as JSON instead of crashing
    res.status(500).json({ 
      error: "Failed to fetch Instagram media", 
      details: err.message 
    });
  }
}
