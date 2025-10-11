async function loadJSON(path){ const r = await fetch(path); return await r.json(); }

(async () => {
  const data = await loadJSON('content/models.json');
  document.getElementById('models-intro').textContent = data.intro || '';

  const grid = document.getElementById('models-grid');

  function modelCard(m){
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="card-media">
        <img src="${m.thumbnail}" alt="${m.title} thumbnail" style="max-height:120px; width:auto; opacity:.95" />
        <div class="badges">${(m.tags||[]).slice(0,2).map(t=>`<span class='badge'>${t}</span>`).join('')}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${m.title}</h3>
        <p class="card-desc">${m.description||''}</p>
        <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
          ${(m.files||[]).map(f=>`<a class="button" href="${f.url}" target="_blank" rel="noopener">${f.label}</a>`).join('')}
        </div>
      </div>
    `;
    return el;
  }

  (data.models||[]).forEach(m => grid.appendChild(modelCard(m)));
  document.getElementById('year').textContent = new Date().getFullYear();
})();