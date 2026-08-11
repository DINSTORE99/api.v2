import { useState } from "react";
import "./style.css";

const API_BASE = "https://api-v2-wheat.vercel.app";

export default function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function testTikTok() {
    if (!url.trim()) {
      setError("Masukkan URL TikTok terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const endpoint =
        `${API_BASE}/api/tiktok?url=` +
        encodeURIComponent(url.trim());

      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "API mengalami kesalahan."
        );
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Gagal menghubungi API.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setUrl("");
    setResult(null);
    setError("");
  }

  return (
    <div className="app">

      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">D</div>

          <div>
            <h1>DIN API</h1>
            <span>REST API PLATFORM</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          API ONLINE
        </div>
      </header>

      <main className="container">

        <section className="hero">
          <div className="badge">
            DIN API v1.0.0
          </div>

          <h2>
            Test TikTok API
          </h2>

          <p>
            Masukkan URL TikTok untuk mengambil informasi
            video melalui DIN API.
          </p>
        </section>

        <section className="tester">

          <div className="section-header">
            <div>
              <span className="method">GET</span>
              <strong>/api/tiktok</strong>
            </div>

            <span className="provider">
              TikTok
            </span>
          </div>

          <label>
            TikTok URL
          </label>

          <div className="input-row">
            <input
              type="url"
              placeholder="https://vt.tiktok.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  testTikTok();
                }
              }}
            />

            <button
              onClick={testTikTok}
              disabled={loading}
            >
              {loading ? "Loading..." : "Test API"}
            </button>
          </div>

          <div className="example">
            Contoh:
            <button
              onClick={() =>
                setUrl(
                  "https://vt.tiktok.com/ZS4c5fT85/"
                )
              }
            >
              Gunakan URL contoh
            </button>
          </div>

        </section>

        {error && (
          <section className="error-box">
            <strong>Request gagal</strong>
            <p>{error}</p>
          </section>
        )}

        {result && (
          <section className="result">

            <div className="result-header">
              <div>
                <span className="eyebrow">
                  RESPONSE
                </span>

                <h3>
                  API Response
                </h3>
              </div>

              <button
                className="clear"
                onClick={reset}
              >
                Clear
              </button>
            </div>

            {result.result?.thumbnail && (
              <div className="video-card">

                <img
                  src={result.result.thumbnail}
                  alt="TikTok thumbnail"
                />

                <div className="video-info">

                  <h3>
                    {result.result.title ||
                      "TikTok Video"}
                  </h3>

                  <p>
                    @{result.result.author || "Unknown"}
                  </p>

                  {result.result.duration && (
                    <span>
                      {result.result.duration}s
                    </span>
                  )}

                </div>

              </div>
            )}

            {result.result?.links && (
              <div className="downloads">

                <h3>Download Links</h3>

                {result.result.links.map(
                  (link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>
                        {index === 0
                          ? "HD Video"
                          : index === 1
                          ? "SD Video"
                          : "Watermark"}
                      </span>

                      <span>↗</span>
                    </a>
                  )
                )}

              </div>
            )}

            <div className="json-title">
              Raw JSON
            </div>

            <pre>
              {JSON.stringify(
                result,
                null,
                2
              )}
            </pre>

          </section>
        )}

      </main>

      <footer>
        <span>DIN API</span>
        <span>REST API</span>
        <span>© 2026</span>
      </footer>

    </div>
  );
}
