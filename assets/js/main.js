
document.getElementById('year').textContent = new Date().getFullYear();
// Hero texts
Promise.all([
  fetch('data/hero_title.txt').then(r => r.text()).catch(()=> 'Welcome to my portfolio.'),
  fetch('data/hero_subtitle.txt').then(r => r.text()).catch(()=> 'Programming · Video · 3D')
]).then(([title, subtitle]) => {
  document.getElementById('heroTitle').textContent = title.trim();
  document.getElementById('subtitle').textContent = subtitle.trim();
});
// Bio
fetch('data/bio.txt').then(r=>r.text()).then(t=>document.getElementById('bio').textContent=t).catch(()=>{});
// Minimal projects loader
document.getElementById('projectsGrid').innerHTML = '';
