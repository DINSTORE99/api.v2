import { useState } from "react";
import "./style.css";

const API_BASE = "https://api-v2-wheat.vercel.app";

const ENDPOINTS = [
  {
    category: "DOWNLOAD",
    icon: "⬇",
    title: "TikTok Downloader",
    path: "/api/tiktok",
    description: "Download video TikTok dan mendapatkan informasi video.",
    params: [
      {
        name: "url",
        label: "URL",
        required: true,
        type: "text",
        placeholder: "https://vt.tiktok.com/ZS4c5fT85/",
        example: "https://vt.tiktok.com/ZS4c5fT85/",
        description: "URL video TikTok."
      }
    ]
  },

  {
    category: "DOWNLOAD",
    icon: "◎",
    title: "Instagram Downloader",
    path: "/api/instagram",
    description: "Download video Instagram Reels dan mendapatkan informasi media.",
    params: [
      {
        name: "url",
        label: "URL",
        required: true,
        type: "text",
        placeholder: "https://www.instagram.com/reel/...",
        example:
          "https://www.instagram.com/reel/Db5Z25ThjwH/",
        description: "URL Instagram Reel."
      },
      {
        name: "format",
        label: "FORMAT",
        required: false,
        type: "text",
        placeholder: "mp4",
        example: "mp4",
        description: "Format media. Default: mp4."
      }
    ]
  },

  {
    category: "DOWNLOAD",
    icon: "▣",
    title: "All Downloader",
    path: "/api/download/allinonev2",
    description: "Downloader all-in-one untuk berbagai media.",
    params: [
      {
        name: "url",
        label: "URL",
        required: true,
        type: "text",
        placeholder: "Masukkan URL media...",
        example:
          "https://www.instagram.com/reel/Db5Z25ThjwH/",
        description: "URL media yang ingin diproses."
      },
      {
        name: "format",
        label: "FORMAT",
        required: false,
        type: "text",
        placeholder: "mp4",
        example: "mp4",
        description: "Format output. Contoh: mp4 atau mp3."
      }
    ]
  },

  {
    category: "TOOLS",
    icon: "▦",
    title: "QRIS Generator",
    path: "/api/qrisgen",
    description: "Generate QRIS dinamis berdasarkan nominal.",
    params: [
      {
        name: "url",
        label: "QRIS URL",
        required: true,
        type: "text",
        placeholder: "https://...",
        example:
          "https://i.ibb.co.com/bS14m00/qr-ID1025391659253-16-10-25-176062985-1760629853524.jpg",
        description: "URL QRIS statis."
      },
      {
        name: "nominal",
        label: "NOMINAL",
        required: true,
        type: "number",
        placeholder: "10000",
        example: "10000",
        description: "Nominal pembayaran."
      }
    ]
  }
];

