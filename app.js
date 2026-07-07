
const VERSION = "3.0.0";
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const store = {
  get(k, fallback){ return JSON.parse(localStorage.getItem(k) || JSON.stringify(fallback)); },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); }
};

let state = {
  customers: store.get("lup_customers", [
    {id: crypto.randomUUID(), name:"Mr Smith", phone:"", email:"", address:"12 West Lane, Basildon", notes:"Extension enquiry"},
    {id: crypto.randomUUID(), name:"Jones", phone:"", email:"", address:"28 Oak Road, Wickford", notes:"Bathroom refurb"}
  ]),
  quotes: store.get("lup_quotes", [
    {id: crypto.randomUUID(), ref:"Q-1005", customer:"Mr Smith", type:"Extension", value:87450, status:"Sent", date:"2026-07-07"},
    {id: crypto.randomUUID(), ref:"Q-1006", customer:"Jones", type:"Bathroom", value:12300, status:"Draft", date:"2026-07-07"}
  ]),
  jobs: store.get("lup_jobs", [
    {id: crypto.randomUUID(), name:"Smith – Extension", address:"12 West Lane, Basildon", date:"Wed, 14 May", status:"In Progress"},
    {id: crypto.randomUUID(), name:"Jones – Bathroom", address:"28 Oak Road, Wickford", date:"Fri, 16 May", status:"Scheduled"}
  ]),
  invoices: store.get("lup_invoices", [
    {id: crypto.randomUUID(), ref:"INV-1003", customer:"Jones", value:12300, status:"Due", date:"2026-07-07"}
  ]),
  settings: store.get("lup_settings", {
    company:"Level Up Property Renovation",
    phone:"07701 369715",
    email:"info@levelup-propertyrenovation.co.uk",
    defaultMargin:15,
    overhead:10,
    vat:0
  })
};

function saveAll(){
  store.set("lup_customers", state.customers);
  store.set("lup_quotes", state.quotes);
  store.set("lup_jobs", state.jobs);
  store.set("lup_invoices", state.invoices);
  store.set("lup_settings", state.settings);
}

function money(n){ return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(Number(n)||0); }
function today(){ return new Date().toISOString().slice(0,10); }
function total(arr){ return arr.reduce((s,x)=>s+(Number(x.value)||0),0); }

function setPage(page){
  $$(".page").forEach(p=>p.classList.toggle("active", p.id===page));
  $$(".nav-btn,.bottom-btn").forEach(b=>b.classList.toggle("active", b.dataset.page===page));
  const titles = {
    dashboard:["Good evening, Callum 👋","Here’s what’s happening with your business today."],
    customers:["Customers","Store customer details once and reuse them on quotes/jobs."],
    quotes:["Quotes","Create, save and print professional branded quotations."],
    jobs:["Jobs","Track live work, stage payments and upcoming visits."],
    invoices:["Invoices","Keep an eye on what’s due and what’s been paid."],
    materials:["Materials","Quick calculators for common building materials."],
    settings:["Settings","Your company details and default pricing settings."]
  };
  $("#pageTitle").textContent = titles[page][0];
  $("#pageSub").textContent = titles[page][1];
}
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-page]");
  if(btn) setPage(btn.dataset.page);
});

