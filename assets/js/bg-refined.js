// Refined triangle grid. Subtle. Hover adds a soft orange ripple.
(()=>{
  const canvas = document.getElementById('bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha:false });
  let DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W=0,H=0;
  const SPACING = 64;               // base spacing
  const LINE_ALPHA = 0.18;          // line contrast
  const DOT_ALPHA  = 0.35;          // dot contrast
  const HOVER_RADIUS = 110;         // px influence
  const MAX_GLOW = 0.8;             // cap brightness
  const DECAY = 0.94;
  let points=[], cols=0, rows=0;
  let mouse = {x:-1e9,y:-1e9,active:false};
  let running = true;

  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.ceil(innerWidth * DPR);
    H = Math.ceil(innerHeight * DPR);
    canvas.width = W; canvas.height = H;
    canvas.style.width = Math.ceil(W/DPR) + 'px';
    canvas.style.height = Math.ceil(H/DPR) + 'px';
    build();
  }

  function build(){
    points.length = 0;
    const a = SPACING;
    const h = Math.sqrt(3)/2 * a;
    cols = Math.ceil((W/DPR)/a) + 4;
    rows = Math.ceil((H/DPR)/h) + 4;
    for(let r=0;r<rows;r++){
      const y = (r-2)*h;
      const xOff = (r%2) * (a/2);
      for(let c=0;c<cols;c++){
        const x = (c-2)*a + xOff;
        points.push({x:x*DPR, y:y*DPR, heat:0});
      }
    }
  }

  function drawGridLines(){
    ctx.strokeStyle = `rgba(180,185,190,${LINE_ALPHA})`;
    ctx.lineWidth = 1*DPR;
    ctx.beginPath();
    // horizontal-slanted lines
    for(let r=0;r<rows;r++){
      const base=r*cols;
      for(let c=0;c<cols-1;c++){
        const p=points[base+c], q=points[base+c+1];
        ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
      }
    }
    // diagonals
    for(let r=1;r<rows;r++){
      const base=r*cols;
      for(let c=0;c<cols-(r%2?0:1);c++){
        const p=points[base+c];
        const q=points[(r-1)*cols + c + (r%2)];
        if(!q) continue;
        ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
      }
    }
    ctx.stroke();
  }

  function step(){
    if(!running) return;
    ctx.fillStyle = '#0c0d0e';
    ctx.fillRect(0,0,W,H);

    drawGridLines();

    const r = HOVER_RADIUS * DPR;
    const r2 = r*r;
    for(const p of points){
      const dx = p.x-mouse.x, dy = p.y-mouse.y;
      const d2 = dx*dx + dy*dy;
      const infl = Math.max(0, 1 - d2/r2);
      p.heat = Math.max(p.heat*DECAY, infl);
      const t = Math.min(MAX_GLOW, Math.pow(p.heat,1.6));
      const base = 185; // gray
      const or = 255, og = 122, ob = 26;
      const rC = Math.round(base*(1-t) + or*t);
      const gC = Math.round(base*(1-t) + og*t);
      const bC = Math.round(base*(1-t) + ob*t);
      const alpha = DOT_ALPHA*(0.8 + 0.2*t);
      const radius = (1.8 + 1.8*t) * DPR;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${rC},${gC},${bC},${alpha})`;
      ctx.arc(p.x,p.y,radius,0,Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(step);
  }

  addEventListener('pointermove', e=>{
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * DPR;
    mouse.y = (e.clientY - rect.top) * DPR;
    mouse.active = true;
  });
  addEventListener('pointerleave', ()=>{ mouse.x=-1e9; mouse.y=-1e9; mouse.active=false; });

  document.addEventListener('visibilitychange', ()=>{
    running = !document.hidden;
    if(running) requestAnimationFrame(step);
  });

  addEventListener('resize', resize, {passive:true});
  resize();
  requestAnimationFrame(step);
})();