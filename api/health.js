export default function handler(req, res) {
  res.status(200).json({
    success: true,
    server: "online",
    service: "DIN API",
    version: "1.0.0",
    timestamp: Date.now()
  });
}
