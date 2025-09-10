// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Hero texts from files
Promise.all([
  fetch('data/hero_title.txt').then(r => r.text()).catch(()=> 'Welcome to my portfolio.'),
  fetch('data/hero_subtitle.txt').then(r => r.text()).catch(()=> 'Programming · Video · 3D')
]).then(([title, subtitle]) => {
  document.getElementById('heroTitle').textContent = title.trim();
  document.getElementById('subtitle').textContent = subtitle.trim();
});

// Bio
fetch('data/bio.txt')
  .then(r => r.text())
  .then(text => { document.getElementById('bio').textContent = text; })
  .catch(() => { document.getElementById('bio').textContent = 'Add your bio in data/bio.txt'; });

// Projects
const grid = document.getElementById('projectsGrid');
const filters = document.getElementById('filters');
let allProjects = [];

function cardTemplate(p){
  const img = p.thumbnail || 'assets/img/placeholder.svg';
  return `
  <a class="card card-link" href="project.html?slug=${encodeURIComponent(p.slug)}" data-cat="${p.category}">
    <div class="thumb"><img src="${img}" alt="${p.title} thumbnail"/></div>
    <div class="card-body">
      <h3 class="h1">${p.title}</h3>
      <div class="meta"><span class="pill">${p.categoryLabel || p.category}</span></div>
    </div>
  </a>`;
}

function render(projects){
  grid.innerHTML = projects.map(cardTemplate).join('');
  document.querySelectorAll('.thumb').forEach(el => {
    el.addEventListener('pointermove', e => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      el.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    });
  });
}

fetch('data/projects.json')
  .then(r => r.json())
  .then(json => {
    allProjects = json.projects || [];
    render(allProjects);
  })
  .catch(err => {
    console.error(err);
    grid.innerHTML = '<p style="color:#a0a4aa">Add projects in data/projects.json</p>';
  });

filters.addEventListener('click', (e)=>{
  const btn = e.target.closest('.chip');
  if(!btn) return;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  const tag = btn.dataset.filter;
  if(tag === 'all'){ render(allProjects); return; }
  render(allProjects.filter(p => p.category === tag));
});
