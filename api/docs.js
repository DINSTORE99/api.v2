{
  "success": true,
  "creator": "DINSTORE",
  "name": "DINSTORE API",
  "version": "1.0.0",
  "categories": [
    {
      "name": "Downloader",
      "icon": "download",
      "endpoints": [
        {
          "name": "TikTok Downloader",
          "method": "GET",
          "path": "/api/tiktok",
          "description": "Download video TikTok tanpa watermark.",
          "parameters": [
            {
              "name": "url",
              "type": "string",
              "required": true,
              "description": "URL TikTok"
            }
          ]
        }
      ]
    }
  ]
}
