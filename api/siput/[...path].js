export const config = {
  runtime: "nodejs"
};

const BASE_API = "https://api.siputzx.my.id/api";

export default async function handler(req, res) {
  try {

    const { path = [], ...query } = req.query;

    const endpoint = Array.isArray(path)
      ? path.join("/")
      : path;

    const search = new URLSearchParams(query).toString();

    const url =
      `${BASE_API}/${endpoint}${search ? "?" + search : ""}`;

    const response = await fetch(url, {
      method: req.method,
      headers: {
        "User-Agent": "DIN STORE API"
      }
    });

    const contentType =
      response.headers.get("content-type") ||
      "application/octet-stream";

    res.status(response.status);

    res.setHeader("Content-Type", contentType);

    // Copy header penting
    const headers = [
      "content-disposition",
      "cache-control"
    ];

    headers.forEach(h => {
      const value = response.headers.get(h);
      if (value) res.setHeader(h, value);
    });

    // Gambar / Video / Audio
    if (
      contentType.startsWith("image/") ||
      contentType.startsWith("video/") ||
      contentType.startsWith("audio/")
    ) {

      const buffer = Buffer.from(
        await response.arrayBuffer()
      );

      return res.send(buffer);

    }

    // JSON
    if (contentType.includes("application/json")) {

      const json = await response.json();

      return res.json(json);

    }

    // Selain JSON
    const text = await response.text();

    return res.send(text);

  } catch (err) {

    return res.status(500).json({
      status: false,
      message: err.message
    });

  }
}
