import axios from "axios";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || !url.includes("instagram.com")) {
    return res.status(400).json({ error: "Invalid Instagram URL" });
  }

  try {
    // Add '?__a=1&__d=dis' to get JSON data
    let apiUrl = url;
    if (!apiUrl.endsWith("/")) apiUrl += "/";
    apiUrl += "?__a=1&__d=dis";

    const response = await axios.get(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const mediaUrl = response.data.graphql.shortcode_media.display_url;

    res.status(200).json({ media_url: mediaUrl });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Instagram media" });
  }
}
