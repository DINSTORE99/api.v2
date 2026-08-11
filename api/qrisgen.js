export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { nominal, url } = req.query;

  if (!nominal || !url) {
    return res.status(400).json({
      success: false,
      message: "Parameter nominal dan url wajib diisi"
    });
  }

  try {
    const target = new URL(
      "https://api.azbry.com/api/tools/qrisgen"
    );

    target.searchParams.set("nominal", nominal);
    target.searchParams.set("url", url);

    const response = await fetch(target.toString());

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Provider API error"
      });
    }

    const buffer = Buffer.from(
      await response.arrayBuffer()
    );

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "image/png"
    );

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    return res.status(200).send(buffer);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi provider"
    });
  }
}