function renderDashboard(){
  const qTotal = total(state.quotes);
  const invDue = total(state.invoices.filter(i=>i.status!=="Paid"));
  $("#dashboard").innerHTML = `
    <div class="grid stats">
      <div class="card"><div class="stat-icon blue">💼</div><div class="stat-label">Today's Jobs</div><div class="stat-value">${state.jobs.length}</div><div class="stat-small">View schedule →</div></div>
      <div class="card"><div class="stat-icon green">📄</div><div class="stat-label">Quotes Awaiting</div><div class="stat-value">${state.quotes.length}</div><div class="stat-small">${money(qTotal)}</div></div>
      <div class="card"><div class="stat-icon purple">£</div><div class="stat-label">Invoices Due</div><div class="stat-value">${state.invoices.length}</div><div class="stat-small">${money(invDue)}</div></div>
      <div class="card"><div class="stat-icon gold">↗</div><div class="stat-label">Profit This Month</div><div class="stat-value">${money(qTotal*0.22)}</div><div class="stat-small" style="color:var(--green)">↑ 15% vs last month</div></div>
    </div>
    <div class="grid two" style="margin-top:16px">
      <div class="card">
        <h3>📅 Upcoming Jobs</h3>
        ${state.jobs.map(j=>`<div class="row"><div><strong>${j.name}</strong><br><span class="muted">${j.address}</span><br><span class="muted">${j.date}</span></div><span class="badge ${j.status==="In Progress"?"blue":"green"}">${j.status}</span></div>`).join("")}
      </div>
      <div class="card">
        <h3>📈 Financial Overview</h3>
        <div class="row"><span>Turnover</span><strong class="kpi">${money(qTotal)}</strong></div>
        <div class="row"><span>Costs</span><strong class="kpi">${money(qTotal*0.58)}</strong></div>
        <div class="row"><span>Profit</span><strong class="kpi">${money(qTotal*0.22)}</strong></div>
      </div>
      <div class="card">
        <h3>🕘 Recent Activity</h3>
        <div class="row"><span>Quote ${state.quotes[0]?.ref || ""} created<br><span class="muted">For ${state.quotes[0]?.customer || "customer"}</span></span><span class="muted">2h ago</span></div>
        <div class="row"><span>Invoice ${state.invoices[0]?.ref || ""} sent<br><span class="muted">To ${state.invoices[0]?.customer || "customer"}</span></span><span class="muted">5h ago</span></div>
      </div>
      <div class="card">
        <h3>⚡ Quick Actions</h3>
        <div class="actions-grid">
          <button class="action" onclick="openQuoteModal()">📄<br>New Quote</button>
          <button class="action" onclick="openCustomerModal()">👤<br>Add Customer</button>
          <button class="action" onclick="openJobModal()">📋<br>New Job</button>
          <button class="action" onclick="openInvoiceModal()">£<br>New Invoice</button>
        </div>
      </div>
    </div>`;
}

function renderCustomers(){
  $("#customers").innerHTML = `
    <div class="card no-print"><button class="primary" onclick="openCustomerModal()">+ Add Customer</button></div>
    <div class="card" style="margin-top:16px">
      <table class="table"><thead><tr><th>Name</th><th>Address</th><th>Phone</th><th>Email</th><th>Notes</th></tr></thead>
      <tbody>${state.customers.map(c=>`<tr><td><strong>${c.name}</strong></td><td>${c.address||""}</td><td>${c.phone||""}</td><td>${c.email||""}</td><td>${c.notes||""}</td></tr>`).join("")}</tbody></table>
    </div>`;
}

function renderQuotes(){
  const first = state.quotes[0] || {ref:"Q-1001", customer:"", type:"Extension", value:0, status:"Draft", date:today()};
  $("#quotes").innerHTML = `
    <div class="card no-print">
      <button class="primary" onclick="openQuoteModal()">+ New Quote</button>
      <button class="secondary" onclick="window.print()">Print / Save PDF</button>
    </div>
    <div class="card no-print" style="margin-top:16px">
      <table class="table"><thead><tr><th>Ref</th><th>Customer</th><th>Type</th><th>Value</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>${state.quotes.map(q=>`<tr><td><strong>${q.ref}</strong></td><td>${q.customer}</td><td>${q.type}</td><td>${money(q.value)}</td><td><span class="badge ${q.status==="Accepted"?"green":q.status==="Sent"?"blue":"gold"}">${q.status}</span></td><td>${q.date}</td></tr>`).join("")}</tbody></table>
    </div>
    <div class="quote-preview">
      <div class="quote-head">
        <div style="display:flex;gap:14px;align-items:center"><img src="logo.png" alt="logo"><div><h2 style="margin:0">Level Up Property Renovation</h2><strong>Quotation ${first.ref}</strong></div></div>
        <div style="text-align:right">07701 369715<br>info@levelup-propertyrenovation.co.uk<br>${first.date}</div>
      </div>
      <h3>Prepared for: ${first.customer || "Customer"}</h3>
      <p><strong>Project:</strong> ${first.type}</p>
      <p>Professional quotation for building/renovation works as discussed. Scope, exclusions and stage payments to be confirmed before acceptance.</p>
      <table style="width:100%;border-collapse:collapse;margin:18px 0"><tr><td style="padding:10px;border:1px solid #ddd">Quoted Works</td><td style="padding:10px;border:1px solid #ddd;text-align:right">${money(first.value)}</td></tr><tr><td style="padding:10px;border:1px solid #ddd"><strong>Total</strong></td><td style="padding:10px;border:1px solid #ddd;text-align:right"><strong>${money(first.value)}</strong></td></tr></table>
      <p><strong>Payment schedule:</strong> Deposit, agreed stage payments, and completion balance.</p>
    </div>`;
}

