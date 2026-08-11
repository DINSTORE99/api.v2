export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`);

    const nominal = url.searchParams.get("nominal");
    const imageUrl = url.searchParams.get("url");

    if (!nominal || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Parameter nominal dan url wajib diisi",
        example: "/api/qrisgen?nominal=10000&url=https://example.com/qr.jpg"
      });
    }

    const target = new URL(
      "https://api.azbry.com/api/tools/qrisgen"
    );

    target.searchParams.set("nominal", nominal);
    target.searchParams.set("url", imageUrl);

    const response = await fetch(target.toString());

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Provider API error",
        status: response.status
      });
    }

    const contentType =
      response.headers.get("content-type") || "image/png";

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");

    return res.status(200).send(buffer);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Gagal memproses QRIS",
      error: error.message
    });
  }
}
