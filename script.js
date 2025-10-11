// ===== Utility: load JSON or text from /content =====
async function loadJSON(path){ const r = await fetch(path); return await r.json(); }
async function loadText(path){ const r = await fetch(path); return await r.text(); }

// ===== Build homepage =====
(async () => {
  const site = await loadJSON('content/site.json');
  // Apply theme tokens to CSS variables for easy editing
  for (const [k,v] of Object.entries(site.theme||{})) document.documentElement.style.setProperty(`--${k}`, v);

  // Headline and filters
  document.getElementById('headline').textContent = site.headline;
  const filterWrap = document.getElementById('filters');
  const filters = site.filters || ['All','Programming','Video','3D'];
  let active = 'All';
  filters.forEach(name => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (name===active?' active':'');
    chip.textContent = name;
    chip.addEventListener('click', () => { active = name; [...filterWrap.children].forEach(c=>c.classList.remove('active')); chip.classList.add('active'); renderCards(); });
    filterWrap.appendChild(chip);
  });

  // About section from Markdown (simple)
  const aboutMd = await loadText('content/about.md');
  document.getElementById('about-content').innerHTML = aboutMd
    .replace(/^# .*$/m,'') // drop H1
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\n\n/g,'<br/><br/>');

  // Homepage cards definition. You can reorder or edit here or in /content files.
  const cards = [
    {
      title: 'Video Editing',
      category: 'Video',
      href: site.links.videoChannel,
      desc: 'Portfolio channel with edits and shorts.',
      badge: 'Video',
    },
    {
      title: '3D Modeling',
      category: '3D',
      href: 'models.html',
      desc: 'My 3D work, loaded from content/models.json',
      badge: '3D',
    },
    {
      title: 'SSPŠ Toolkit',
      category: 'Programming',
      href: site.links.programmingProject || 'https://jonashruda.github.io/Eco-AI/',
      desc: 'Featured project.',
      badge: 'Code',
    }
  ];

  const grid = document.getElementById('projects');

  // Helper to create one card
  function createCard(item){
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'card';
    a.target = item.href.startsWith('http') ? '_blank' : '_self';
    a.rel = 'noopener';

    a.innerHTML = `
      <div class="card-media"><div class="skeleton"></div></div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
      </div>
    `;
    return a;
  }

  function renderCards(){
    grid.innerHTML = '';
    cards
      .filter(c => active==='All' || c.category===active)
      .forEach(c => grid.appendChild(createCard(c)));
  }

  renderCards();
  document.getElementById('year').textContent = new Date().getFullYear();
})();