function renderJobs(){
  $("#jobs").innerHTML = `
    <div class="card no-print"><button class="primary" onclick="openJobModal()">+ New Job</button></div>
    <div class="grid" style="margin-top:16px">${state.jobs.map(j=>`<div class="card"><div class="row"><div><h3>${j.name}</h3><p class="muted">${j.address}</p><p>${j.date}</p></div><span class="badge ${j.status==="In Progress"?"blue":"green"}">${j.status}</span></div><button class="secondary">Open job file</button></div>`).join("")}</div>`;
}

function renderInvoices(){
  $("#invoices").innerHTML = `
    <div class="card no-print"><button class="primary" onclick="openInvoiceModal()">+ New Invoice</button></div>
    <div class="card" style="margin-top:16px"><table class="table"><thead><tr><th>Ref</th><th>Customer</th><th>Value</th><th>Status</th><th>Date</th></tr></thead><tbody>${state.invoices.map(i=>`<tr><td><strong>${i.ref}</strong></td><td>${i.customer}</td><td>${money(i.value)}</td><td><span class="badge ${i.status==="Paid"?"green":"gold"}">${i.status}</span></td><td>${i.date}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderMaterials(){
  $("#materials").innerHTML = `
    <div class="grid two">
      <div class="card">
        <h3>Concrete / Screed Calculator</h3>
        <div class="form-grid">
          <label>Area m²<input id="matArea" type="number" value="40"></label>
          <label>Depth mm<input id="matDepth" type="number" value="75"></label>
        </div>
        <button class="primary" onclick="calcMaterials()">Calculate</button>
        <div id="matResult" class="row" style="margin-top:12px"></div>
      </div>
      <div class="card">
        <h3>Quick Supplier Notes</h3>
        <div class="row"><span>Chandlers</span><span class="muted">General building materials</span></div>
        <div class="row"><span>Screwfix</span><span class="muted">Fixings, tools, sundries</span></div>
        <div class="row"><span>Howdens</span><span class="muted">Kitchens, joinery</span></div>
      </div>
    </div>`;
}

function calcMaterials(){
  const area = Number($("#matArea").value)||0;
  const depth = Number($("#matDepth").value)||0;
  const m3 = area * (depth/1000);
  $("#matResult").innerHTML = `<span>Volume required</span><strong>${m3.toFixed(2)} m³</strong>`;
}

function renderSettings(){
  $("#settings").innerHTML = `
    <div class="card">
      <h3>Company Settings</h3>
      <div class="form-grid">
        <label>Company<input id="setCompany" value="${state.settings.company}"></label>
        <label>Phone<input id="setPhone" value="${state.settings.phone}"></label>
        <label>Email<input id="setEmail" value="${state.settings.email}"></label>
        <label>Default Profit %<input id="setMargin" type="number" value="${state.settings.defaultMargin}"></label>
        <label>Overhead %<input id="setOverhead" type="number" value="${state.settings.overhead}"></label>
        <label>VAT %<input id="setVat" type="number" value="${state.settings.vat}"></label>
      </div>
      <button class="primary" onclick="saveSettings()">Save Settings</button>
      <button class="danger" onclick="resetDemo()">Reset Demo Data</button>
      <p class="muted">Version ${VERSION}</p>
    </div>`;
}

function renderAll(){
  renderDashboard(); renderCustomers(); renderQuotes(); renderJobs(); renderInvoices(); renderMaterials(); renderSettings();
}

function openModal(html){ $("#modalContent").innerHTML = html; $("#modal").classList.remove("hidden"); }
function closeModal(){ $("#modal").classList.add("hidden"); }
$("#closeModal").addEventListener("click", closeModal);
$("#quickQuote").addEventListener("click", openQuoteModal);

function openCustomerModal(){
  openModal(`<h2>Add Customer</h2><div class="form-grid"><label>Name<input id="cName"></label><label>Phone<input id="cPhone"></label><label>Email<input id="cEmail"></label><label>Address<input id="cAddress"></label></div><label>Notes<textarea id="cNotes"></textarea></label><button class="primary" onclick="saveCustomer()">Save Customer</button>`);
}
function saveCustomer(){
  state.customers.unshift({id:crypto.randomUUID(), name:$("#cName").value||"Unnamed Customer", phone:$("#cPhone").value, email:$("#cEmail").value, address:$("#cAddress").value, notes:$("#cNotes").value});
  saveAll(); renderAll(); closeModal();
}

function openQuoteModal(){
  const custOptions = state.customers.map(c=>`<option>${c.name}</option>`).join("");
  openModal(`<h2>New Quote</h2><div class="form-grid"><label>Customer<select id="qCustomer">${custOptions}</select></label><label>Job Type<select id="qType"><option>Extension</option><option>Bathroom</option><option>Kitchen</option><option>Renovation</option><option>Insurance Repair</option></select></label><label>Area / Qty<input id="qQty" type="number" value="10.5"></label><label>Rate / Allowance<input id="qRate" type="number" value="4000"></label><label>Status<select id="qStatus"><option>Draft</option><option>Sent</option><option>Accepted</option></select></label></div><p class="muted">Tip: use this for a quick quote. More detailed estimators are coming next.</p><button class="primary" onclick="saveQuote()">Generate Quote</button>`);
}
function saveQuote(){
  const value = (Number($("#qQty").value)||0) * (Number($("#qRate").value)||0);
  state.quotes.unshift({id:crypto.randomUUID(), ref:`Q-${1000+state.quotes.length+1}`, customer:$("#qCustomer").value, type:$("#qType").value, value, status:$("#qStatus").value, date:today()});
  saveAll(); renderAll(); closeModal(); setPage("quotes");
}

function openJobModal(){
  openModal(`<h2>New Job</h2><div class="form-grid"><label>Job Name<input id="jName" placeholder="Smith – Extension"></label><label>Address<input id="jAddress"></label><label>Date<input id="jDate" placeholder="Wed, 14 May"></label><label>Status<select id="jStatus"><option>Scheduled</option><option>In Progress</option><option>Complete</option></select></label></div><button class="primary" onclick="saveJob()">Save Job</button>`);
}
function saveJob(){
  state.jobs.unshift({id:crypto.randomUUID(), name:$("#jName").value||"New Job", address:$("#jAddress").value, date:$("#jDate").value, status:$("#jStatus").value});
  saveAll(); renderAll(); closeModal(); setPage("jobs");
}

function openInvoiceModal(){
  const custOptions = state.customers.map(c=>`<option>${c.name}</option>`).join("");
  openModal(`<h2>New Invoice</h2><div class="form-grid"><label>Customer<select id="iCustomer">${custOptions}</select></label><label>Amount<input id="iValue" type="number" value="1000"></label><label>Status<select id="iStatus"><option>Due</option><option>Paid</option></select></label></div><button class="primary" onclick="saveInvoice()">Save Invoice</button>`);
}
function saveInvoice(){
  state.invoices.unshift({id:crypto.randomUUID(), ref:`INV-${1000+state.invoices.length+1}`, customer:$("#iCustomer").value, value:Number($("#iValue").value)||0, status:$("#iStatus").value, date:today()});
  saveAll(); renderAll(); closeModal(); setPage("invoices");
}

function saveSettings(){
  state.settings = {company:$("#setCompany").value, phone:$("#setPhone").value, email:$("#setEmail").value, defaultMargin:Number($("#setMargin").value)||0, overhead:Number($("#setOverhead").value)||0, vat:Number($("#setVat").value)||0};
  saveAll(); renderAll(); alert("Settings saved.");
}

function resetDemo(){
  localStorage.clear(); location.reload();
}

renderAll();
setPage("dashboard");

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js?v=3.0.0").catch(()=>{});
}
