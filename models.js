// models.js (drop-in replacement)

// tiny helpers
async function loadJSON(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${path}`);
  return r.json();
}

function showError(msg) {
  const grid = document.getElementById("models-grid");
  grid.innerHTML = `<div class="panel" style="grid-column:1/-1;color:#f66">${msg}</div>`;
  console.error(msg);
}

(async () => {
  try {
    // read site config to get basePath (important on GitHub Pages)
    const site = await loadJSON("content/site.json").catch(() => ({ basePath: "" }));
    const base = (site && site.basePath) || "";

    // fetch models.json using basePath-aware URL
    const data = await loadJSON(`${base}content/models.json`);

    // intro text
    const intro = document.getElementById("models-intro");
    if (intro) intro.textContent = data.intro || "";

    // render cards
    const grid = document.getElementById("models-grid");

    function card(m) {
      const el = document.createElement("div");
      el.className = "card";
      el.innerHTML = `
        <div class="card-media">
          ${
            m.thumbnail
              ? `<img src="${m.thumbnail}" alt="${m.title} thumbnail" style="width:100%;height:100%;object-fit:cover;">`
              : '<div class="skeleton"></div>'
          }
        </div>
        <div class="card-body">
          <h3 class="card-title">${m.title || "Untitled"}</h3>
          <p class="card-desc">${m.description || ""}</p>
          <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
            ${(m.files || [])
              .map(f => `<a class="button" href="${f.url}" target="_blank" rel="noopener">${f.label}</a>`)
              .join("")}
          </div>
        </div>
      `;
      return el;
    }

    if (!data.models || !Array.isArray(data.models) || data.models.length === 0) {
      showError("No models found. Edit content/models.json and add items to the \"models\" array.");
      return;
    }

    data.models.forEach(m => grid.appendChild(card(m)));
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  } catch (err) {
    showError(`Failed to load models: ${err.message}`);
  }
})();
