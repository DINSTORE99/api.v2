export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      creator: "DINSTORE",
      status: false,
      message: "Method not allowed"
    });
  }

  return res.status(200).json({
    success: true,
    creator: "DINSTORE",
    name: "DINSTORE API",
    version: "1.0.0",
    description: "API downloader dan tools untuk kebutuhan aplikasi kamu.",
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
                description: "URL video TikTok."
              }
            ],
            example: "/api/tiktok?url=https://vt.tiktok.com/example/"
          },

          {
            name: "Instagram Downloader",
            method: "GET",
            path: "/api/instagram",
            description: "Download video Instagram dan mendapatkan media MP4.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL Instagram Reel/Post."
              },
              {
                name: "format",
                type: "string",
                required: false,
                description: "Format media. Default mp4."
              }
            ],
            example: "/api/instagram?url=https://www.instagram.com/reel/example/&format=mp4"
          },

          {
            name: "Apple Music",
            method: "GET",
            path: "/api/applemusic",
            description: "Mengambil informasi dan media Apple Music.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL Apple Music."
              }
            ],
            example: "/api/applemusic?url=https://music.apple.com/example"
          },

          {
            name: "CapCut Downloader",
            method: "GET",
            path: "/api/capcut",
            description: "Download media dari CapCut.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL CapCut."
              }
            ],
            example: "/api/capcut?url=https://www.capcut.com/example"
          },

          {
            name: "Douyin Downloader",
            method: "GET",
            path: "/api/douyin",
            description: "Download video Douyin.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL video Douyin."
              }
            ],
            example: "/api/douyin?url=https://www.douyin.com/video/example"
          },

          {
            name: "DramaBox Downloader",
            method: "GET",
            path: "/api/dramabox",
            description: "Mengambil data media DramaBox.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL DramaBox."
              }
            ],
            example: "/api/dramabox?url=https://dramabox.example"
          },

          {
            name: "Facebook Downloader",
            method: "GET",
            path: "/api/facebook",
            description: "Download video Facebook.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL video Facebook."
              }
            ],
            example: "/api/facebook?url=https://www.facebook.com/watch/example"
          },

          {
            name: "MediaFire Downloader",
            method: "GET",
            path: "/api/mediafire",
            description: "Mengambil file dari MediaFire.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL file MediaFire."
              }
            ],
            example: "/api/mediafire?url=https://www.mediafire.com/file/example"
          },

          {
            name: "Pinterest Downloader",
            method: "GET",
            path: "/api/pinterest",
            description: "Download media dari Pinterest.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL Pinterest."
              }
            ],
            example: "/api/pinterest?url=https://pin.it/example"
          },

          {
            name: "Spotify Downloader",
            method: "GET",
            path: "/api/spotify",
            description: "Mengambil informasi media Spotify.",
            parameters: [
              {
                name: "url",
                type: "string",
                required: true,
                description: "URL Spotify."
              }
            ],
            example: "/api/spotify?url=https://open.spotify.com/track/example"
          }
        ]
      }
    ]
  });
}