function App() {
  const [openCategory, setOpenCategory] = useState("DOWNLOAD");
  const [openEndpoint, setOpenEndpoint] = useState("/api/tiktok");

  const [values, setValues] = useState({});
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState({});
  const [copied, setCopied] = useState("");

  const categories = [
    ...new Set(ENDPOINTS.map((item) => item.category))
  ];

  const updateValue = (path, name, value) => {
    setValues((prev) => ({
      ...prev,
      [path]: {
        ...(prev[path] || {}),
        [name]: value
      }
    }));
  };

  const loadExample = (endpoint) => {
    const exampleValues = {};

    endpoint.params.forEach((param) => {
      if (param.example !== undefined) {
        exampleValues[param.name] = param.example;
      }
    });

    setValues((prev) => ({
      ...prev,
      [endpoint.path]: exampleValues
    }));
  };

  const executeEndpoint = async (endpoint) => {
    const params = values[endpoint.path] || {};

    for (const parameter of endpoint.params) {
      if (parameter.required && !params[parameter.name]) {
        setResponses((prev) => ({
          ...prev,
          [endpoint.path]: {
            success: false,
            message: `Parameter ${parameter.name} wajib diisi`
          }
        }));
        return;
      }
    }

    setLoading((prev) => ({
      ...prev,
      [endpoint.path]: true
    }));

    setResponses((prev) => ({
      ...prev,
      [endpoint.path]: null
    }));

    try {
      const query = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          query.set(key, value);
        }
      });

      const requestUrl = `${API_BASE}${endpoint.path}?${query.toString()}`;

      const response = await fetch(requestUrl);

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        try {
          data = JSON.parse(text);
        } catch {
          data = {
            success: response.ok,
            status: response.status,
            data: text
          };
        }
      }

      setResponses((prev) => ({
        ...prev,
        [endpoint.path]: {
          ...data,
          _meta: {
            status: response.status,
            request: requestUrl
          }
        }
      }));
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        [endpoint.path]: {
          success: false,
          message: "Gagal menghubungi API",
          error: error.message
        }
      }));
    } finally {
      setLoading((prev) => ({
        ...prev,
        [endpoint.path]: false
      }));
    }
  };

  const copyText = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(id);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch {
      console.log("Copy gagal");
    }
  };

  const getRequestUrl = (endpoint) => {
    const params = values[endpoint.path] || {};
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, value);
      }
    });

    return `${API_BASE}${endpoint.path}?${query.toString()}`;
  };

  const grouped = categories.map((category) => ({
    category,
    endpoints: ENDPOINTS.filter(
      (endpoint) => endpoint.category === category
    )
  }));

  return (
    <div className="app">

      {/* BACKGROUND */}
      <div className="background-grid" />
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      {/* HEADER */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">D</div>

          <div>
            <div className="brand-name">
              DINSTORE
            </div>

            <div className="brand-sub">
              API DOCUMENTATION
            </div>
          </div>
        </div>

        <div className="server-status">
          <span className="status-dot" />
          <span>ONLINE</span>
        </div>
      </header>

      {/* HERO */}
      <main className="container">

        <section className="hero">
          <div className="eyebrow">
            REST API
          </div>

          <h1>
            DINSTORE <span>API</span>
          </h1>

          <p>
            API downloader dan tools sederhana
            untuk kebutuhan aplikasi kamu.
          </p>

          <div className="hero-status">
            <span className="status-dot" />

            <div>
              <strong>All Systems Operational</strong>
              <small>
                Server berjalan normal
              </small>
            </div>
          </div>
        </section>

        {/* API LIST */}
        <section className="api-section">

          {grouped.map((group) => {
            const categoryOpen =
              openCategory === group.category;

            return (
              <div
                className="category"
                key={group.category}
              >

                {/* CATEGORY HEADER */}
                <button
                  className={`category-header ${
                    categoryOpen ? "active" : ""
                  }`}
                  onClick={() =>
                    setOpenCategory(
                      categoryOpen ? "" : group.category
                    )
                  }
                >
                  <div className="category-left">

                    <div className="category-icon">
                      {group.endpoints[0]?.icon || "◆"}
                    </div>

                    <div>
                      <div className="category-name">
                        {group.category}
                      </div>

                      <div className="category-count">
                        {group.endpoints.length} ENDPOINT
                        {group.endpoints.length > 1
                          ? "S"
                          : ""}
                      </div>
                    </div>

                  </div>

                  <span className="arrow">
                    {categoryOpen ? "⌃" : "⌄"}
                  </span>
                </button>

                {/* CATEGORY CONTENT */}
                {categoryOpen && (
                  <div className="category-content">

                    {group.endpoints.map((endpoint) => {
                      const isOpen =
                        openEndpoint === endpoint.path;

                      const response =
                        responses[endpoint.path];

                      const isLoading =
                        loading[endpoint.path];

                      return (
                        <article
                          className={`endpoint-card ${
                            isOpen ? "expanded" : ""
                          }`}
                          key={endpoint.path}
                        >

                          {/* ENDPOINT TITLE */}
                          <button
                            className="endpoint-head"
                            onClick={() =>
                              setOpenEndpoint(
                                isOpen
                                  ? ""
                                  : endpoint.path
                              )
                            }
                          >

                            <div className="method">
                              GET
                            </div>

                            <div className="endpoint-info">
                              <div className="endpoint-path">
                                {endpoint.path}
                              </div>

                              <div className="endpoint-title">
                                {endpoint.title}
                              </div>
                            </div>

                            <div className="head-actions">

                              <button
                                className="copy-button"
                                onClick={(event) => {
                                  event.stopPropagation();

                                  copyText(
                                    `${API_BASE}${endpoint.path}`,
                                    `path-${endpoint.path}`
                                  );
                                }}
                              >
                                {copied ===
                                `path-${endpoint.path}`
                                  ? "✓"
                                  : "▣"}
                              </button>

                              <span className="expand-button">
                                {isOpen ? "⌃" : "⌄"}
                              </span>

                            </div>

                          </button>

                          {/* CONTENT */}
                          {isOpen && (
                            <div className="endpoint-body">

                              <p className="endpoint-description">
                                {endpoint.description}
                              </p>

                              {/* REQUEST */}
                              <div className="request-box">

                                <div className="request-label">
                                  REQUEST
                                </div>

                                <div className="request-url">
                                  <span className="green">
                                    GET
                                  </span>

                                  <span>
                                    {endpoint.path}
                                  </span>
                                </div>

                                <div className="request-preview">
                                  {getRequestUrl(endpoint)}
                                </div>

                              </div>

                              {/* PARAMETERS */}
                              <div className="parameters-title">
                                Parameters
                              </div>

                              <div className="parameters">

                                {endpoint.params.map(
                                  (parameter) => (
                                    <div
                                      className="parameter"
                                      key={
                                        parameter.name
                                      }
                                    >

                                      <div className="parameter-top">

                                        <div className="parameter-name">
                                          <span>
                                            •{" "}
                                            {
                                              parameter.label
                                            }
                                          </span>

                                          <span
                                            className={
                                              parameter.required
                                                ? "req"
                                                : "opt"
                                            }
                                          >
                                            {parameter.required
                                              ? "REQ"
                                              : "OPT"}
                                          </span>
                                        </div>

                                      </div>

                                      <div className="input-wrapper">

                                        <input
                                          type={
                                            parameter.type ||
                                            "text"
                                          }
                                          value={
                                            values[
                                              endpoint.path
                                            ]?.[
                                              parameter
                                                .name
                                            ] || ""
                                          }
                                          onChange={(e) =>
                                            updateValue(
                                              endpoint.path,
                                              parameter.name,
                                              e.target
                                                .value
                                            )
                                          }
                                          placeholder={
                                            parameter.placeholder
                                          }
                                        />

                                        <span className="input-icon">
                                          ↗
                                        </span>

                                      </div>

                                      <div className="parameter-description">
                                        {
                                          parameter.description
                                        }
                                      </div>

                                    </div>
                                  )
                                )}

                              </div>

                              {/* EXAMPLE */}
                              <button
                                className="example-button"
                                onClick={() =>
                                  loadExample(
                                    endpoint
                                  )
                                }
                              >
                                💡 EXAMPLE
                              </button>

                              {/* EXECUTE */}
                              <button
                                className={`execute-button ${
                                  isLoading
                                    ? "loading"
                                    : ""
                                }`}
                                onClick={() =>
                                  executeEndpoint(
                                    endpoint
                                  )
                                }
                                disabled={isLoading}
                              >
                                {isLoading
                                  ? "LOADING..."
                                  : "EXECUTE"}
                              </button>

                              {/* RESPONSE */}
                              {response && (
                                <div className="response-section">

                                  <div className="response-header">

                                    <div>
                                      <span>
                                        RESPONSE
                                      </span>

                                      {response._meta && (
                                        <small
                                          className={
                                            response
                                              ._meta
                                              .status >=
                                            200 &&
                                            response
                                              ._meta
                                              .status <
                                              300
                                              ? "success-code"
                                              : "error-code"
                                          }
                                        >
                                          HTTP{" "}
                                          {
                                            response
                                              ._meta
                                              .status
                                          }
                                        </small>
                                      )}
                                    </div>

                                    <button
                                      onClick={() =>
                                        copyText(
                                          JSON.stringify(
                                            response,
                                            null,
                                            2
                                          ),
                                          `response-${endpoint.path}`
                                        )
                                      }
                                    >
                                      {copied ===
                                      `response-${endpoint.path}`
                                        ? "COPIED"
                                        : "COPY"}
                                    </button>

                                  </div>

                                  <pre className="json-response">
                                    {JSON.stringify(
                                      response,
                                      null,
                                      2
                                    )}
                                  </pre>

                                </div>
                              )}

                            </div>
                          )}

                        </article>
                      );
                    })}

                  </div>
                )}

              </div>
            );
          })}

        </section>

        {/* FOOTER */}
        <footer className="footer">

          <div className="footer-logo">
            DINSTORE API
          </div>

          <div>
            API v1.0.0
          </div>

          <div>
            © {new Date().getFullYear()} DINSTORE
          </div>

        </footer>

      </main>
    </div>
  );
}

export default App;
