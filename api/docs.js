// api/docs.js

export default function handler(req, res) {
  res.status(200).json({
    success: true,
    creator: "DINSTORE",
    name: "DINSTORE API",
    version: "1.0.0",

    categories: [
      {
        name: "Downloader",
        icon: "download",
        endpoints: [
          {
            name: "TikTok Downloader",
            method: "GET",
            path: "/api/tiktok",
            description: "Download video TikTok.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL video TikTok"
              }
            ],
            example:
              "/api/tiktok?url=https://vt.tiktok.com/ZS4c5fT85/"
          },

          {
            name: "Instagram Downloader",
            method: "GET",
            path: "/api/instagram",
            description: "Download video atau media Instagram.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL Instagram"
              }
            ],
            example:
              "/api/instagram?url=https://www.instagram.com/reel/..."
          }
        ]
      },

      {
        name: "Tools",
        icon: "tools",
        endpoints: [
          {
            name: "QRIS Generator",
            method: "GET",
            path: "/api/qrisgen",
            description: "Generate QRIS berdasarkan nominal.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL QRIS"
              },
              {
                name: "nominal",
                type: "number",
                required: true,
                description: "Nominal pembayaran"
              }
            ],
            example:
              "/api/qrisgen?url=https://example.com/qris.jpg&nominal=10000"
          }
        ]
      }
    ]
  });
}
