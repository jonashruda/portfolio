// Interactive triangle grid background.
// Renders a triangular lattice with dots. Dots react to pointer by glowing orange.

(() => {
  const canvas = document.getElementById('bg');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  let W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  let points = []; // {x,y,heat}
  let a = 60; // spacing in CSS pixels
  let h = Math.sqrt(3)/2 * a; // vertical step
  let fade = 0.95; // heat decay per frame
  let mouse = {x: -1e9, y: -1e9};
  let orange = [255, 122, 26];
  let gray = [170, 175, 180]; // muted gray
  let lineGray = [60, 62, 66];

  function lerp(a,b,t){ return a + (b - a) * t; }
  function mixColor(c1, c2, t){ return `rgb(${Math.round(lerp(c1[0],c2[0],t))},${Math.round(lerp(c1[1],c2[1],t))},${Math.round(lerp(c1[2],c2[2],t))})`; }

  function resize(){
    W = Math.ceil(window.innerWidth * DPR);
    H = Math.ceil(window.innerHeight * DPR);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = Math.ceil(W / DPR) + 'px';
    canvas.style.height = Math.ceil(H / DPR) + 'px';
    buildGrid();
  }

  function buildGrid(){
    points = [];
    const cols = Math.ceil((W/DPR)/a) + 4;
    const rows = Math.ceil((H/DPR)/h) + 4;
    for(let r=0; r<rows; r++){
      const y = (r-2)*h;
      const xOffset = (r % 2) * (a/2);
      for(let c=0; c<cols; c++){
        const x = (c-2)*a + xOffset;
        points.push({x:x*DPR, y:y*DPR, heat:0});
      }
    }
  }

  function draw(){
    // clear
    ctx.fillStyle = '#0c0d0e';
    ctx.fillRect(0,0,W,H);

    // compute heat from mouse
    const r = 140 * DPR;
    const r2 = r*r;

    // draw triangle lines
    ctx.lineWidth = 1 * DPR;
    ctx.strokeStyle = `rgba(${lineGray[0]},${lineGray[1]},${lineGray[2]},0.35)`;
    ctx.beginPath();
    const cols = Math.ceil((W/DPR)/a) + 4;
    const rows = Math.ceil((H/DPR)/h) + 4;
    function idx(rr, cc){ return rr*cols + cc; }

    for(let rr=0; rr<rows; rr++){
      const base = rr*cols;
      for(let cc=0; cc<cols; cc++){
        // connect to right
        if(cc+1<cols){
          const p = points[base+cc], q = points[base+cc+1];
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        }
        // connect to up-right
        if(rr>0 && (rr-1)>=0 && (cc + (rr%2))<cols){
          const p = points[base+cc];
          const q = points[(rr-1)*cols + cc + (rr%2)];
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        }
      }
    }
    ctx.stroke();

    // dots
    for(const p of points){
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx*dx + dy*dy;
      const influence = Math.max(0, 1 - d2 / r2);
      // add heat then decay
      p.heat = Math.max(p.heat * fade, influence);
      const t = Math.pow(p.heat, 1.8); // ease
      const color = mixColor(gray, orange, t);
      const radius = (2.2 + 2.8*t) * DPR;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
      ctx.fill();
      if(t > 0.35){
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius+3*DPR, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(${orange[0]},${orange[1]},${orange[2]},${0.15*t})`;
        ctx.lineWidth = 2*DPR;
        ctx.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('pointermove', (e)=>{
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * DPR;
    mouse.y = (e.clientY - rect.top) * DPR;
  });
  window.addEventListener('pointerleave', ()=>{
    mouse.x = -1e9; mouse.y = -1e9;
  });
  window.addEventListener('resize', resize, { passive: true });

  resize();
  draw();
})();
