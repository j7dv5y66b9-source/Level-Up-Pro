import { useState } from "react";
import "./App.css";

const pages = {
  home: "Home",
  quotes: "Quotes",
  jobs: "Jobs",
  customers: "Customers",
  merchants: "Merchants",
  diary: "Diary",
  ai: "AI Site Manager",
};

function App() {
  const [page, setPage] = useState("home");

  return (
    <main className="app">
      <section className="hero">
        <div className="logo">🏠</div>
        <p className="tag">Built for Builders</p>
        <h1>Build It Pro</h1>
        <p className="sub">Built by Level Up.</p>
      </section>

      <section className="grid">
        {Object.entries(pages).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={page === key ? "active" : ""}
          >
            {label}
          </button>
        ))}
      </section>

      <section className="panel">
        <h2>{pages[page]}</h2>
        <p>
          {page === "home" && "Your business command centre."}
          {page === "quotes" && "Smart quote engine coming next."}
          {page === "jobs" && "Track live jobs, staff and materials."}
          {page === "customers" && "Properties, customers and tea ratings."}
          {page === "merchants" && "Compare suppliers and material prices."}
          {page === "diary" && "Daily site notes and progress updates."}
          {page === "ai" && "AI Site Manager is on the roadmap."}
        </p>
      </section>
    </main>
  );
}

export default App;