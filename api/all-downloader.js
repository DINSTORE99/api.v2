export default async function handler(req, res) {
  // ==========================================
  // DINSTORE ALL DOWNLOADER API
  // ==========================================

  const BRAND = "DINSTORE";

  // ==========================================
  // METHOD CHECK
  // ==========================================

  if (req.method !== "GET") {
    return res.status(405).json({
      creator: BRAND,
      source: "DINSTORE All Downloader",
      status: false,
      message: "Method not allowed"
    });
  }

  // ==========================================
  // GET URL
  // ==========================================

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      creator: BRAND,
      source: "DINSTORE All Downloader",
      status: false,
      message: "Parameter url wajib diisi",
      example: "/api/all-downloader?url=https://..."
    });
  }

  // ==========================================
  // VALIDATE URL
  // ==========================================

  let parsedUrl;

  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({
      creator: BRAND,
      source: "DINSTORE All Downloader",
      status: false,
      message: "URL tidak valid"
    });
  }

  const host = parsedUrl.hostname
    .toLowerCase()
    .replace(/^www\./, "");

  // ==========================================
  // DETECT PLATFORM
  // ==========================================

  let platform = null;

  // TikTok
  if (
    host === "tiktok.com" ||
    host.endsWith(".tiktok.com")
  ) {
    platform = "tiktok";
  }

  // Instagram
  else if (
    host === "instagram.com" ||
    host.endsWith(".instagram.com")
  ) {
    platform = "instagram";
  }

  // ==========================================
  // PLATFORM NOT SUPPORTED
  // ==========================================

  if (!platform) {
    return res.status(400).json({
      creator: BRAND,
      source: "DINSTORE All Downloader",
      status: false,
      message: "Platform belum didukung",
      platform: host,
      supported: [
        "TikTok",
        "Instagram"
      ]
    });
  }

  // ==========================================
  // TIKTOK
  // ==========================================

  if (platform === "tiktok") {
    try {
      const api = new URL(
        "https://api.azbry.com/api/download/tiktok"
      );

      api.searchParams.set("url", url);

      const response = await fetch(api.toString());

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        return res.status(502).json({
          creator: BRAND,
          source: "TikTok — DINSTORE",
          status: false,
          platform: "tiktok",
          message: "Response provider bukan JSON"
        });
      }

      if (!response.ok) {
        return res.status(response.status).json({
          creator: BRAND,
          source: "TikTok — DINSTORE",
          status: false,
          platform: "tiktok",
          message: "Provider TikTok error",
          provider_status: response.status
        });
      }

      return res.status(200).json({
        creator: BRAND,
        source: "TikTok — DINSTORE",
        status: true,
        platform: "tiktok",
        result: data.result || data
      });

    } catch (error) {
      console.error("TikTok Error:", error);

      return res.status(500).json({
        creator: BRAND,
        source: "TikTok — DINSTORE",
        status: false,
        platform: "tiktok",
        message: "Gagal menghubungi provider TikTok"
      });
    }
  }

  // ==========================================
  // INSTAGRAM
  // ==========================================

  if (platform === "instagram") {
    try {
      const api = new URL(
        "https://api.azbry.com/api/download/allinonev2"
      );

      api.searchParams.set("url", url);
      api.searchParams.set("format", "mp4");

      const response = await fetch(api.toString());

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        return res.status(502).json({
          creator: BRAND,
          source: "Instagram — DINSTORE",
          status: false,
          platform: "instagram",
          message: "Response provider bukan JSON"
        });
      }

      if (!response.ok) {
        return res.status(response.status).json({
          creator: BRAND,
          source: "Instagram — DINSTORE",
          status: false,
          platform: "instagram",
          message: "Provider Instagram error",
          provider_status: response.status
        });
      }

      return res.status(200).json({
        creator: BRAND,
        source: "Instagram — DINSTORE",
        status: true,
        platform: "instagram",
        result: data.result || data
      });

    } catch (error) {
      console.error("Instagram Error:", error);

      return res.status(500).json({
        creator: BRAND,
        source: "Instagram — DINSTORE",
        status: false,
        platform: "instagram",
        message: "Gagal menghubungi provider Instagram"
      });
    }
  }

  // ==========================================
  // FALLBACK
  // ==========================================

  return res.status(400).json({
    creator: BRAND,
    source: "DINSTORE All Downloader",
    status: false,
    message: "Platform tidak dapat diproses"
  });
}
