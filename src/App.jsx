import { useEffect, useMemo, useState } from "react";
import "./style.css";

const API_BASE = "";

function App() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openCategories, setOpenCategories] = useState({});
  const [openEndpoints, setOpenEndpoints] = useState({});
  const [values, setValues] = useState({});
  const [responses, setResponses] = useState({});
  const [loadingTest, setLoadingTest] = useState({});

  const loadDocs = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/docs`, {
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server tidak mengirim JSON. Response: ${text.slice(0, 300)}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.message || `Gagal mengambil dokumentasi (${response.status})`
        );
      }

      setDocs(data);

      if (Array.isArray(data.categories) && data.categories.length > 0) {
        const firstCategory = data.categories[0];

        setOpenCategories({
          [firstCategory.name]: true,
        });

        if (firstCategory.endpoints?.length > 0) {
          setOpenEndpoints({
            [`${firstCategory.name}-${firstCategory.endpoints[0].name}`]: true,
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil dokumentasi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const categories = useMemo(() => {
    return Array.isArray(docs?.categories) ? docs.categories : [];
  }, [docs]);

  const totalEndpoints = useMemo(() => {
    return categories.reduce(
      (total, category) =>
        total + (Array.isArray(category.endpoints) ? category.endpoints.length : 0),
      0
    );
  }, [categories]);

  const toggleCategory = (categoryName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const toggleEndpoint = (id) => {
    setOpenEndpoints((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const updateValue = (endpointId, parameterName, value) => {
    setValues((prev) => ({
      ...prev,
      [endpointId]: {
        ...(prev[endpointId] || {}),
        [parameterName]: value,
      },
    }));
  };

  const executeEndpoint = async (category, endpoint) => {
    const endpointId = `${category.name}-${endpoint.name}`;
    const params = endpoint.parameters || [];
    const currentValues = values[endpointId] || {};

    setLoadingTest((prev) => ({
      ...prev,
      [endpointId]: true,
    }));

    setResponses((prev) => ({
      ...prev,
      [endpointId]: null,
    }));

    try {
      let requestUrl = endpoint.path || endpoint.url || "";
      let requestOptions = {
        method: (endpoint.method || "GET").toUpperCase(),
        headers: {
          Accept: "application/json",
        },
      };

      const method = requestOptions.method;

      const filledParams = {};

      params.forEach((parameter) => {
        const value = currentValues[parameter.name];

        if (value !== undefined && value !== "") {
          filledParams[parameter.name] = value;
        }
      });

      if (method === "GET" || method === "DELETE") {
        const query = new URLSearchParams();

        Object.entries(filledParams).forEach(([key, value]) => {
          query.set(key, value);
        });

        if (query.toString()) {
          requestUrl +=
            (requestUrl.includes("?") ? "&" : "?") + query.toString();
        }
      } else {
        requestOptions.headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify(filledParams);
      }

      const response = await fetch(`${API_BASE}${requestUrl}`, requestOptions);

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await response.json();

        setResponses((prev) => ({
          ...prev,
          [endpointId]: {
            ok: response.ok,
            status: response.status,
            data,
            url: `${API_BASE}${requestUrl}`,
          },
        }));
      } else {
        const text = await response.text();

        setResponses((prev) => ({
          ...prev,
          [endpointId]: {
            ok: response.ok,
            status: response.status,
            data: text,
            url: `${API_BASE}${requestUrl}`,
          },
        }));
      }
    } catch (error) {
      setResponses((prev) => ({
        ...prev,
        [endpointId]: {
          ok: false,
          status: 500,
          error: error.message,
        },
      }));
    } finally {
      setLoadingTest((prev) => ({
        ...prev,
        [endpointId]: false,
      }));
    }
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Copy gagal:", error);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-screen">
          <div className="loading-logo">D</div>
          <div className="loading-spinner"></div>
          <h2>Memuat dokumentasi...</h2>
          <p>Mengambil endpoint dari DINSTORE API</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-screen">
          <div className="error-icon">!</div>

          <h1>Gagal mengambil dokumentasi</h1>

          <p>{error}</p>

          <button className="primary-btn" onClick={loadDocs}>
            Coba Lagi
          </button>

          <div className="error-help">
            <strong>Endpoint dokumentasi:</strong>
            <code>/api/docs</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {/* HEADER */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">D</div>

          <div>
            <div className="brand-name">
              {docs?.name || "DINSTORE API"}
            </div>

            <div className="brand-subtitle">
              REST API Documentation
            </div>
          </div>
        </div>

        <div className="version">
          v{docs?.version || "1.0.0"}
        </div>
      </header>

      {/* MAIN */}
      <main className="container">

        {/* HERO */}
        <section className="hero">

          <div className="eyebrow">
            REST API
          </div>

          <h1>
            {docs?.name || "DINSTORE API"}
          </h1>

          <p>
            {docs?.description ||
              "API downloader dan tools untuk kebutuhan aplikasi kamu."}
          </p>

          <div className="status-card">

            <div className="status-dot"></div>

            <div>
              <strong>All Systems Operational</strong>
              <span>Server berjalan normal</span>
            </div>

          </div>

        </section>

        {/* INFO */}
        <section className="info-grid">

          <div className="info-card">
            <span>CREATOR</span>
            <strong>{docs?.creator || "DINSTORE"}</strong>
          </div>

          <div className="info-card">
            <span>VERSION</span>
            <strong>{docs?.version || "1.0.0"}</strong>
          </div>

          <div className="info-card">
            <span>CATEGORIES</span>
            <strong>{categories.length}</strong>
          </div>

          <div className="info-card">
            <span>ENDPOINTS</span>
            <strong>{totalEndpoints}</strong>
          </div>

        </section>

        {/* CATEGORIES */}
        <section className="docs-section">

          {categories.map((category) => {

            const categoryOpen = !!openCategories[category.name];

            const endpoints = Array.isArray(category.endpoints)
              ? category.endpoints
              : [];

            return (
              <div
                className={`category ${
                  categoryOpen ? "category-open" : ""
                }`}
                key={category.name}
              >

                {/* CATEGORY HEADER */}
                <button
                  className="category-header"
                  onClick={() => toggleCategory(category.name)}
                >

                  <div className="category-left">

                    <div className="category-icon">
                      {category.icon === "download"
                        ? "↓"
                        : category.icon === "tools"
                        ? "⚙"
                        : "◈"}
                    </div>

                    <div>
                      <h2>{category.name}</h2>
                      <span>
                        {endpoints.length} endpoint
                        {endpoints.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                  </div>

                  <div className="category-arrow">
                    {categoryOpen ? "⌃" : "⌄"}
                  </div>

                </button>

                {/* ENDPOINTS */}
                {categoryOpen && (
                  <div className="endpoint-list">

                    {endpoints.map((endpoint, index) => {

                      const endpointId =
                        `${category.name}-${endpoint.name}`;

                      const endpointOpen =
                        !!openEndpoints[endpointId];

                      const method =
                        (endpoint.method || "GET").toUpperCase();

                      const parameters =
                        Array.isArray(endpoint.parameters)
                          ? endpoint.parameters
                          : [];

                      const example =
                        endpoint.example ||
                        `${endpoint.path || ""}`;

                      return (
                        <article
                          className={`endpoint ${
                            endpointOpen ? "endpoint-open" : ""
                          }`}
                          key={`${endpointId}-${index}`}
                        >

                          {/* ENDPOINT TOP */}
                          <button
                            className="endpoint-header"
                            onClick={() =>
                              toggleEndpoint(endpointId)
                            }
                          >

                            <div className="endpoint-title">

                              <div className={`method ${method.toLowerCase()}`}>
                                {method}
                              </div>

                              <div>
                                <h3>
                                  {endpoint.name}
                                </h3>

                                <code>
                                  {endpoint.path}
                                </code>
                              </div>

                            </div>

                            <div className="endpoint-actions">

                              <button
                                className="copy-btn"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  copyText(endpoint.path || "");
                                }}
                              >
                                Copy
                              </button>

                              <span>
                                {endpointOpen ? "⌃" : "⌄"}
                              </span>

                            </div>

                          </button>

                          {endpointOpen && (
                            <div className="endpoint-body">

                              {/* DESCRIPTION */}
                              {endpoint.description && (
                                <p className="endpoint-description">
                                  {endpoint.description}
                                </p>
                              )}

                              {/* REQUEST */}
                              <div className="request-box">

                                <div className="box-label">
                                  REQUEST
                                </div>

                                <div className="request-url">

                                  <span className={`method-text ${method.toLowerCase()}`}>
                                    {method}
                                  </span>

                                  <code>
                                    {endpoint.path}
                                  </code>

                                </div>

                                {/* PARAMETERS */}
                                {parameters.length > 0 && (
                                  <div className="parameters">

                                    <div className="parameter-title">
                                      Parameters
                                    </div>

                                    {parameters.map((parameter) => {

                                      const current =
                                        values[endpointId]?.[
                                          parameter.name
                                        ] || "";

                                      return (
                                        <div
                                          className="parameter"
                                          key={parameter.name}
                                        >

                                          <div className="parameter-head">

                                            <div>
                                              <strong>
                                                {parameter.name}
                                              </strong>

                                              <span className="parameter-type">
                                                {parameter.type || "string"}
                                              </span>
                                            </div>

                                            <span
                                              className={
                                                parameter.required
                                                  ? "required"
                                                  : "optional"
                                              }
                                            >
                                              {parameter.required
                                                ? "REQ"
                                                : "OPT"}
                                            </span>

                                          </div>

                                          <input
                                            value={current}
                                            onChange={(e) =>
                                              updateValue(
                                                endpointId,
                                                parameter.name,
                                                e.target.value
                                              )
                                            }
                                            placeholder={
                                              parameter.description ||
                                              `Masukkan ${parameter.name}`
                                            }
                                          />

                                          {parameter.description && (
                                            <p>
                                              {parameter.description}
                                            </p>
                                          )}

                                        </div>
                                      );
                                    })}

                                  </div>
                                )}

                                {/* EXAMPLE */}
                                {example && (
                                  <div className="example-box">

                                    <div className="example-head">
                                      <span>EXAMPLE</span>

                                      <button
                                        onClick={() =>
                                          copyText(example)
                                        }
                                      >
                                        Copy
                                      </button>
                                    </div>

                                    <code>
                                      {example}
                                    </code>

                                  </div>
                                )}

                                {/* EXECUTE */}
                                <button
                                  className="execute-btn"
                                  disabled={
                                    loadingTest[endpointId]
                                  }
                                  onClick={() =>
                                    executeEndpoint(
                                      category,
                                      endpoint
                                    )
                                  }
                                >
                                  {loadingTest[endpointId]
                                    ? "EXECUTING..."
                                    : "EXECUTE"}
                                </button>

                              </div>

                              {/* RESPONSE */}
                              {responses[endpointId] && (
                                <div className="response-section">

                                  <div className="response-title">

                                    <span>
                                      RESPONSE
                                    </span>

                                    <strong
                                      className={
                                        responses[endpointId].ok
                                          ? "success"
                                          : "failed"
                                      }
                                    >
                                      HTTP{" "}
                                      {responses[endpointId].status}
                                    </strong>

                                  </div>

                                  {responses[endpointId].url && (
                                    <div className="response-url">
                                      {responses[endpointId].url}
                                    </div>
                                  )}

                                  <pre>
                                    {responses[endpointId].error
                                      ? responses[endpointId].error
                                      : typeof responses[
                                          endpointId
                                        ].data === "string"
                                      ? responses[
                                          endpointId
                                        ].data
                                      : JSON.stringify(
                                          responses[
                                            endpointId
                                          ].data,
                                          null,
                                          2
                                        )}
                                  </pre>

                                </div>
                              )}

                              {/* STATIC RESPONSE */}
                              {endpoint.response && (
                                <div className="response-section">

                                  <div className="response-title">
                                    <span>
                                      EXAMPLE RESPONSE
                                    </span>
                                  </div>

                                  <pre>
                                    {typeof endpoint.response ===
                                    "string"
                                      ? endpoint.response
                                      : JSON.stringify(
                                          endpoint.response,
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

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span>
          © {new Date().getFullYear()}{" "}
          {docs?.creator || "DINSTORE"}
        </span>

        <span>REST API</span>
      </footer>

    </div>
  );
}

export default App;
