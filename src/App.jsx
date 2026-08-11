import { useEffect, useState } from "react";
import "./style.css";

const API_DOCS = "/api/docs";

export default function App() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_DOCS);

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          `Server error ${response.status}: ${text.slice(0, 200)}`
        );
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server tidak mengirim JSON. Response: ${text.slice(0, 200)}`
        );
      }

      if (!data.success) {
        throw new Error("Dokumentasi API gagal dimuat.");
      }

      setDocs(data);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loader"></div>
        <h2>Memuat DINSTORE API</h2>
        <p>Mengambil dokumentasi dari server...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-icon">!</div>

        <h1>Gagal mengambil dokumentasi</h1>

        <p>{error}</p>

        <button onClick={loadDocs}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <main className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">+</div>

          <div>
            <strong>{docs.name || "DINSTORE API"}</strong>
            <span>API Documentation</span>
          </div>
        </div>

        <div className="version">
          v{docs.version || "1.0.0"}
        </div>
      </header>

      <section className="hero">
        <div className="badge">
          REST API
        </div>

        <h1>
          {docs.name || "DINSTORE API"}
        </h1>

        <p>
          API downloader dan tools sederhana
          untuk kebutuhan aplikasi kamu.
        </p>

        <div className="status">
          <span></span>

          <div>
            <strong>All Systems Operational</strong>
            <small>Server berjalan normal</small>
          </div>
        </div>
      </section>

      <section className="documentation">
        {(docs.categories || []).map((category, categoryIndex) => (
          <div
            className="category"
            key={categoryIndex}
          >
            <div className="category-title">
              <div>
                <small>
                  CATEGORY
                </small>

                <h2>
                  {category.name}
                </h2>
              </div>

              <span className="endpoint-count">
                {category.endpoints?.length || 0} EP
              </span>
            </div>

            <div className="endpoint-list">
              {(category.endpoints || []).map(
                (endpoint, endpointIndex) => (
                  <Endpoint
                    key={endpointIndex}
                    endpoint={endpoint}
                  />
                )
              )}
            </div>
          </div>
        ))}
      </section>

      <footer>
        <strong>{docs.creator || "DINSTORE"}</strong>
        <span>API Documentation</span>
      </footer>
    </main>
  );
}


function Endpoint({ endpoint }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  function buildUrl() {
    if (url) {
      return url;
    }

    return endpoint.example
      ? endpoint.example
      : endpoint.path;
  }

  async function execute() {
    try {
      setLoading(true);
      setResponse(null);

      let target = url.trim();

      if (!target) {
        target = endpoint.example || endpoint.path;
      }

      if (target.startsWith("/")) {
        target = window.location.origin + target;
      }

      const res = await fetch(target);

      const text = await res.text();

      try {
        setResponse(JSON.parse(text));
      } catch {
        setResponse({
          success: false,
          message: text.slice(0, 1000)
        });
      }
    } catch (error) {
      setResponse({
        success: false,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="endpoint">
      <div
        className="endpoint-header"
        onClick={() => setOpen(!open)}
      >
        <div>
          <div className="endpoint-path">
            <span className="method">
              {endpoint.method}
            </span>

            <code>
              {endpoint.path}
            </code>
          </div>

          <h3>
            {endpoint.name}
          </h3>
        </div>

        <button className="expand">
          {open ? "⌃" : "⌄"}
        </button>
      </div>

      {open && (
        <div className="endpoint-body">

          <p className="description">
            {endpoint.description}
          </p>

          <div className="request-box">
            <div className="request-title">
              <span>REQUEST</span>

              <span>
                {endpoint.method}
              </span>
            </div>

            <div className="request-line">
              <strong>
                {endpoint.method}
              </strong>

              <code>
                {endpoint.path}
              </code>
            </div>

            <div className="input-area">
              <input
                value={url}
                onChange={(e) =>
                  setUrl(e.target.value)
                }
                placeholder={
                  endpoint.example ||
                  "Masukkan URL..."
                }
              />

              <button
                onClick={execute}
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : "EXECUTE"}
              </button>
            </div>

            {endpoint.parameters?.length > 0 && (
              <div className="parameters">
                <h4>Parameters</h4>

                {endpoint.parameters.map(
                  (parameter, index) => (
                    <div
                      className="parameter"
                      key={index}
                    >
                      <div>
                        <code>
                          {parameter.name}
                        </code>

                        <span>
                          {parameter.type}
                        </span>

                        {parameter.required && (
                          <b>REQ</b>
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

            {response && (
              <div className="response-box">
                <div className="response-header">
                  <span>RESPONSE</span>
                </div>

                <pre>
                  {JSON.stringify(
                    response,
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
