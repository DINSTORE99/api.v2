export default async function handler(req, res) {
  const SOURCE = "DramaBox — DINSTORE";

  // =========================
  // METHOD
  // =========================
  if (req.method !== "GET") {
    return res.status(405).json({
      creator: "DINSTORE",
      source: SOURCE,
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
      source: SOURCE,
      status: false,
      result: {
        creator: "DINSTORE",
        source: SOURCE,
        status: false,
        message: "Parameter url wajib diisi"
      }
    });
  }

  // =========================
  // VALIDASI URL
  // =========================
  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      creator: "DINSTORE",
      source: SOURCE,
      status: false,
      result: {
        creator: "DINSTORE",
        source: SOURCE,
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
      "https://api.azbry.com/api/download/dramabox"
    );

    target.searchParams.set("url", url);

    const response = await fetch(target.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "DINSTORE API",
        "Accept": "application/json"
      }
    });

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
    let result = data?.result ?? data;

    // =========================
    // BRANDING DINSTORE
    // =========================
    if (
      result &&
      typeof result === "object" &&
      !Array.isArray(result)
    ) {
      result = {
        ...result,
        creator: "DINSTORE",
        source: SOURCE
      };
    }

    // =========================
    // RESPONSE
    // =========================
    return res.status(response.status).json({
      creator: "DINSTORE",
      source: SOURCE,
      status: response.ok,
      result
    });

  } catch (error) {
    console.error(
      "DramaBox Provider Error:",
      error
    );

    return res.status(500).json({
      creator: "DINSTORE",
      source: SOURCE,
      status: false,
      result: {
        creator: "DINSTORE",
        source: SOURCE,
        status: false,
        message: "Gagal menghubungi provider"
      }
    });
  }
}
