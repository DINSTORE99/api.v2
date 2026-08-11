import { useState } from "react";

const menus = [
  {
    title: "SYSTEM",
    items: [
      {
        id: "health",
        name: "Health Check",
        method: "GET",
        path: "/api/health"
      }
    ]
  },
  {
    title: "DOWNLOADER",
    items: [
      {
        id: "tiktok",
        name: "TikTok Downloader",
        method: "GET",
        path: "/api/tiktok"
      },
      {
        id: "tiktokslide",
        name: "TikTok Slide",
        method: "GET",
        path: "/api/tiktokslide"
      },
      {
        id: "instagram",
        name: "Instagram Downloader",
        method: "GET",
        path: "/api/instagram"
      },
      {
        id: "allinone",
        name: "All Downloader",
        method: "GET",
        path: "/api/allinone"
      }
    ]
  },
  {
    title: "TOOLS",
    items: [
      {
        id: "qrisgen",
        name: "QRIS Generator",
        method: "GET",
        path: "/api/qrisgen"
      }
    ]
  }
];

const details = {
  health: {
    description:
      "Memeriksa status server DINSTORE API.",
    parameters: [],
    example: "/api/health"
  },

  tiktok: {
    description:
      "Download video TikTok dan mendapatkan informasi video.",
    parameters: [
      {
        name: "url",
        type: "string",
        required: true,
        description: "URL video TikTok."
      }
    ],
    example:
      "/api/tiktok?url=https://vt.tiktok.com/ZS4c5fT85/"
  },

  tiktokslide: {
    description:
      "Mengambil data slide atau foto dari postingan TikTok.",
    parameters: [
      {
        name: "url",
        type: "string",
        required: true,
        description: "URL postingan TikTok."
      }
    ],
    example:
      "/api/tiktokslide?url=https://vt.tiktok.com/ZS4c5fT85/"
  },

  instagram: {
    description:
      "Download video Instagram, termasuk MP4 dan MP3 jika tersedia.",
    parameters: [
      {
        name: "url",
        type: "string",
        required: true,
        description: "URL Reel atau posting Instagram."
      }
    ],
    example:
      "/api/instagram?url=https://www.instagram.com/reel/..."
  },

  allinone: {
    description:
      "Downloader berbagai platform dalam satu endpoint.",
    parameters: [
      {
        name: "url",
        type: "string",
        required: true,
        description: "URL media yang ingin diproses."
      },
      {
        name: "format",
        type: "string",
        required: false,
        description: "Format media, misalnya mp4 atau mp3."
      }
    ],
    example:
      "/api/allinone?url=https://www.instagram.com/reel/...&format=mp4"
  },

  qrisgen: {
    description:
      "Membuat QRIS berdasarkan nominal dan URL QRIS.",
    parameters: [
      {
        name: "nominal",
        type: "number",
        required: true,
        description: "Nominal pembayaran."
      },
      {
        name: "url",
        type: "string",
        required: true,
        description: "URL QRIS."
      }
    ],
    example:
      "/api/qrisgen?nominal=10000&url=https://example.com/qris.jpg"
  }
};

