import { useEffect, useMemo, useState } from "react";
import "./style.css";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://api-v2-wheat.vercel.app";

function App() {
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState("");

  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("ALL");
  const [activeEndpoint, setActiveEndpoint] = useState(null);

  const [params, setParams] = useState({});
  const [response, setResponse] = useState(null);
  const [requestUrl, setRequestUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mobileMenu, setMobileMenu] = useState(false);

  // =========================================================
  // LOAD DOCUMENTATION DARI API
  // =========================================================

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    setLoadingDocs(true);
    setDocsError("");

    try {
      const res = await fetch(`${API_BASE}/api/docs`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || `HTTP ${res.status}`
        );
      }

      const endpoints =
        Array.isArray(data?.endpoints)
          ? data.endpoints
          : Array.isArray(data?.data)
          ? data.data
          : [];

      setDocs(endpoints);

      if (endpoints.length > 0) {
        selectEndpoint(endpoints[0]);
      }
    } catch (err) {
      setDocsError(err.message);
    } finally {
      setLoadingDocs(false);
    }
  }

  // =========================================================
  // NORMALIZE DATA API
  // =========================================================

  function normalizeParameters(endpoint) {
    if (!endpoint) return [];

    if (Array.isArray(endpoint.parameters)) {
      return endpoint.parameters;
    }

    if (Array.isArray(endpoint.params)) {
      return endpoint.params;
    }

    return [];
  }

  function getEndpointName(endpoint) {
    return (
      endpoint?.name ||
      endpoint?.title ||
      endpoint?.label ||
      endpoint?.path ||
      "Unnamed Endpoint"
    );
  }

  function getEndpointPath(endpoint) {
    return endpoint?.path || endpoint?.endpoint || "/";
  }

  function getEndpointMethod(endpoint) {
    return (
      endpoint?.method ||
      endpoint?.type ||
      "GET"
    ).toUpperCase();
  }

  function getEndpointDescription(endpoint) {
    return (
      endpoint?.description ||
      endpoint?.desc ||
      "API endpoint"
    );
  }

  // =========================================================
  // GROUPS
  // =========================================================

  const groups = useMemo(() => {
    const result = ["ALL"];

    docs.forEach((item) => {
      const path = getEndpointPath(item);

      const parts = path
        .split("/")
        .filter(Boolean);

      if (parts.length > 1) {
        const group = parts[1].toUpperCase();

        if (!result.includes(group)) {
          result.push(group);
        }
      }
    });

    return result;
  }, [docs]);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredDocs = useMemo(() => {
    return docs.filter((item) => {
      const name = getEndpointName(item).toLowerCase();
      const path = getEndpointPath(item).toLowerCase();
      const description =
        getEndpointDescription(item).toLowerCase();

      const keyword = search.toLowerCase();

      const matchSearch =
        !keyword ||
        name.includes(keyword) ||
        path.includes(keyword) ||
        description.includes(keyword);

      let matchGroup = true;

      if (activeGroup !== "ALL") {
        const pathParts = getEndpointPath(item)
          .split("/")
          .filter(Boolean);

        matchGroup =
          pathParts[1]?.toUpperCase() === activeGroup;
      }

      return matchSearch && matchGroup;
    });
  }, [docs, search, activeGroup]);

  // =========================================================
  // SELECT ENDPOINT
  // =========================================================

  function selectEndpoint(endpoint) {
    setActiveEndpoint(endpoint);
    setResponse(null);
    setError("");
    setRequestUrl("");

    const initial = {};

    normalizeParameters(endpoint).forEach((param) => {
      initial[param.name] = param.default ?? "";
    });

    setParams(initial);
  }

  // =========================================================
  // PARAMETER CHANGE
  // =========================================================

  function changeParam(name, value) {
    setParams((old) => ({
      ...old,
      [name]: value,
    }));
  }

  // =========================================================
  // BUILD URL
  // =========================================================

  function buildUrl() {
    if (!activeEndpoint) return "";

    const path = getEndpointPath(activeEndpoint);

    const url = new URL(
      path,
      API_BASE
    );

    const method = getEndpointMethod(activeEndpoint);

    if (method === "GET") {
      Object.entries(params).forEach(
        ([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
          ) {
            url.searchParams.set(
              key,
              value
            );
          }
        }
      );
    }

    return url.toString();
  }

  // =========================================================
  // EXECUTE API
  // =========================================================

  async function executeEndpoint() {
    if (!activeEndpoint) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const method =
        getEndpointMethod(activeEndpoint);

      const url = buildUrl();

      setRequestUrl(url);

      const options = {
        method,
        headers: {
          Accept: "application/json",
        },
      };

      if (
        method !== "GET" &&
        method !== "HEAD"
      ) {
        options.headers[
          "Content-Type"
        ] = "application/json";

        options.body = JSON.stringify(params);
      }

      const res = await fetch(
        url,
        options
      );

      const contentType =
        res.headers.get(
          "content-type"
        ) || "";

      let data;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      setResponse({
        status: res.status,
        ok: res.ok,
        data,
      });
    } catch (err) {
      setError(
        err.message ||
          "Gagal menghubungi API"
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // COPY
  // =========================================================

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(
        text
      );
    } catch {}
  }

  // =========================================================
  // FORMAT RESPONSE
  // =========================================================

  function formatResponse(data) {
    if (
      typeof data === "string"
    ) {
      return data;
    }

    try {
      return JSON.stringify(
        data,
        null,
        2
      );
    } catch {
      return String(data);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="app">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          mobileMenu
            ? "sidebar-open"
            : ""
        }`}
      >
        <div className="brand">
          <div className="brand-logo">
            D
          </div>

          <div>
            <div className="brand-name">
              DINSTORE
            </div>

            <div className="brand-sub">
              API DOCUMENTATION
            </div>
          </div>
        </div>

        <div className="sidebar-title">
          ENDPOINTS
        </div>

        <div className="group-list">

          {groups.map((group) => (
            <button
              key={group}
              className={`group-btn ${
                activeGroup === group
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setActiveGroup(group);
                setMobileMenu(false);
              }}
            >
              <span>
                {group === "ALL"
                  ? "All Endpoints"
                  : group}
              </span>

              <span className="group-count">
                {group === "ALL"
                  ? docs.length
                  : docs.filter(
                      (x) =>
                        getEndpointPath(
                          x
                        )
                          .split("/")
                          .filter(
                            Boolean
                          )[1]
                          ?.toUpperCase() ===
                        group
                    ).length}
              </span>
            </button>
          ))}

        </div>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <div>
            <strong>
              API ONLINE
            </strong>

            <small>
              {API_BASE}
            </small>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="main">

        {/* HEADER */}

        <header className="header">

          <button
            className="menu-btn"
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
          >
            ☰
          </button>

          <div>
            <div className="breadcrumb">
              DINSTORE / API
            </div>

            <h1>
              API Documentation
            </h1>
          </div>

          <div className="header-right">
            <div className="online">
              <span />
              ONLINE
            </div>
          </div>

        </header>

        {/* CONTENT */}

        <div className="content">

          <section className="hero">

            <div className="hero-badge">
              REST API
            </div>

            <h2>
              DINSTORE API
            </h2>

            <p>
              API downloader dan tools
              yang tersedia dari
              server kamu.
            </p>

            <div className="server-card">

              <div className="server-icon">
                ●
              </div>

              <div>
                <strong>
                  All Systems Operational
                </strong>

                <span>
                  Server berjalan normal
                </span>
              </div>

            </div>

          </section>

          {/* SEARCH */}

          <div className="toolbar">

            <div className="search">
              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Cari endpoint..."
              />
            </div>

            <button
              className="refresh"
              onClick={loadDocs}
            >
              ↻ Refresh
            </button>

          </div>

          {/* ERROR DOCS */}

          {docsError && (
            <div className="error-box">
              <strong>
                Gagal mengambil dokumentasi
              </strong>

              <p>
                {docsError}
              </p>

              <button
                onClick={loadDocs}
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* LOADING */}

          {loadingDocs && (
            <div className="loading">
              <div className="loader" />
              Mengambil endpoint dari
              API...
            </div>
          )}

          {/* ENDPOINTS */}

          {!loadingDocs &&
            filteredDocs.map(
              (endpoint, index) => {

                const method =
                  getEndpointMethod(
                    endpoint
                  );

                const path =
                  getEndpointPath(
                    endpoint
                  );

                const parameters =
                  normalizeParameters(
                    endpoint
                  );

                const selected =
                  activeEndpoint ===
                  endpoint;

                return (
                  <section
                    className={`endpoint-card ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    key={
                      endpoint.id ||
                      path +
                        index
                    }
                  >

                    <div className="endpoint-head">

                      <div>
                        <div className="endpoint-label">
                          ENDPOINT
                        </div>

                        <h3>
                          {getEndpointName(
                            endpoint
                          )}
                        </h3>
                      </div>

                      <span
                        className={`method ${method.toLowerCase()}`}
                      >
                        {method}
                      </span>

                    </div>

                    <div className="endpoint-body">

                      <p className="description">
                        {getEndpointDescription(
                          endpoint
                        )}
                      </p>

                      {/* REQUEST */}

                      <div className="request-box">

                        <div className="box-title">
                          REQUEST
                        </div>

                        <div className="request-line">

                          <span
                            className={`method-text ${method.toLowerCase()}`}
                          >
                            {method}
                          </span>

                          <span>
                            {path}
                          </span>

                        </div>

                        <button
                          className="try-btn"
                          onClick={() =>
                            selectEndpoint(
                              endpoint
                            )
                          }
                        >
                          Try It →
                        </button>

                      </div>

                      {/* PARAMETERS */}

                      {parameters.length >
                        0 && (
                        <div className="parameters">

                          <h4>
                            Parameters
                          </h4>

                          {parameters.map(
                            (
                              param
                            ) => (
                              <div
                                className="param"
                                key={
                                  param.name
                                }
                              >

                                <div className="param-info">

                                  <div className="param-top">

                                    <span className="param-name">
                                      {
                                        param.name
                                      }
                                    </span>

                                    <span className="param-type">
                                      {
                                        param.type ||
                                        "string"
                                      }
                                    </span>

                                    {param.required && (
                                      <span className="required">
                                        REQUIRED
                                      </span>
                                    )}

                                  </div>

                                  <span className="param-desc">
                                    {
                                      param.description ||
                                      "Parameter API"
                                    }
                                  </span>

                                </div>

                              </div>
                            )
                          )}

                        </div>
                      )}

                      {/* TRY FORM */}

                      {selected && (
                        <div className="try-panel">

                          <div className="try-title">
                            TEST ENDPOINT
                          </div>

                          {parameters.length ===
                            0 && (
                            <div className="no-param">
                              Endpoint ini tidak
                              membutuhkan parameter.
                            </div>
                          )}

                          {parameters.map(
                            (
                              param
                            ) => (
                              <div
                                className="input-group"
                                key={
                                  param.name
                                }
                              >

                                <label>
                                  {
                                    param.name
                                  }

                                  {param.required && (
                                    <b>
                                      *
                                    </b>
                                  )}
                                </label>

                                <input
                                  value={
                                    params[
                                      param
                                        .name
                                    ] ||
                                    ""
                                  }
                                  onChange={(
                                    e
                                  ) =>
                                    changeParam(
                                      param.name,
                                      e.target
                                        .value
                                    )
                                  }
                                  placeholder={
                                    param.placeholder ||
                                    param.description ||
                                    `Masukkan ${param.name}`
                                  }
                                />

                              </div>
                            )
                          )}

                          <button
                            className="execute-btn"
                            onClick={
                              executeEndpoint
                            }
                            disabled={
                              loading
                            }
                          >
                            {loading
                              ? "EXECUTING..."
                              : "EXECUTE"}
                          </button>

                        </div>
                      )}

                      {/* REQUEST URL */}

                      {requestUrl && (
                        <div className="result-section">

                          <div className="result-head">
                            <span>
                              REQUEST URL
                            </span>

                            <button
                              onClick={() =>
                                copyText(
                                  requestUrl
                                )
                              }
                            >
                              Copy
                            </button>
                          </div>

                          <pre>
                            {requestUrl}
                          </pre>

                        </div>
                      )}

                      {/* ERROR */}

                      {error && (
                        <div className="response-error">
                          {error}
                        </div>
                      )}

                      {/* RESPONSE */}

                      {response && (
                        <div className="result-section">

                          <div className="result-head">

                            <span>
                              RESPONSE
                            </span>

                            <span
                              className={
                                response.ok
                                  ? "status-ok"
                                  : "status-fail"
                              }
                            >
                              HTTP{" "}
                              {
                                response.status
                              }
                            </span>

                            <button
                              onClick={() =>
                                copyText(
                                  formatResponse(
                                    response.data
                                  )
                                )
                              }
                            >
                              Copy
                            </button>

                          </div>

                          <pre className="json">
                            {formatResponse(
                              response.data
                            )}
                          </pre>

                        </div>
                      )}

                    </div>

                  </section>
                );
              }
            )}

          {!loadingDocs &&
            !docsError &&
            filteredDocs.length ===
              0 && (
              <div className="empty">
                <div>
                  Tidak ada endpoint
                </div>

                <small>
                  Coba kata pencarian
                  lainnya.
                </small>
              </div>
            )}

        </div>

      </main>
    </div>
  );
}

export default App;
