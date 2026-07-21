const HOST = "https://api.siputzx.my.id";

export default async function handler(req, res) {
  try {
    const { path = [], ...query } = req.query;

    const endpoint = Array.isArray(path)
      ? path.join("/")
      : path;

    const qs = new URLSearchParams(query).toString();

    const target = `${HOST}/api/${endpoint}${qs ? "?" + qs : ""}`;

    const response = await fetch(target, {
      method: req.method,
      headers: {
        "User-Agent": "DIN STORE API"
      }
    });

    const type = response.headers.get("content-type") || "";

    res.status(response.status);

    if (type) {
      res.setHeader("Content-Type", type);
    }

    if (
      type.startsWith("image/") ||
      type.startsWith("video/") ||
      type.startsWith("audio/")
    ) {
      const buffer = Buffer.from(await response.arrayBuffer());
      return res.send(buffer);
    }

    const text = await response.text();
    return res.send(text);

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e.message
    });
  }
}
