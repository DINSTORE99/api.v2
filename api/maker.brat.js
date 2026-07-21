export default async function handler(req, res) {
  try {
    const { text, delay = 500 } = req.query;

    if (!text) {
      return res.status(400).json({
        status: false,
        message: "Parameter text wajib diisi"
      });
    }

    const api = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&delay=${delay}`;

    const response = await fetch(api);

    if (!response.ok) {
      return res.status(response.status).json({
        status: false,
        message: "Gagal mengambil data"
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "image/png"
    );

    return res.status(200).send(buffer);

  } catch (e) {
    return res.status(500).json({
      status: false,
      message: e.message
    });
  }
}
