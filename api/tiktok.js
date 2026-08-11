export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      message: "Method not allowed"
    });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      message: "Parameter url wajib diisi"
    });
  }

  try {
    const target = new URL(
      "https://api.azbry.com/api/download/tiktok"
    );

    target.searchParams.set("url", url);

    const response = await fetch(target.toString());

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        data: text
      };
    }

    return res.status(response.status).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: response.ok,
      result: data.result || data
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      creator: "DINSTORE",
      source: "TikTok — DINSTORE",
      status: false,
      message: "Gagal menghubungi provider"
    });
  }
}
