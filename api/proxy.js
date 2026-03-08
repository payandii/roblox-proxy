export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  const allowedDomains = [
    "games.roblox.com",
    "apis.roblox.com",
    "catalog.roblox.com",
    "economy.roblox.com",
  ];

  let targetUrl;
  try {
    targetUrl = decodeURIComponent(url);
    const urlObj = new URL(targetUrl);
    const isAllowed = allowedDomains.some((domain) =>
      urlObj.hostname.endsWith(domain)
    );
    if (!isAllowed) {
      return res.status(403).json({ error: "Domain not allowed" });
    }
  } catch (e) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch data" });
  }
}
