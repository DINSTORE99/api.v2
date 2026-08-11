export default async function handler(req, res) {
  // =========================
  // METHOD
  // =========================
  if (req.method !== "GET") {
    return res.status(405).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      message: "Method not allowed"
    });
  }

  // =========================
  // PARAMETER
  // =========================
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      result: {
        creator: "DINSTORE",
        source: "TikTok — DINSTORE",
        status: false,
        message: "Parameter url wajib diisi"
      }
    });
  }

  // =========================
  // VALIDASI URL
  // =========================
  try {
    const parsedUrl = new URL(url);

    if (
      !parsedUrl.hostname.includes("tiktok.com")
    ) {
      return res.status(400).json({
        creator: "DINSTORE",
        source: "TikTok — DINSTORE",
        status: false,
        result: {
          creator: "DINSTORE",
          source: "TikTok — DINSTORE",
          status: false,
          message: "URL harus dari tiktok.com"
        }
      });
    }
  } catch {
    return res.status(400).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      result: {
        creator: "DINSTORE",
        source: "TikTok — DINSTORE",
        status: false,
        message: "URL tidak valid"
      }
    });
  }

  // =========================
  // PROVIDER
  // =========================
  try {
    const target = new URL(
      "https://api.azbry.com/api/download/tiktok"
    );

    target.searchParams.set("url", url);

    const response = await fetch(
      target.toString(),
      {
        method: "GET",
        headers: {
          "User-Agent": "DINSTORE API"
        }
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        message: text
      };
    }

    // =========================
    // AMBIL RESULT
    // =========================
    let result = data?.result || data;

    // =========================
    // HAPUS IDENTITAS PROVIDER
    // =========================
    if (
      result &&
      typeof result === "object" &&
      !Array.isArray(result)
    ) {
      result = {
        ...result,

        creator: "DINSTORE",

        source: "TikTok — DINSTORE"
      };
    }

    // =========================
    // RESPONSE DINSTORE
    // =========================
    return res.status(response.status).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: response.ok,

      result
    });

  } catch (error) {
    console.error("TikTok Provider Error:", error);

    return res.status(500).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      result: {
        creator: "DINSTORE",
        source: "TikTok — DINSTORE",
        status: false,
        message: "Gagal menghubungi provider"
      }
    });
  }
}
