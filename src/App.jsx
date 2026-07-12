import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [trade, setTrade] = useState("");


  

const [area, setArea] = useState("");
  const [tileSize, setTileSize] = useState("600x600");
  const [customTileWidth, setCustomTileWidth] = useState("");
  const [customTileHeight, setCustomTileHeight] = useState("");
  const [wastage, setWastage] = useState("10");
  const [labourRate, setLabourRate] = useState("");
  const [tilePrice, setTilePrice] = useState("");
  const [adhesivePrice, setAdhesivePrice] = useState("");
  const [groutPrice, setGroutPrice] = useState("");
  const [groutJoint, setGroutJoint] = useState("3");
  const [profit, setProfit] = useState("15");
  const [profitType, setProfitType] = useState("percent");

  const roomArea = Number(area || 0);
  const totalArea = roomArea + roomArea * (Number(wastage || 0) / 100);

  const tileSizes = {
    "600x600": [600, 600],
    "300x600": [300, 600],
    "300x300": [300, 300],
    "100x200 Metro": [100, 200],
    Custom: [Number(customTileWidth || 0), Number(customTileHeight || 0)],
  };

  const [tileW, tileH] = tileSizes[tileSize];
  const tileArea = (tileW / 1000) * (tileH / 1000);
  const tilesNeeded =
  tileArea > 0
    ? Math.ceil(
        (totalArea / tileArea) *
        (1 + Number(wastage || 0) / 100)
      )
    : 0;

  const adhesiveBags = Math.ceil(totalArea / 5);
  const groutKg = totalArea * 0.4;
  const primerLitres = Math.ceil(totalArea / 10);
  const siliconeTubes = Math.ceil(roomArea / 8);

  const materialCost =
  totalArea * Number(tilePrice || 0) +
  adhesiveBags * Number(adhesivePrice || 0) +
  groutKg * Number(groutPrice || 0);

  const labourCost = roomArea * Number(labourRate || 0);
  const subtotal = materialCost + labourCost;
  const profitAmount = subtotal * (Number(profit || 0) / 100);
  const quoteTotal = subtotal + profitAmount;

  return (
    <main className="app">
      <header className="hero">
        <div className="logo">🏠</div>
        <p className="tag">Built for the way you work</p>
        <h1>BUILD IT PRO</h1>
        <p className="sub">From qoute to completion. Everything your business needs in one place.</p>
      </header>

      

      {page === "home" && (
  <section className="dashboard">
    <div className="dashboard-top">
      <div>
        <p className="dashboard-brand">BUILD IT PRO</p>
        <p className="dashboard-tagline">
          Built for the way you work
        </p>
      </div>

      <button className="icon-button" type="button">
        🔔
      </button>
    </div>

    <div className="dashboard-welcome">
      <p>Good evening,</p>
      <h2>Callum 👋</h2>
      <span>What would you like to do?</span>
    </div>

    <div className="dashboard-grid">
      <button
        className="dashboard-card"
        type="button"
        onClick={() => setPage("tiling")}
      >
        <span className="card-icon">🧮</span>
        <strong>Tiling Calculator Pro</strong>
        <small>Material and labour estimator</small>
      </button>

      <button
        className="dashboard-card"
        type="button"
        onClick={() => setPage("quotes")}
      >
        <span className="card-icon">📋</span>
        <strong>Quotes</strong>
        <small>Create and manage quotes</small>
      </button>

      <button
        className="dashboard-card"
        type="button"
        onClick={() => setPage("jobs")}
      >
        <span className="card-icon">🏗️</span>
        <strong>Jobs</strong>
        <small>Manage active projects</small>
      </button>

      <button
        className="dashboard-card"
        type="button"
        onClick={() => setPage("documents")}
      >
        <span className="card-icon">📄</span>
        <strong>Documents</strong>
        <small>RAMS and method statements</small>
      </button>
    </div>

    <div className="recent-section">
      <div className="section-heading">
        <h3>Recent activity</h3>
        <button type="button">View all</button>
      </div>

      <div className="empty-state">
        <p>No recent quotes or active jobs yet.</p>
      </div>
    </div>

    <p className="dashboard-philosophy">
      From quote to job.
      <br />
      <strong>Don’t just build it. Build It Pro.</strong>
    </p>
  </section>
)}

      {page === "quotes" && (
        <section className="panel">
          <h2>Smart Quote Builder</h2>
          <p>What are we pricing today?</p>

          <div className="grid">
            <button onClick={() => setTrade("tiling")}>🧱 Tiling</button>
            <button onClick={() => setTrade("screed")}>🏗️ Screed</button>
            <button onClick={() => setTrade("bathroom")}>🚿 Bathroom</button>
            <button onClick={() => setTrade("extension")}>🏠 Extension</button>
          </div>

          {trade === "tiling" && (
            <div className="quote-box">
              <div className="calculator-header">
  


return (
  <h2>Tiling Calculator Pro</h2>
  <p>Professional tiling quote calculator</p>
</div>
<div className="progress">
  <div className="progress-fill"></div>
</div> 

<p className="step">Step 1 of 4</p>

              <div className="form-grid">
                <label>
                  <h4>Area</h4>
  Total area to tile m²
  <input value={area} onChange={(e) => setArea(e.target.value)} />
</label>

<h4>Tiles</h4>
                <label>
                  Tile size
                  <select value={tileSize} onChange={(e) => setTileSize(e.target.value)}>
                    <option>600x600</option>
                    <option>300x600</option>
                    <option>300x300</option>
                    <option>100x200 Metro</option>
                    <option>Custom</option>
                  </select>
                </label>

                {tileSize === "Custom" && (
                  <>
                    <label>
                      Custom tile width mm
                      <input value={customTileWidth} onChange={(e) => setCustomTileWidth(e.target.value)} />
                    </label>

                    <label>
                      Custom tile height mm
                      <input value={customTileHeight} onChange={(e) => setCustomTileHeight(e.target.value)} />
                    </label>
                  </>
                )}

                <label>
  Wastage %
  <input
    type="number"
    min="0"
    step="1"
    value={wastage}
    onChange={(e) => setWastage(e.target.value)}
  />
</label>

<h4>Pricing</h4>
                <label>
                  Labour £ per m²
                  <input value={labourRate} onChange={(e) => setLabourRate(e.target.value)} />
                </label>

                <label>
                  Tile price £ per m²
                  <input value={tilePrice} onChange={(e) => setTilePrice(e.target.value)} />
                </label>

                <label>
                  Adhesive price per 20kg bag
                  <input value={adhesivePrice} onChange={(e) => setAdhesivePrice(e.target.value)} />
                </label>

                <label>
                  <label>
  Grout joint width mm
  <input
    value={groutJoint}
    onChange={(e) => setGroutJoint(e.target.value)}
  />
</label>
                  Grout price per kg
                  <input value={groutPrice} onChange={(e) => setGroutPrice(e.target.value)} />
                </label>

                <label>
  Profit type
  <select value={profitType} onChange={(e) => setProfitType(e.target.value)}>
    <option value="percent">Percentage %</option>
    <option value="fixed">Fixed £</option>
  </select>
</label>

<label>
  Profit {profitType === "percent" ? "%" : "£"}
  <input value={profit} onChange={(e) => setProfit(e.target.value)} />
</label>
              </div>
              
              <button className="quote-button">
  Calculate Quote →
</button>
              <div className="result">
                <p>Room area <strong>{roomArea.toFixed(2)}m²</strong></p>
                <p>Total area with wastage <strong>{totalArea.toFixed(2)}m²</strong></p>
                <p>Tiles needed <strong>{tilesNeeded}</strong></p>
                <p>20kg adhesive bags <strong>{adhesiveBags}</strong></p>
                <p>Grout needed <strong>{groutKg.toFixed(1)}kg</strong></p>
                
                <hr />
                <p>Material cost <strong>£{materialCost.toFixed(2)}</strong></p>
                <p>Labour cost <strong>£{labourCost.toFixed(2)}</strong></p>
                <p>Profit <strong>£{profitAmount.toFixed(2)}</strong></p>
                <p className="total">Suggested quote <strong>£{quoteTotal.toFixed(2)}</strong></p>
              </div>
            </div>
          )}
        </section>
      )}

      {page !== "home" && page !== "quotes" && (
        <section className="panel">
          <h2>{page}</h2>
          <p>This section is coming next.</p>
        </section>
      )}
    </main>
  );
}

export default App;