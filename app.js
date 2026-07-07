function money(n){
  return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n || 0);
}

function calculate(){
  const length = parseFloat(document.getElementById('length').value) || 0;
  const width = parseFloat(document.getElementById('width').value) || 0;
  const rate = parseFloat(document.getElementById('rate').value) || 0;
  const overheadPct = parseFloat(document.getElementById('overhead').value) || 0;
  const profitPct = parseFloat(document.getElementById('profit').value) || 0;
  const vatPct = parseFloat(document.getElementById('vat').value) || 0;

  const area = length * width;
  const direct = area * rate;
  const overhead = direct * overheadPct / 100;
  const profit = (direct + overhead) * profitPct / 100;
  const exVat = direct + overhead + profit;
  const vat = exVat * vatPct / 100;
  const incVat = exVat + vat;

  document.getElementById('areaOut').textContent = area.toFixed(2) + " m²";
  document.getElementById('directOut').textContent = money(direct);
  document.getElementById('overheadOut').textContent = money(overhead);
  document.getElementById('profitOut').textContent = money(profit);
  document.getElementById('exVatOut').textContent = money(exVat);
  document.getElementById('incVatOut').textContent = money(incVat);

  [10,20,20,20,20,10].forEach((pct,i)=>{
    document.getElementById('p'+(i+1)).textContent = money(incVat * pct / 100);
  });
}

function saveJob(){
  calculate();
  const jobs = JSON.parse(localStorage.getItem('levelUpJobs') || '[]');
  jobs.push({
    quoteNo: document.getElementById('quoteNo').value,
    clientName: document.getElementById('clientName').value,
    projectAddress: document.getElementById('projectAddress').value,
    jobType: document.getElementById('jobType').value,
    total: document.getElementById('incVatOut').textContent,
    date: new Date().toLocaleDateString('en-GB')
  });
  localStorage.setItem('levelUpJobs', JSON.stringify(jobs));
  loadJobs();
  alert('Job saved on this device.');
}

function loadJobs(){
  const jobs = JSON.parse(localStorage.getItem('levelUpJobs') || '[]');
  const box = document.getElementById('savedJobs');
  if(!jobs.length){ box.innerHTML = 'No saved jobs yet.'; return; }
  box.innerHTML = jobs.map(j => `
    <div class="saved">
      <strong>${j.quoteNo}</strong> - ${j.clientName || 'Unnamed client'}<br>
      ${j.jobType} | ${j.projectAddress || 'No address'} | ${j.total} | ${j.date}
    </div><hr>`).join('');
}

calculate();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js').catch(()=>{});
}
