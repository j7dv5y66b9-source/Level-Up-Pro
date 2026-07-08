import { useState } from "react";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [trade, setTrade] = useState("");


  

const [area, setArea] = useState("");
  const [tileSize, setTileSize] = useState("600x600");
  const [customTileWidth, setCustomTileWidth] = useState("");
  const [customTileHeight, setCustomTileHeight] = useState("");
  const [waste, setWaste] = useState("10");
  const [labourRate, setLabourRate] = useState("55");
  const [tilePrice, setTilePrice] = useState("25");
  const [adhesivePrice, setAdhesivePrice] = useState("18");
  const [groutPrice, setGroutPrice] = useState("12");
  const [groutJoint, setGroutJoint] = useState("3");
  const [profit, setProfit] = useState("15");

  const roomArea = Number(area || 0);
  const totalArea = roomArea + roomArea * (Number(waste || 0) / 100);

  const tileSizes = {
    "600x600": [600, 600],
    "300x600": [300, 600],
    "300x300": [300, 300],
    "100x200 Metro": [100, 200],
    Custom: [Number(customTileWidth || 0), Number(customTileHeight || 0)],
  };

  const [tileW, tileH] = tileSizes[tileSize];
  const tileArea = (tileW / 1000) * (tileH / 1000);
  const tilesNeeded = tileArea > 0 ? Math.ceil(totalArea / tileArea) : 0;

  const adhesiveBags = Math.ceil(totalArea / 5);
  const groutKg = totalArea * 0.4;
  const primerLitres = Math.ceil(totalArea / 10);
  const siliconeTubes = Math.ceil(roomArea / 8);

  const materialCost =
    totalArea * Number(tilePrice || 0) +
    adhesiveBags * Number(adhesivePrice || 0) +
    groutKg * Number(groutPrice || 0) +
    primerLitres * 10 +
    siliconeTubes * 8;

  const labourCost = roomArea * Number(labourRate || 0);
  const subtotal = materialCost + labourCost;
  const profitAmount = subtotal * (Number(profit || 0) / 100);
  const quoteTotal = subtotal + profitAmount;

  return (
    <main className="app">
      <header className="hero">
        <div className="logo">🏠</div>
        <p className="tag">Built for Builders</p>
        <h1>Build It Pro</h1>
        <p className="sub">Built by Level Up.</p>
      </header>

      <nav className="grid">
        <button onClick={() => setPage("home")}>Home</button>
        <button onClick={() => setPage("quotes")}>Quotes</button>
        <button onClick={() => setPage("jobs")}>Jobs</button>
        <button onClick={() => setPage("customers")}>Customers</button>
        <button onClick={() => setPage("merchants")}>Merchants</button>
        <button onClick={() => setPage("ai")}>AI Site Manager</button>
      </nav>

      {page === "home" && (
        <section className="panel">
          <h2>Business Command Centre</h2>
          <p>Your home for quotes, jobs, customers, merchants and AI Site Manager.</p>
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
                  <input value={waste} onChange={(e) => setWaste(e.target.value)} />
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
                  Profit %
                  <input value={profit} onChange={(e) => setProfit(e.target.value)} />
                </label>
              </div>
              
              <button className="quote-button">
  Calculate Quote →
</button>
              <div className="result">
                <p>Room area <strong>{roomArea.toFixed(2)}m²</strong></p>
                <p>Total area with waste <strong>{totalArea.toFixed(2)}m²</strong></p>
                <p>Tiles needed <strong>{tilesNeeded}</strong></p>
                <p>20kg adhesive bags <strong>{adhesiveBags}</strong></p>
                <p>Grout needed <strong>{groutKg.toFixed(1)}kg</strong></p>
                <p>Primer needed <strong>{primerLitres}L</strong></p>
                <p>Silicone tubes <strong>{siliconeTubes}</strong></p>
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