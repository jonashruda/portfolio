// Utility: set year
document.getElementById('year').textContent = new Date().getFullYear();

const params = new URLSearchParams(location.search);
const slug = params.get('slug');

const titleTag = document.getElementById('titleTag');
const h1 = document.getElementById('projectTitle');
const cat = document.getElementById('projectCategory');
const media = document.getElementById('projectMedia');
const desc = document.getElementById('projectDescription');
const links = document.getElementById('projectLinks');

function htmlEscape(s){
  return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function renderProject(p){
  titleTag.textContent = p.title + ' — Jonáš Hruda';
  h1.textContent = p.title;
  cat.textContent = p.categoryLabel || p.category;

  // Media
  media.innerHTML = '';
  if(p.videoUrl){
    media.innerHTML += `<div class="card"><iframe src="${p.videoUrl}" allowfullscreen loading="lazy"></iframe></div>`;
  }
  if(p.imageUrls && p.imageUrls.length){
    p.imageUrls.forEach(u => {
      media.innerHTML += `<div class="card"><img src="${u}" alt=""></div>`;
    });
  }

  // Description from text file
  fetch(p.descriptionPath || 'data/projects/' + p.slug + '/description.txt')
    .then(r => r.text())
    .then(t => { desc.textContent = t; })
    .catch(() => { desc.textContent = 'Add description at ' + (p.descriptionPath || ('data/projects/'+p.slug+'/description.txt')); });

  // Links
  links.innerHTML = '';
  if(p.repo){ links.innerHTML += `<a href="${p.repo}" target="_blank" rel="noopener">Source</a>`; }
  if(p.demo){ links.innerHTML += `<a href="${p.demo}" target="_blank" rel="noopener">Demo</a>`; }
}

fetch('data/projects.json')
  .then(r => r.json())
  .then(json => {
    const p = (json.projects || []).find(x => x.slug === slug);
    if(!p){
      h1.textContent = 'Not found';
      desc.textContent = 'Invalid or missing project slug.';
      return;
    }
    renderProject(p);
  })
  .catch(() => {
    h1.textContent = 'Error';
    desc.textContent = 'Could not load data/projects.json';
  });