function App() {
  const [selected, setSelected] = useState("health");
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentMenu = menus
    .flatMap((group) => group.items)
    .find((item) => item.id === selected);

  const currentDetails = details[selected];

  const tryEndpoint = () => {
    const url = currentDetails.example;

    window.open(url, "_blank");
  };

  return (
    <div className="docs-app">

      {/* MOBILE TOPBAR */}

      <div className="mobile-bar">

        <button
          className="menu-button"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>

        <div className="mobile-logo">
          DINSTORE
        </div>

      </div>


      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          mobileOpen ? "sidebar-open" : ""
        }`}
      >

        <div className="logo-area">

          <div className="logo-box">
            D
          </div>

          <div className="logo-text">
            <strong>DINSTORE</strong>
            <span>API</span>
          </div>

        </div>


        <div className="api-status">

          <span className="status-dot" />

          <div>
            <strong>ONLINE</strong>
            <small>API Server</small>
          </div>

        </div>


        <div className="search-box">
          <span>⌕</span>
          <input
            placeholder="Search API..."
          />
        </div>


        <nav>

          {menus.map((group) => (

            <div
              className="menu-group"
              key={group.title}
            >

              <div className="group-title">
                {group.title}
              </div>


              {group.items.map((item) => (

                <button
                  key={item.id}
                  className={`menu-item ${
                    selected === item.id
                      ? "active"
                      : ""
                  }`}
                  onClick={() => {
                    setSelected(item.id);
                    setMobileOpen(false);
                  }}
                >

                  <span>
                    {item.name}
                  </span>

                  <small>
                    {item.method}
                  </small>

                </button>

              ))}

            </div>

          ))}

        </nav>


        <div className="sidebar-footer">
          DINSTORE API v1.0.0
        </div>

      </aside>


      {/* CONTENT */}

      <main className="content">

        <header className="top-header">

          <div>
            <span className="breadcrumb">
              DINSTORE / API
            </span>

            <h1>
              API Documentation
            </h1>
          </div>


          <div className="header-version">
            v1.0.0
          </div>

        </header>


        <div className="page">

          {/* HERO */}

          <section className="hero">

            <div className="hero-label">
              REST API
            </div>

            <h2>
              DINSTORE API
            </h2>

            <p>
              API downloader dan tools sederhana
              untuk kebutuhan aplikasi kamu.
            </p>


            <div className="hero-status">

              <span className="status-dot" />

              <div>
                <strong>
                  All Systems Operational
                </strong>

                <small>
                  Server berjalan normal
                </small>
              </div>

            </div>

          </section>


          {/* ENDPOINT DETAIL */}

          <section className="api-detail">

            <div className="detail-header">

              <div>

                <div className="detail-category">
                  ENDPOINT
                </div>

                <h3>
                  {currentMenu.name}
                </h3>

              </div>

              <span className="get-badge">
                {currentMenu.method}
              </span>

            </div>


            <p className="description">
              {currentDetails.description}
            </p>


            {/* URL */}

            <div className="request-box">

              <div className="request-label">
                REQUEST
              </div>

              <code>
                <span className="method-code">
                  {currentMenu.method}
                </span>{" "}
                {currentDetails.example}
              </code>

              <button
                className="try-button"
                onClick={tryEndpoint}
              >
                Try It →
              </button>

            </div>


            {/* PARAMETERS */}

            <div className="section">

              <h4>
                Parameters
              </h4>


              {currentDetails.parameters.length === 0 ? (

                <div className="empty-parameter">
                  Endpoint ini tidak membutuhkan
                  parameter.
                </div>

              ) : (

                <div className="parameter-list">

                  {currentDetails.parameters.map(
                    (parameter) => (

                      <div
                        className="parameter"
                        key={parameter.name}
                      >

                        <div className="parameter-top">

                          <code>
                            {parameter.name}
                          </code>

                          <span>
                            {parameter.type}
                          </span>

                          {parameter.required && (
                            <b>
                              required
                            </b>
                          )}

                        </div>

                        <p>
                          {parameter.description}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>


            {/* RESPONSE */}

            <div className="section">

              <h4>
                Example Response
              </h4>

              <div className="code-block">

                <div className="code-top">
                  <span>JSON</span>

                  <button
                    onClick={() =>
                      navigator.clipboard?.writeText(
                        `{
  "success": true,
  "creator": "DINSTORE",
  "status": true
}`
                      )
                    }
                  >
                    Copy
                  </button>
                </div>


                <pre>
{`{
  "success": true,
  "creator": "DINSTORE",
  "status": true,
  "message": "Request berhasil"
}`}
                </pre>

              </div>

            </div>


            {/* BASE URL */}

            <div className="base-url">

              <div>
                <span>
                  BASE URL
                </span>

                <code>
                  /api
                </code>
              </div>

              <span className="secure">
                HTTPS
              </span>

            </div>

          </section>


          <footer>
            © 2026 DINSTORE API · Built for developers
          </footer>

        </div>

      </main>

    </div>
  );
}

export default App;
