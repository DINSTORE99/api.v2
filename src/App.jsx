import { useEffect, useState } from "react";
import "./style.css";

const API_BASE = "";

export default function App() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCategory, setOpenCategory] = useState(null);
  const [openEndpoint, setOpenEndpoint] = useState(null);
  const [values, setValues] = useState({});
  const [result, setResult] = useState({});

  async function loadDocs() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/api/docs`, {
        headers: {
          Accept: "application/json"
        }
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await response.text();

        throw new Error(
          `Server tidak mengirim JSON. Response: ${text.slice(0, 100)}`
        );
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Gagal mengambil dokumentasi");
      }

      setDocs(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
  }, []);

  function updateValue(endpointIndex, parameter, value) {
    setValues((prev) => ({
      ...prev,
      [`${endpointIndex}_${parameter}`]: value
    }));
  }

  async function executeEndpoint(endpoint, endpointIndex) {
    try {
      const params = new URLSearchParams();

      for (const parameter of endpoint.parameters || []) {
        const key = `${endpointIndex}_${parameter.name}`;
        const value = values[key];

        if (parameter.required && !value) {
          alert(`${parameter.name} wajib diisi`);
          return;
        }

        if (value) {
          params.set(parameter.name, value);
        }
      }

      const url = `${endpoint.path}?${params.toString()}`;

      setResult((prev) => ({
        ...prev,
        [endpointIndex]: {
          loading: true
        }
      }));

      const response = await fetch(url);

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      setResult((prev) => ({
        ...prev,
        [endpointIndex]: {
          loading: false,
          status: response.status,
          data
        }
      }));
    } catch (error) {
      setResult((prev) => ({
        ...prev,
        [endpointIndex]: {
          loading: false,
          error: error.message
        }
      }));
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner" />
          <h2>Mengambil dokumentasi...</h2>
          <p>DINSTORE API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-page">
          <div className="error-icon">!</div>

          <h1>Gagal mengambil dokumentasi</h1>

          <p>{error}</p>

          <button onClick={loadDocs}>
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="topbar">

        <div className="brand">
          <div className="brand-logo">
            D
          </div>

          <div>
            <strong>{docs.name}</strong>
            <span>API Documentation</span>
          </div>
        </div>

        <div className="version">
          v{docs.version}
        </div>

      </header>


      <main>

        <section className="hero">

          <div className="eyebrow">
            REST API
          </div>

          <h1>
            {docs.name}
          </h1>

          <p>
            API downloader dan tools untuk kebutuhan
            aplikasi kamu.
          </p>

          <div className="status">

            <span className="status-dot" />

            <div>
              <strong>All Systems Operational</strong>
              <small>
                Server berjalan normal
              </small>
            </div>

          </div>

        </section>


        <section className="docs">

          {(docs.categories || []).map(
            (category, categoryIndex) => {

              const categoryOpen =
                openCategory === categoryIndex;

              return (
                <div
                  className="category"
                  key={categoryIndex}
                >

                  <button
                    className="category-header"
                    onClick={() =>
                      setOpenCategory(
                        categoryOpen
                          ? null
                          : categoryIndex
                      )
                    }
                  >

                    <div className="category-title">

                      <span className="category-icon">
                        {category.icon === "tools"
                          ? "⚙"
                          : "↓"}
                      </span>

                      <strong>
                        {category.name}
                      </strong>

                    </div>

                    <div className="category-count">
                      {category.endpoints?.length || 0}
                      <span>
                        {categoryOpen ? "⌃" : "⌄"}
                      </span>
                    </div>

                  </button>


                  {categoryOpen && (

                    <div className="endpoint-list">

                      {(category.endpoints || []).map(
                        (endpoint, endpointIndex) => {

                          const id =
                            `${categoryIndex}_${endpointIndex}`;

                          const isOpen =
                            openEndpoint === id;

                          const endpointResult =
                            result[id];

                          return (

                            <article
                              className="endpoint"
                              key={id}
                            >

                              <div
                                className="endpoint-head"
                                onClick={() =>
                                  setOpenEndpoint(
                                    isOpen ? null : id
                                  )
                                }
                              >

                                <div>

                                  <div className="method-row">

                                    <span className="method">
                                      {endpoint.method}
                                    </span>

                                    <code>
                                      {endpoint.path}
                                    </code>

                                  </div>

                                  <h2>
                                    {endpoint.name}
                                  </h2>

                                </div>

                                <span className="arrow">
                                  {isOpen ? "⌃" : "⌄"}
                                </span>

                              </div>


                              {isOpen && (

                                <div className="endpoint-body">

                                  <p className="description">
                                    {endpoint.description}
                                  </p>


                                  <div className="request-box">

                                    <div className="box-title">
                                      REQUEST
                                    </div>

                                    <div className="request-url">

                                      <span>
                                        {endpoint.method}
                                      </span>

                                      <code>
                                        {endpoint.path}
                                      </code>

                                    </div>

                                    <div className="params">

                                      {(endpoint.parameters || []).map(
                                        (parameter) => {

                                          const key =
                                            `${id}_${parameter.name}`;

                                          return (

                                            <div
                                              className="param"
                                              key={parameter.name}
                                            >

                                              <div className="param-label">

                                                <strong>
                                                  {parameter.name}
                                                </strong>

                                                <span>
                                                  {parameter.type}
                                                </span>

                                                {parameter.required && (
                                                  <em>
                                                    REQ
                                                  </em>
                                                )}

                                              </div>

                                              <p>
                                                {parameter.description}
                                              </p>

                                              <input
                                                type={
                                                  parameter.type ===
                                                  "number"
                                                    ? "number"
                                                    : "text"
                                                }
                                                placeholder={
                                                  parameter.name ===
                                                  "url"
                                                    ? "Masukkan URL..."
                                                    : `Masukkan ${parameter.name}...`
                                                }
                                                value={
                                                  values[key] || ""
                                                }
                                                onChange={(e) =>
                                                  updateValue(
                                                    id,
                                                    parameter.name,
                                                    e.target.value
                                                  )
                                                }
                                              />

                                            </div>

                                          );
                                        }
                                      )}

                                    </div>


                                    <button
                                      className="execute"
                                      onClick={() =>
                                        executeEndpoint(
                                          endpoint,
                                          id
                                        )
                                      }
                                    >
                                      {endpointResult?.loading
                                        ? "EXECUTING..."
                                        : "EXECUTE"}
                                    </button>

                                  </div>


                                  {endpoint.example && (

                                    <div className="example">

                                      <div className="example-title">
                                        EXAMPLE
                                      </div>

                                      <code>
                                        {endpoint.example}
                                      </code>

                                    </div>

                                  )}


                                  {endpointResult && (

                                    <div className="response">

                                      <div className="response-head">

                                        <strong>
                                          RESPONSE
                                        </strong>

                                        {endpointResult.status && (
                                          <span>
                                            HTTP{" "}
                                            {endpointResult.status}
                                          </span>
                                        )}

                                      </div>

                                      <pre>
                                        {endpointResult.error
                                          ? endpointResult.error
                                          : typeof endpointResult.data ===
                                            "string"
                                          ? endpointResult.data
                                          : JSON.stringify(
                                              endpointResult.data,
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
                        }
                      )}

                    </div>

                  )}

                </div>
              );
            }
          )}

        </section>

      </main>

      <footer>
        © {new Date().getFullYear()} {docs.creator}
      </footer>

    </div>
  );
}
