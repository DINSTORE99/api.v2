export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
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
        success: response.ok,
        data: text
      };
    }

    return res.status(response.status).json(data);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi provider"
    });
  }
}
