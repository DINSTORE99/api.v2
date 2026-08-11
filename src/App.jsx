import "./style.css";

const endpoints = [
  {
    category: "DOWNLOADER",
    items: [
      {
        name: "TikTok Downloader",
        method: "GET",
        path: "/api/tiktok"
      },
      {
        name: "TikTok Slide",
        method: "GET",
        path: "/api/tiktokslide"
      },
      {
        name: "Instagram Downloader",
        method: "GET",
        path: "/api/instagram"
      },
      {
        name: "All Downloader",
        method: "GET",
        path: "/api/allinone"
      }
    ]
  },
  {
    category: "TOOLS",
    items: [
      {
        name: "QRIS Generator",
        method: "GET",
        path: "/api/qrisgen"
      }
    ]
  },
  {
    category: "SYSTEM",
    items: [
      {
        name: "Health Check",
        method: "GET",
        path: "/api/health"
      }
    ]
  }
];

function App() {
  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">
            D
          </div>

          <div>
            <strong>DINSTORE</strong>
            <span>API</span>
          </div>
        </div>

        <div className="server">
          <span />
          Server Online
        </div>

        {endpoints.map((group) => (
          <div className="endpoint-group" key={group.category}>

            <div className="category">
              {group.category}
            </div>

            {group.items.map((item) => (
              <button className="endpoint" key={item.path}>

                <div>
                  {item.name}
                </div>

                <small>
                  {item.method}
                </small>

              </button>
            ))}

          </div>
        ))}

      </aside>


      <main className="main">

        <header className="header">

          <div>
            <small>DINSTORE API</small>

            <h1>
              API Documentation
            </h1>
          </div>

          <div className="version">
            v1.0.0
          </div>

        </header>


        <section className="hero">

          <div className="badge">
            REST API
          </div>

          <h2>
            DINSTORE API
          </h2>

          <p>
            API downloader dan tools untuk kebutuhan
            aplikasi kamu.
          </p>

          <div className="status-card">

            <span className="online-dot" />

            <div>
              <strong>All Systems Operational</strong>
              <small>API server is online</small>
            </div>

          </div>

        </section>


        <section className="endpoint-list">

          <h3>
            Available Endpoints
          </h3>

          {endpoints.map((group) => (

            <div
              className="endpoint-card"
              key={group.category}
            >

              <div className="card-category">
                {group.category}
              </div>

              {group.items.map((item) => (

                <div
                  className="row"
                  key={item.path}
                >

                  <div className="row-name">
                    {item.name}
                  </div>

                  <span className="method">
                    {item.method}
                  </span>

                  <code>
                    {item.path}
                  </code>

                </div>

              ))}

            </div>

          ))}

        </section>

      </main>

    </div>
  );
}

export default App;
