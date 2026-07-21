const BASE_API = "https://api.siputzx.my.id/api";

export default async function handler(req, res) {
  try {
    const { path = [], ...query } = req.query;

    // Gabungkan path, contoh: m/brat
    const endpoint = Array.isArray(path)
      ? path.join("/")
      : path;

    // Query string
    const params = new URLSearchParams(query);

    // URL tujuan
    const url = `${BASE_API}/${endpoint}?${params.toString()}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "User-Agent": "DIN STORE API"
      }
    });

    // Salin status
    res.status(response.status);

    // Salin content-type
    const type = response.headers.get("content-type") || "";
    res.setHeader("Content-Type", type);

    // Jika gambar/video/audio
    if (
      type.startsWith("image/") ||
      type.startsWith("video/") ||
      type.startsWith("audio/")
    ) {
      const buffer = Buffer.from(await response.arrayBuffer());
      return res.send(buffer);
    }

    // Jika JSON
    if (type.includes("application/json")) {
      const json = await response.json();
      return res.json(json);
    }

    // Selain itu kirim text
    const text = await response.text();
    return res.send(text);

  } catch (err) {

    return res.status(500).json({
      status: false,
      message: err.message
    });

  }
}
