export type Category = "fonds" | "curseurs" | "cadres" | "textes";

export type Param =
  | { key: string; label: string; type: "color"; default: string }
  | {
      key: string;
      label: string;
      type: "range";
      min: number;
      max: number;
      step: number;
      default: number;
    }
  | { key: string; label: string; type: "text"; default: string };

export type Values = Partial<
  Record<
    | "bg"
    | "color"
    | "c1"
    | "c2"
    | "c3"
    | "speed"
    | "blur"
    | "count"
    | "dist"
    | "amp"
    | "layers"
    | "size"
    | "ease"
    | "radius"
    | "gravity"
    | "thick"
    | "glow"
    | "dash"
    | "freq"
    | "len"
    | "bodies"
    | "density"
    | "halo"
    | "ribbons"
    | "text",
    string | number
  >
> & { [k: string]: string | number | undefined };

export interface Effect {
  id: string;
  name: string;
  category: Category;
  description: string;
  tags: string[];
  params: Param[];
  generate: (p: Values) => { html: string; css: string; js: string };
}

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: "fonds", label: "Fonds d'écran", blurb: "Arrière-plans vivants en CSS et Canvas." },
  { id: "curseurs", label: "Curseurs", blurb: "Traînées, halos et curseurs magnétiques." },
  { id: "cadres", label: "Encadrements", blurb: "Bordures animées pour cartes et boutons." },
  { id: "textes", label: "Textes", blurb: "Titres scintillants, glitch et machine à écrire." },
];

const CANVAS_HTML = `<canvas id="fx"></canvas>`;
const CANVAS_CSS = `#fx{position:fixed;inset:0;display:block;width:100%;height:100%}`;
const CANVAS_JS = `const c=document.getElementById('fx'),x=c.getContext('2d');let w,h;function rs(){w=c.width=innerWidth;h=c.height=innerHeight}rs();addEventListener('resize',rs);`;
const POINTER_JS = `let mx=innerWidth/2,my=innerHeight/2,auto=true;addEventListener('pointermove',e=>{auto=false;mx=e.clientX;my=e.clientY});function tickAuto(){if(auto){const t=performance.now()/1000;mx=innerWidth/2+Math.cos(t*1.3)*innerWidth/3;my=innerHeight/2+Math.sin(t*2)*innerHeight/4}}`;
const HINT = `<p class="hint">Bougez la souris</p>`;
const HINT_CSS = `.hint{position:fixed;inset:0;display:grid;place-items:center;margin:0;color:#ffffff40;font:500 14px system-ui;letter-spacing:.2em;text-transform:uppercase;pointer-events:none}`;
const CENTER = `body{display:grid;place-items:center;min-height:100vh}`;

const bg = (d = "#0b0b10"): Param => ({ key: "bg", label: "Fond", type: "color", default: d });

export const EFFECTS: Effect[] = [
  {
    id: "aurore",
    name: "Aurore boréale",
    category: "fonds",
    description: "Nappes de couleurs floues qui dérivent lentement, idéal pour un hero.",
    tags: ["CSS", "Sans JS"],
    params: [
      { key: "c1", label: "Couleur 1", type: "color", default: "#7cff6b" },
      { key: "c2", label: "Couleur 2", type: "color", default: "#22d3ee" },
      { key: "c3", label: "Couleur 3", type: "color", default: "#f472b6" },
      {
        key: "speed",
        label: "Durée du cycle (s)",
        type: "range",
        min: 4,
        max: 40,
        step: 1,
        default: 14,
      },
      { key: "blur", label: "Flou (px)", type: "range", min: 20, max: 160, step: 5, default: 80 },
      bg(),
    ],
    generate: (p) => ({
      html: `<div class="aurora"><span></span><span></span><span></span></div>`,
      css: `body{background:${p.bg}}.aurora{position:fixed;inset:0;overflow:hidden;filter:blur(${p.blur}px)}.aurora span{position:absolute;width:60vmax;height:60vmax;border-radius:50%;mix-blend-mode:screen;opacity:.7;animation:aur ${p.speed}s ease-in-out infinite alternate}.aurora span:nth-child(1){background:${p.c1};top:-20%;left:-10%}.aurora span:nth-child(2){background:${p.c2};bottom:-25%;right:-15%;animation-delay:-${Number(p.speed) / 3}s}.aurora span:nth-child(3){background:${p.c3};top:20%;left:30%;animation-delay:-${(Number(p.speed) * 2) / 3}s}@keyframes aur{0%{transform:translate(0,0) scale(1)}50%{transform:translate(20vw,10vh) scale(1.2)}100%{transform:translate(-10vw,20vh) scale(.9)}}`,
      js: ``,
    }),
  },
  {
    id: "reseau",
    name: "Réseau de particules",
    category: "fonds",
    description: "Points connectés par des liens qui apparaissent selon la distance.",
    tags: ["Canvas", "JS"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#7cff6b" },
      { key: "count", label: "Particules", type: "range", min: 10, max: 200, step: 5, default: 80 },
      { key: "speed", label: "Vitesse", type: "range", min: 0.1, max: 4, step: 0.1, default: 1 },
      {
        key: "dist",
        label: "Distance des liens",
        type: "range",
        min: 40,
        max: 250,
        step: 5,
        default: 120,
      },
      bg(),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const C='${p.color}',S=${p.speed},D=${p.dist};const P=Array.from({length:${p.count}},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*S,vy:(Math.random()-.5)*S}));function f(){x.clearRect(0,0,w,h);x.fillStyle=C;x.strokeStyle=C;for(const p of P){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;x.beginPath();x.arc(p.x,p.y,2,0,7);x.fill()}for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<D){x.globalAlpha=1-d/D;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "vagues",
    name: "Vagues fluides",
    category: "fonds",
    description: "Couches de vagues sinusoïdales superposées en transparence.",
    tags: ["Canvas", "JS"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#22d3ee" },
      { key: "speed", label: "Vitesse", type: "range", min: 0.1, max: 5, step: 0.1, default: 1 },
      { key: "amp", label: "Amplitude", type: "range", min: 5, max: 120, step: 1, default: 40 },
      { key: "layers", label: "Couches", type: "range", min: 1, max: 8, step: 1, default: 4 },
      bg(),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}let t=0;function f(){x.clearRect(0,0,w,h);for(let l=0;l<${p.layers};l++){x.beginPath();x.moveTo(0,h);for(let i=0;i<=w;i+=8){x.lineTo(i,h*.55+Math.sin(i*.008+t*(1+l*.2)+l)*${p.amp}*(1+l*.3)+l*25)}x.lineTo(w,h);x.closePath();x.fillStyle='${p.color}';x.globalAlpha=.22;x.fill()}x.globalAlpha=1;t+=.02*${p.speed};requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "hyperespace",
    name: "Hyperespace",
    category: "fonds",
    description: "Champ d'étoiles en perspective qui fonce vers l'utilisateur.",
    tags: ["Canvas", "JS"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#ffffff" },
      { key: "count", label: "Étoiles", type: "range", min: 50, max: 1500, step: 50, default: 500 },
      { key: "speed", label: "Vitesse", type: "range", min: 1, max: 40, step: 1, default: 8 },
      bg("#05050a"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const st=Array.from({length:${p.count}},()=>({x:(Math.random()-.5)*w,y:(Math.random()-.5)*h,z:Math.random()*w}));function f(){x.globalAlpha=.4;x.fillStyle='${p.bg}';x.fillRect(0,0,w,h);x.globalAlpha=1;x.fillStyle='${p.color}';for(const s of st){s.z-=${p.speed};if(s.z<=1){s.z=w;s.x=(Math.random()-.5)*w;s.y=(Math.random()-.5)*h}const k=128/s.z,px=s.x*k+w/2,py=s.y*k+h/2,sz=(1-s.z/w)*3;x.fillRect(px,py,sz,sz)}requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "matrice",
    name: "Pluie de code",
    category: "fonds",
    description: "Colonnes de caractères qui tombent, façon terminal futuriste.",
    tags: ["Canvas", "JS"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#7cff6b" },
      {
        key: "speed",
        label: "Images / seconde",
        type: "range",
        min: 5,
        max: 60,
        step: 1,
        default: 24,
      },
      {
        key: "size",
        label: "Taille des caractères",
        type: "range",
        min: 8,
        max: 32,
        step: 1,
        default: 16,
      },
      bg("#000000"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const F=${p.size},ch='アイウエオカキクケコサシスセソ0123456789ABCDEF';let drops=[],last=0;function f(t){if(t-last>1000/${p.speed}){last=t;const n=Math.floor(w/F);if(drops.length!==n)drops=Array(n).fill(1);x.fillStyle='rgba(0,0,0,.08)';x.fillRect(0,0,w,h);x.fillStyle='${p.color}';x.font=F+'px monospace';drops.forEach((y,i)=>{x.fillText(ch[Math.floor(Math.random()*ch.length)],i*F,y*F);if(y*F>h&&Math.random()>.975)drops[i]=0;drops[i]++})}requestAnimationFrame(f)}requestAnimationFrame(f);`,
    }),
  },
  {
    id: "grille",
    name: "Grille synthwave",
    category: "fonds",
    description: "Sol quadrillé en perspective qui défile à l'infini.",
    tags: ["CSS", "Sans JS"],
    params: [
      { key: "color", label: "Couleur des lignes", type: "color", default: "#f472b6" },
      {
        key: "speed",
        label: "Durée d'une case (s)",
        type: "range",
        min: 0.2,
        max: 5,
        step: 0.1,
        default: 1,
      },
      {
        key: "size",
        label: "Taille des cases",
        type: "range",
        min: 20,
        max: 120,
        step: 5,
        default: 60,
      },
      bg("#0d0618"),
    ],
    generate: (p) => ({
      html: `<div class="sw"><div class="sw-grid"></div></div>`,
      css: `body{background:${p.bg}}.sw{position:fixed;inset:0;perspective:320px;overflow:hidden;background:radial-gradient(ellipse at 50% 45%,${p.color}55,transparent 55%)}.sw-grid{position:absolute;left:-50%;top:45%;width:200%;height:120%;background-image:linear-gradient(${p.color} 2px,transparent 2px),linear-gradient(90deg,${p.color} 2px,transparent 2px);background-size:${p.size}px ${p.size}px;transform:rotateX(70deg);transform-origin:top;animation:swm ${p.speed}s linear infinite;-webkit-mask-image:linear-gradient(transparent,#000 40%);mask-image:linear-gradient(transparent,#000 40%)}@keyframes swm{to{background-position:0 ${p.size}px}}`,
      js: ``,
    }),
  },
  {
    id: "constellations",
    name: "Étoiles & Constellations",
    category: "fonds",
    description:
      "Ciel nocturne profond avec étoiles scintillantes de différentes grandeurs et liaisons stellaires au survol.",
    tags: ["Canvas", "Céleste", "Interactif"],
    params: [
      { key: "c1", label: "Étoiles", type: "color", default: "#ffffff" },
      { key: "c2", label: "Liaisons", type: "color", default: "#38bdf8" },
      {
        key: "count",
        label: "Nombre d'étoiles",
        type: "range",
        min: 40,
        max: 250,
        step: 5,
        default: 110,
      },
      {
        key: "speed",
        label: "Scintillement",
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1,
        default: 1,
      },
      {
        key: "dist",
        label: "Portée des liaisons",
        type: "range",
        min: 40,
        max: 200,
        step: 5,
        default: 110,
      },
      bg("#040612"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}${POINTER_JS}const C1='${p.c1}',C2='${p.c2}',D=${p.dist},spd=${p.speed};const S=Array.from({length:${p.count}},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.8+0.7,tw:Math.random()*0.04+0.015,p:Math.random()*6.28,vx:(Math.random()-0.5)*0.25,vy:(Math.random()-0.5)*0.25,sp:Math.random()>0.85}));let t=0;function f(){x.clearRect(0,0,w,h);tickAuto();t+=0.02*spd;for(const s of S){s.x+=s.vx*spd;s.y+=s.vy*spd;if(s.x<0)s.x=w;if(s.x>w)s.x=0;if(s.y<0)s.y=h;if(s.y>h)s.y=0}x.strokeStyle=C2;for(let i=0;i<S.length;i++){const a=S[i];for(let j=i+1;j<S.length;j++){const b=S[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<D){x.globalAlpha=(1-d/D)*0.35;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke()}}const dm=Math.hypot(a.x-mx,a.y-my);if(dm<D*1.4){x.globalAlpha=(1-dm/(D*1.4))*0.7;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(mx,my);x.stroke()}}for(const s of S){const b=0.3+0.7*Math.pow(Math.sin(t*s.tw*10+s.p),2);x.globalAlpha=b;x.fillStyle=C1;x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill();if(s.sp&&b>0.7){x.strokeStyle=C1;x.globalAlpha=(b-0.7)*1.5;x.beginPath();x.moveTo(s.x-s.r*2.5,s.y);x.lineTo(s.x+s.r*2.5,s.y);x.moveTo(s.x,s.y-s.r*2.5);x.lineTo(s.x,s.y+s.r*2.5);x.stroke()}}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "meteores",
    name: "Étoiles filantes & Météores",
    category: "fonds",
    description:
      "Traversées périodiques de comètes lumineuses avec traînées dégradées et éclats cosmiques.",
    tags: ["Canvas", "Céleste", "Dynamique"],
    params: [
      { key: "c1", label: "Tête du météore", type: "color", default: "#ffffff" },
      { key: "c2", label: "Traînée lumineuse", type: "color", default: "#38bdf8" },
      { key: "speed", label: "Vitesse", type: "range", min: 0.5, max: 4, step: 0.1, default: 1.5 },
      {
        key: "freq",
        label: "Fréquence d'apparition",
        type: "range",
        min: 1,
        max: 8,
        step: 1,
        default: 3,
      },
      {
        key: "len",
        label: "Longueur de traînée",
        type: "range",
        min: 60,
        max: 320,
        step: 10,
        default: 160,
      },
      bg("#030510"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const C1='${p.c1}',C2='${p.c2}',spd=${p.speed},frq=${p.freq},L=${p.len};const stars=Array.from({length:120},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.3+0.4,a:Math.random()}));const M=[];function spawn(){const angle=Math.PI*0.22+(Math.random()-0.5)*0.1;const v=(12+Math.random()*8)*spd;M.push({x:Math.random()*w*1.2-w*0.1,y:-30,vx:Math.cos(angle)*v,vy:Math.sin(angle)*v,len:L*(0.7+Math.random()*0.6),life:1,decay:0.012+Math.random()*0.008,sz:1.5+Math.random()*1.5})}let last=0;function f(now){x.clearRect(0,0,w,h);for(const s of stars){s.a+=0.02;const br=0.2+0.8*Math.pow(Math.sin(s.a),2);x.fillStyle=C1;x.globalAlpha=br*0.8;x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill()}if(now-last>1200/frq){last=now;if(Math.random()<0.85)spawn()}for(let i=M.length-1;i>=0;i--){const m=M[i];m.x+=m.vx;m.y+=m.vy;m.life-=m.decay;if(m.life<=0||m.x>w+200||m.y>h+200){M.splice(i,1);continue}const tx=m.x-m.vx*(m.len/(14*spd)),ty=m.y-m.vy*(m.len/(14*spd));const g=x.createLinearGradient(m.x,m.y,tx,ty);g.addColorStop(0,C1);g.addColorStop(0.3,C2);g.addColorStop(1,'transparent');x.globalAlpha=m.life;x.strokeStyle=g;x.lineWidth=m.sz;x.beginPath();x.moveTo(m.x,m.y);x.lineTo(tx,ty);x.stroke();x.fillStyle=C1;x.beginPath();x.arc(m.x,m.y,m.sz*1.2,0,7);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}requestAnimationFrame(f);`,
    }),
  },
  {
    id: "orbites-cosmiques",
    name: "Planètes & Orbites cosmiques",
    category: "fonds",
    description:
      "Planète centrale stylisée avec anneaux et corps célestes en orbites elliptiques fluides et ombres portées.",
    tags: ["Canvas", "Cosmique", "3D Style"],
    params: [
      { key: "c1", label: "Planète centrale", type: "color", default: "#f59e0b" },
      { key: "c2", label: "Anneaux & Orbites", type: "color", default: "#38bdf8" },
      { key: "c3", label: "Lunes & Satellites", type: "color", default: "#ec4899" },
      {
        key: "speed",
        label: "Vitesse orbitale",
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1,
        default: 1,
      },
      {
        key: "bodies",
        label: "Nombre d'orbites",
        type: "range",
        min: 2,
        max: 6,
        step: 1,
        default: 4,
      },
      {
        key: "size",
        label: "Diamètre central (px)",
        type: "range",
        min: 40,
        max: 140,
        step: 5,
        default: 80,
      },
      bg("#060814"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}${POINTER_JS}const C1='${p.c1}',C2='${p.c2}',C3='${p.c3}',spd=${p.speed},nb=${p.bodies},D=${p.size};const R=D/2;const tilt=-0.35,ratio=0.38;const moons=Array.from({length:nb},(v,k)=>{const rx=R*(2.2+k*1.1)*(Math.min(w,h)/600);return{rx,ry:rx*ratio,spd:(0.022-k*0.003)*spd,a:k*(6.28/nb),r:4+k*1.5}});const bgStars=Array.from({length:80},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+0.3,o:Math.random()*0.7+0.3}));function f(){x.clearRect(0,0,w,h);tickAuto();const cx=w/2+(mx-w/2)*0.04,cy=h/2+(my-h/2)*0.04;for(const s of bgStars){x.fillStyle='#fff';x.globalAlpha=s.o;x.fillRect(s.x,s.y,s.r,s.r)}x.globalAlpha=1;x.save();x.translate(cx,cy);x.rotate(tilt);x.strokeStyle=C2;x.lineWidth=1;for(const m of moons){x.globalAlpha=0.22;x.beginPath();x.ellipse(0,0,m.rx,m.ry,0,0,Math.PI*2);x.stroke()}for(const m of moons){m.a+=m.spd;m.px=Math.cos(m.a)*m.rx;m.py=Math.sin(m.a)*m.ry;m.behind=m.py<0}x.strokeStyle=C2;x.lineWidth=R*0.25;x.globalAlpha=0.55;x.beginPath();x.ellipse(0,0,R*1.7,R*1.7*ratio,0,Math.PI,Math.PI*2);x.stroke();for(const m of moons.filter(b=>b.behind)){x.fillStyle=C3;x.globalAlpha=0.7;x.beginPath();x.arc(m.px,m.py,m.r*0.8,0,7);x.fill()}const pg=x.createRadialGradient(-R*0.35,-R*0.35,R*0.1,0,0,R);pg.addColorStop(0,'#ffffff');pg.addColorStop(0.2,C1);pg.addColorStop(0.85,C1);pg.addColorStop(1,'#000000');x.globalAlpha=1;x.fillStyle=pg;x.beginPath();x.arc(0,0,R,0,Math.PI*2);x.fill();x.strokeStyle=C2;x.lineWidth=R*0.25;x.globalAlpha=0.85;x.beginPath();x.ellipse(0,0,R*1.7,R*1.7*ratio,0,0,Math.PI);x.stroke();for(const m of moons.filter(b=>!b.behind)){const mg=x.createRadialGradient(m.px-m.r*0.3,m.py-m.r*0.3,1,m.px,m.py,m.r);mg.addColorStop(0,'#fff');mg.addColorStop(0.5,C3);mg.addColorStop(1,'#111');x.fillStyle=mg;x.globalAlpha=1;x.beginPath();x.arc(m.px,m.py,m.r,0,7);x.fill()}x.restore();requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "nuages-vaporeux",
    name: "Nuages vaporeux flottants",
    category: "fonds",
    description:
      "Bancs de nuages atmosphériques multi-couches en mouvement lent pour une ambiance mystérieuse.",
    tags: ["Canvas", "Atmosphère", "Fluide"],
    params: [
      { key: "c1", label: "Nuages avant-plan", type: "color", default: "#6366f1" },
      { key: "c2", label: "Nuages intermédiaires", type: "color", default: "#ec4899" },
      { key: "c3", label: "Lueur d'ambiance", type: "color", default: "#38bdf8" },
      {
        key: "speed",
        label: "Vitesse du vent",
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1,
        default: 0.8,
      },
      {
        key: "density",
        label: "Opacité des voiles",
        type: "range",
        min: 0.2,
        max: 0.9,
        step: 0.05,
        default: 0.5,
      },
      {
        key: "blur",
        label: "Diffusion vaporeuse",
        type: "range",
        min: 20,
        max: 100,
        step: 5,
        default: 50,
      },
      bg("#090d1e"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const C1='${p.c1}',C2='${p.c2}',C3='${p.c3}',spd=${p.speed},dens=${p.density},bl=${p.blur};const layers=[{c:C3,speed:0.2,count:7,yBase:0.35,rBase:bl*3.5},{c:C2,speed:0.45,count:8,yBase:0.55,rBase:bl*3},{c:C1,speed:0.75,count:9,yBase:0.75,rBase:bl*2.6}];const P=layers.flatMap((L)=>Array.from({length:L.count},(_,i)=>({layer:L,x:(w/L.count)*i+(Math.random()-0.5)*150,y:h*L.yBase+(Math.random()-0.5)*(h*0.25),r:L.rBase*(0.8+Math.random()*0.5),seed:Math.random()*10})));let t=0;function f(){x.clearRect(0,0,w,h);t+=0.01*spd;for(const p of P){p.x+=p.layer.speed*spd*(w/900);if(p.x>w+p.r*1.5)p.x=-p.r*1.5;const currY=p.y+Math.sin(t+p.seed)*18;const currR=p.r*(1+Math.sin(t*0.7+p.seed)*0.12);const g=x.createRadialGradient(p.x,currY,currR*0.1,p.x,currY,currR);g.addColorStop(0,p.layer.c);g.addColorStop(0.5,p.layer.c);g.addColorStop(1,'transparent');x.globalAlpha=dens*0.38;x.fillStyle=g;x.beginPath();x.arc(p.x,currY,currR,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "crepuscule-dore",
    name: "Coucher lumineux & Crépuscule doré",
    category: "fonds",
    description:
      "Dégradé chaud crépusculaire avec halo solaire rasant, réfractions douces et particules dorées.",
    tags: ["Canvas", "Lumière", "Atmosphère"],
    params: [
      { key: "c1", label: "Soleil crépusculaire", type: "color", default: "#fbbf24" },
      { key: "c2", label: "Lueur de l'horizon", type: "color", default: "#f43f5e" },
      { key: "c3", label: "Ciel supérieur", type: "color", default: "#4338ca" },
      {
        key: "speed",
        label: "Vitesse de réfraction",
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1,
        default: 1,
      },
      {
        key: "halo",
        label: "Rayon du halo (px)",
        type: "range",
        min: 80,
        max: 300,
        step: 10,
        default: 180,
      },
      bg("#10091d"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}${POINTER_JS}const C1='${p.c1}',C2='${p.c2}',C3='${p.c3}',spd=${p.speed},H=${p.halo};const motes=Array.from({length:50},()=>({x:Math.random()*w,y:h*0.6+Math.random()*h*0.4,r:Math.random()*2+0.8,vy:-(0.4+Math.random()*0.8)*spd,vx:(Math.random()-0.5)*0.3,o:Math.random()*0.8+0.2}));let t=0;function f(){x.clearRect(0,0,w,h);tickAuto();t+=0.02*spd;const sunX=w/2+(mx-w/2)*0.08,sunY=h*0.68;const skyG=x.createLinearGradient(0,0,0,h);skyG.addColorStop(0,C3);skyG.addColorStop(0.55,C2);skyG.addColorStop(0.72,C1);skyG.addColorStop(1,'${p.bg}');x.fillStyle=skyG;x.fillRect(0,0,w,h);const haloR=H*(1+Math.sin(t)*0.06);const hg=x.createRadialGradient(sunX,sunY,haloR*0.1,sunX,sunY,haloR);hg.addColorStop(0,'#ffffff');hg.addColorStop(0.3,C1);hg.addColorStop(0.7,C2);hg.addColorStop(1,'transparent');x.globalAlpha=0.75;x.fillStyle=hg;x.beginPath();x.arc(sunX,sunY,haloR,0,Math.PI*2);x.fill();x.globalAlpha=1;x.fillStyle='#ffffff';x.beginPath();x.arc(sunX,sunY,H*0.28,0,Math.PI*2);x.fill();x.strokeStyle=C1;for(let r=0;r<6;r++){const rwY=sunY+r*14+Math.sin(t*2+r)*4;x.globalAlpha=0.35-r*0.05;x.lineWidth=2.5;x.beginPath();for(let px=0;px<=w;px+=15){const off=Math.sin(px*0.015+t*3+r)*3;if(px===0)x.moveTo(px,rwY+off);else x.lineTo(px,rwY+off)}x.stroke()}for(const m of motes){m.y+=m.vy;m.x+=m.vx;if(m.y<h*0.4){m.y=h+10;m.x=Math.random()*w}const br=0.3+0.7*Math.pow(Math.sin(t*2+m.r),2);x.globalAlpha=m.o*br;x.fillStyle=C1;x.beginPath();x.arc(m.x,m.y,m.r,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "aurore-ondoyante",
    name: "Aurore boréale ondoyante",
    category: "fonds",
    description:
      "Voiles de lumière céleste ondulants aux reflets émeraude et magenta sur fond d'espace.",
    tags: ["Canvas", "Céleste", "Ondulations"],
    params: [
      { key: "c1", label: "Lumière émeraude", type: "color", default: "#10b981" },
      { key: "c2", label: "Reflet magenta", type: "color", default: "#d946ef" },
      { key: "c3", label: "Lueur cyan", type: "color", default: "#06b6d4" },
      {
        key: "speed",
        label: "Vitesse d'ondulation",
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1,
        default: 1,
      },
      {
        key: "ribbons",
        label: "Nombre de voiles",
        type: "range",
        min: 2,
        max: 6,
        step: 1,
        default: 4,
      },
      {
        key: "amp",
        label: "Hauteur des voiles",
        type: "range",
        min: 40,
        max: 200,
        step: 5,
        default: 120,
      },
      bg("#040612"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const C1='${p.c1}',C2='${p.c2}',C3='${p.c3}',spd=${p.speed},rib=${p.ribbons},amp=${p.amp};const stars=Array.from({length:90},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.2+0.3,o:Math.random()}));let t=0;function f(){x.clearRect(0,0,w,h);t+=0.015*spd;for(const s of stars){x.fillStyle='#fff';x.globalAlpha=0.2+0.8*Math.pow(Math.sin(t+s.o*6),2);x.fillRect(s.x,s.y,s.r,s.r)}x.globalCompositeOperation='screen';for(let r=0;r<rib;r++){const colors=[C1,C2,C3];const baseCol=colors[r%colors.length];const yOffset=h*(0.3+r*0.1);const step=16;for(let px=0;px<w;px+=step){const wave1=Math.sin(px*0.004+t*(1+r*0.2)+r)*amp;const wave2=Math.sin(px*0.01-t*0.8+r*2)*(amp*0.4);const py=yOffset+wave1+wave2;const beamH=amp*(1.4+Math.sin(px*0.006+t)*0.5);const g=x.createLinearGradient(px,py-beamH,px,py+beamH*0.5);g.addColorStop(0,'transparent');g.addColorStop(0.35,baseCol);g.addColorStop(0.7,C1);g.addColorStop(1,'transparent');x.globalAlpha=0.32;x.fillStyle=g;x.fillRect(px,py-beamH,step+2,beamH*1.5)}}x.globalCompositeOperation='source-over';x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "orbes-lumineuses",
    name: "Orbes lumineuses",
    category: "fonds",
    description:
      "Orbes translucides qui montent lentement avec des reflets changeants, ambiance douce et premium.",
    tags: ["Canvas", "Lumière", "Zen"],
    params: [
      { key: "c1", label: "Couleur des orbes", type: "color", default: "#4ade80" },
      { key: "c2", label: "Reflet secondaire", type: "color", default: "#38bdf8" },
      { key: "count", label: "Nombre d'orbes", type: "range", min: 8, max: 60, step: 2, default: 24 },
      {
        key: "speed",
        label: "Vitesse d'ascension",
        type: "range",
        min: 0.1,
        max: 3,
        step: 0.1,
        default: 0.6,
      },
      {
        key: "size",
        label: "Taille maximale (px)",
        type: "range",
        min: 15,
        max: 90,
        step: 5,
        default: 45,
      },
      bg("#060a0f"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const C1='${p.c1}',C2='${p.c2}',spd=${p.speed},MX=${p.size};const O=Array.from({length:${p.count}},()=>({x:Math.random()*w,y:Math.random()*h,r:MX*(0.3+Math.random()*0.7),v:(0.2+Math.random()*0.8)*spd,seed:Math.random()*10,c:Math.random()>0.5?C1:C2,a:0.25+Math.random()*0.45}));function f(){x.clearRect(0,0,w,h);x.fillStyle='${p.bg}';x.fillRect(0,0,w,h);const now=performance.now()/1000;for(const o of O){o.y-=o.v;if(o.y<-o.r){o.y=h+o.r;o.x=Math.random()*w}o.x+=Math.sin(now*0.5+o.seed)*0.3;const g=x.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);g.addColorStop(0,o.c);g.addColorStop(0.35,o.c+'66');g.addColorStop(1,'transparent');x.globalAlpha=o.a;x.fillStyle=g;x.beginPath();x.arc(o.x,o.y,o.r,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "fluide-magnetique",
    name: "Fluide magnétique",
    category: "fonds",
    description:
      "Masses organiques aux dégradés fondus qui glissent lentement, avec une lueur attirée par le curseur.",
    tags: ["Canvas", "Fluide", "Interactif"],
    params: [
      { key: "c1", label: "Masse 1", type: "color", default: "#4ade80" },
      { key: "c2", label: "Masse 2", type: "color", default: "#38bdf8" },
      { key: "c3", label: "Masse 3", type: "color", default: "#f472b6" },
      {
        key: "speed",
        label: "Vitesse de dérive",
        type: "range",
        min: 0.1,
        max: 3,
        step: 0.1,
        default: 0.8,
      },
      {
        key: "size",
        label: "Taille des masses (px)",
        type: "range",
        min: 100,
        max: 500,
        step: 10,
        default: 280,
      },
      bg("#060a0f"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}${POINTER_JS}const C1='${p.c1}',C2='${p.c2}',C3='${p.c3}',spd=${p.speed},R=${p.size};const B=[{c:C1,ph:0},{c:C2,ph:2.1},{c:C3,ph:4.2}];let t=0;function f(){x.clearRect(0,0,w,h);x.fillStyle='${p.bg}';x.fillRect(0,0,w,h);tickAuto();t+=0.008*spd;x.globalCompositeOperation='screen';for(const b of B){const bx=w*0.5+Math.sin(t+b.ph)*w*0.32,by=h*0.5+Math.cos(t*0.8+b.ph*1.4)*h*0.3,br=R*(0.8+Math.sin(t*1.3+b.ph)*0.2);const g=x.createRadialGradient(bx,by,0,bx,by,br);g.addColorStop(0,b.c+'88');g.addColorStop(0.6,b.c+'33');g.addColorStop(1,'transparent');x.fillStyle=g;x.beginPath();x.arc(bx,by,br,0,Math.PI*2);x.fill()}const g2=x.createRadialGradient(mx,my,0,mx,my,R*0.5);g2.addColorStop(0,C1+'44');g2.addColorStop(1,'transparent');x.fillStyle=g2;x.beginPath();x.arc(mx,my,R*0.5,0,Math.PI*2);x.fill();x.globalCompositeOperation='source-over';requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "pluie-vitre",
    name: "Pluie sur vitre",
    category: "fonds",
    description:
      "Averse réaliste vue de derrière une vitre : pluie fine en arrière-plan et gros filets d'eau qui coulent.",
    tags: ["Canvas", "Pluie", "Ambiance"],
    params: [
      { key: "color", label: "Couleur de l'eau", type: "color", default: "#7dd3fc" },
      { key: "count", label: "Densité de la pluie", type: "range", min: 20, max: 200, step: 10, default: 90 },
      {
        key: "density",
        label: "Filets qui coulent",
        type: "range",
        min: 4,
        max: 30,
        step: 1,
        default: 14,
      },
      { key: "speed", label: "Vitesse", type: "range", min: 0.2, max: 3, step: 0.1, default: 1 },
      bg("#0a0f14"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const C='${p.color}',spd=${p.speed};const rain=Array.from({length:${p.count}},()=>({x:Math.random()*w,y:Math.random()*h,l:8+Math.random()*14,v:(6+Math.random()*8)*spd}));const streaks=Array.from({length:${p.density}},()=>({x:Math.random()*w,y:Math.random()*h,r:1.5+Math.random()*3.5,v:(0.4+Math.random()*1.2)*spd,sw:0.4+Math.random()*1.2,trail:[]}));function f(){x.clearRect(0,0,w,h);x.fillStyle='${p.bg}';x.fillRect(0,0,w,h);x.strokeStyle=C;x.lineWidth=1;for(const d of rain){d.y+=d.v;d.x+=d.v*0.12;if(d.y>h){d.y=-d.l;d.x=Math.random()*w}x.globalAlpha=0.35;x.beginPath();x.moveTo(d.x,d.y);x.lineTo(d.x+d.v*0.12,d.y+d.l);x.stroke()}for(const s of streaks){s.y+=s.v;s.x+=Math.sin(s.y*0.01)*s.sw*0.5;s.trail.push({x:s.x,y:s.y});if(s.trail.length>22)s.trail.shift();if(s.y>h+20){s.y=-20;s.x=Math.random()*w;s.trail=[]}for(let i=1;i<s.trail.length;i++){const a=i/s.trail.length;x.globalAlpha=0.7*a;x.lineWidth=s.r*a*1.6;x.beginPath();x.moveTo(s.trail[i-1].x,s.trail[i-1].y);x.lineTo(s.trail[i].x,s.trail[i].y);x.stroke()}x.globalAlpha=0.85;x.fillStyle=C;x.beginPath();x.arc(s.x,s.y,s.r*0.6,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "profondeur-oceanique",
    name: "Profondeur océanique",
    category: "fonds",
    description:
      "Rayons de lumière sous-marins qui oscillent entre des particules en suspension, ambiance abyssale.",
    tags: ["Canvas", "Océan", "Lumière"],
    params: [
      { key: "c1", label: "Rayons de lumière", type: "color", default: "#7ef0b0" },
      { key: "c2", label: "Particules", type: "color", default: "#a5f3fc" },
      {
        key: "count",
        label: "Particules en suspension",
        type: "range",
        min: 20,
        max: 200,
        step: 10,
        default: 80,
      },
      {
        key: "speed",
        label: "Vitesse des courants",
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1,
        default: 0.8,
      },
      {
        key: "halo",
        label: "Largeur des rayons (px)",
        type: "range",
        min: 20,
        max: 120,
        step: 5,
        default: 60,
      },
      bg("#041019"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg}}${CANVAS_CSS}`,
      js: `${CANVAS_JS}const C1='${p.c1}',C2='${p.c2}',spd=${p.speed},RW=${p.halo};const motes=Array.from({length:${p.count}},()=>({x:Math.random()*w,y:Math.random()*h,r:0.5+Math.random()*1.8,v:(0.15+Math.random()*0.5)*spd,sw:Math.random()*2,seed:Math.random()*10}));let t=0;function f(){x.clearRect(0,0,w,h);const g0=x.createLinearGradient(0,0,0,h);g0.addColorStop(0,'${p.bg}');g0.addColorStop(1,'#01060b');x.fillStyle=g0;x.fillRect(0,0,w,h);t+=0.012*spd;x.globalCompositeOperation='screen';for(let r=0;r<5;r++){const rx=w*(0.12+r*0.19)+Math.sin(t*0.4+r*1.3)*40;const tilt=0.22+0.06*Math.sin(t*0.25+r);const g=x.createLinearGradient(rx,0,rx+RW*2.2,h);g.addColorStop(0,C1+'55');g.addColorStop(1,'transparent');x.fillStyle=g;x.beginPath();x.moveTo(rx,0);x.lineTo(rx+RW,0);x.lineTo(rx+RW*2.2+h*tilt,h);x.lineTo(rx+h*tilt,h);x.closePath();x.fill()}x.globalCompositeOperation='source-over';for(const m of motes){m.y-=m.v;if(m.y<-5)m.y=h+5;m.x+=Math.sin(t*m.sw+m.seed)*0.3;x.fillStyle=C2;x.globalAlpha=0.25+0.55*Math.pow(Math.sin(t*2+m.seed),2);x.beginPath();x.arc(m.x,m.y,m.r,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "trainee",
    name: "Traînée lumineuse",
    category: "curseurs",
    description: "Une chaîne de points suit le curseur avec un amorti élastique.",
    tags: ["JS", "Pointer"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#7cff6b" },
      { key: "count", label: "Longueur", type: "range", min: 4, max: 40, step: 1, default: 18 },
      { key: "size", label: "Taille", type: "range", min: 4, max: 40, step: 1, default: 16 },
      {
        key: "ease",
        label: "Réactivité",
        type: "range",
        min: 0.05,
        max: 0.9,
        step: 0.05,
        default: 0.35,
      },
      bg(),
    ],
    generate: (p) => ({
      html: HINT,
      css: `body{background:${p.bg};cursor:none}${HINT_CSS}.trail-dot{position:fixed;pointer-events:none;border-radius:50%;background:${p.color};box-shadow:0 0 12px ${p.color};transform:translate(-50%,-50%)}`,
      js: `${POINTER_JS}const N=${p.count},dots=[];for(let i=0;i<N;i++){const d=document.createElement('div');d.className='trail-dot';const s=${p.size}*(1-i/N);d.style.width=d.style.height=s+'px';d.style.opacity=1-i/N;document.body.appendChild(d);dots.push({el:d,x:mx,y:my})}function f(){tickAuto();let px=mx,py=my;dots.forEach(d=>{d.x+=(px-d.x)*${p.ease};d.y+=(py-d.y)*${p.ease};d.el.style.left=d.x+'px';d.el.style.top=d.y+'px';px=d.x;py=d.y});requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "anneau",
    name: "Anneau magnétique",
    category: "curseurs",
    description: "Point précis + anneau retardé qui grossit sur les éléments cliquables.",
    tags: ["JS", "Hover"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#22d3ee" },
      {
        key: "size",
        label: "Taille de l'anneau",
        type: "range",
        min: 20,
        max: 90,
        step: 2,
        default: 40,
      },
      {
        key: "ease",
        label: "Réactivité",
        type: "range",
        min: 0.05,
        max: 0.6,
        step: 0.01,
        default: 0.15,
      },
      bg(),
    ],
    generate: (p) => ({
      html: `<button class="demo-btn">Survolez-moi</button><div class="c-dot"></div><div class="c-ring"></div>`,
      css: `body{background:${p.bg};cursor:none}${CENTER}.demo-btn{padding:14px 28px;border-radius:999px;border:1px solid #ffffff30;background:transparent;color:#fff;font:600 15px system-ui;cursor:none}.c-dot,.c-ring{position:fixed;left:0;top:0;pointer-events:none;border-radius:50%;transform:translate(-50%,-50%)}.c-dot{width:6px;height:6px;background:${p.color}}.c-ring{width:${p.size}px;height:${p.size}px;border:2px solid ${p.color};transition:width .25s,height .25s,background .25s}.c-ring.big{width:${Number(p.size) * 1.8}px;height:${Number(p.size) * 1.8}px;background:${p.color}22}`,
      js: `${POINTER_JS}const dot=document.querySelector('.c-dot'),ring=document.querySelector('.c-ring');let rx=mx,ry=my;document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('pointerenter',()=>ring.classList.add('big'));el.addEventListener('pointerleave',()=>ring.classList.remove('big'))});function f(){tickAuto();rx+=(mx-rx)*${p.ease};ry+=(my-ry)*${p.ease};dot.style.left=mx+'px';dot.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "projecteur",
    name: "Projecteur",
    category: "curseurs",
    description: "Un halo de lumière révèle la page sous le curseur.",
    tags: ["CSS vars", "JS"],
    params: [
      { key: "color", label: "Couleur du halo", type: "color", default: "#f472b6" },
      { key: "radius", label: "Rayon", type: "range", min: 80, max: 600, step: 10, default: 260 },
      {
        key: "ease",
        label: "Réactivité",
        type: "range",
        min: 0.05,
        max: 1,
        step: 0.05,
        default: 0.2,
      },
      bg("#08080c"),
    ],
    generate: (p) => ({
      html: `<div class="spot"></div>`,
      css: `body{background:${p.bg}}.spot{position:fixed;inset:0;background-image:radial-gradient(circle ${p.radius}px at var(--x,50%) var(--y,50%),${p.color}55,transparent 70%),linear-gradient(#ffffff10 1px,transparent 1px),linear-gradient(90deg,#ffffff10 1px,transparent 1px);background-size:auto,32px 32px,32px 32px}`,
      js: `${POINTER_JS}const s=document.querySelector('.spot');let sx=mx,sy=my;function f(){tickAuto();sx+=(mx-sx)*${p.ease};sy+=(my-sy)*${p.ease};s.style.setProperty('--x',sx+'px');s.style.setProperty('--y',sy+'px');requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "etincelles",
    name: "Étincelles",
    category: "curseurs",
    description: "Le curseur projette des étincelles soumises à la gravité.",
    tags: ["Canvas", "Particules"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#facc15" },
      { key: "count", label: "Émission", type: "range", min: 1, max: 12, step: 1, default: 4 },
      {
        key: "gravity",
        label: "Gravité",
        type: "range",
        min: 0,
        max: 0.5,
        step: 0.01,
        default: 0.12,
      },
      bg(),
    ],
    generate: (p) => ({
      html: CANVAS_HTML + HINT,
      css: `body{background:${p.bg}}${CANVAS_CSS}${HINT_CSS}`,
      js: `${CANVAS_JS}${POINTER_JS}const P=[];function f(){tickAuto();for(let i=0;i<${p.count};i++)P.push({x:mx,y:my,vx:(Math.random()-.5)*4,vy:(Math.random()-1)*3,l:1});x.clearRect(0,0,w,h);x.fillStyle='${p.color}';for(let i=P.length-1;i>=0;i--){const q=P[i];q.vy+=${p.gravity};q.x+=q.vx;q.y+=q.vy;q.l-=.02;if(q.l<=0){P.splice(i,1);continue}x.globalAlpha=q.l;x.beginPath();x.arc(q.x,q.y,2.2*q.l+.5,0,7);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "curseur-cameleon",
    name: "Curseur caméléon",
    category: "curseurs",
    description:
      "Point précis entouré d'un double anneau qui change de couleur selon la zone survolée.",
    tags: ["Canvas", "Pointer", "Couleurs"],
    params: [
      { key: "c1", label: "Zone 1", type: "color", default: "#f472b6" },
      { key: "c2", label: "Zone 2", type: "color", default: "#38bdf8" },
      { key: "c3", label: "Zone 3", type: "color", default: "#fbbf24" },
      {
        key: "size",
        label: "Taille de l'anneau",
        type: "range",
        min: 16,
        max: 80,
        step: 2,
        default: 34,
      },
      {
        key: "ease",
        label: "Réactivité",
        type: "range",
        min: 0.05,
        max: 0.6,
        step: 0.01,
        default: 0.2,
      },
      bg("#08080c"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML,
      css: `body{background:${p.bg};cursor:none}${CANVAS_CSS}`,
      js: `${CANVAS_JS}${POINTER_JS}const Z=['${p.c1}','${p.c2}','${p.c3}'];let rx=mx,ry=my;function f(){tickAuto();x.clearRect(0,0,w,h);const zw=w/Z.length;for(let i=0;i<Z.length;i++){x.fillStyle=Z[i]+'0d';x.fillRect(i*zw,0,zw,h)}const c=Z[Math.min(Z.length-1,Math.floor(mx/zw))];const t=performance.now()/1000;rx+=(mx-rx)*${p.ease};ry+=(my-ry)*${p.ease};x.strokeStyle=c;x.globalAlpha=0.35;x.lineWidth=1.5;x.beginPath();x.arc(rx,ry,${p.size}*1.9,0,Math.PI*2);x.stroke();x.globalAlpha=0.12;x.fillStyle=c;x.beginPath();x.arc(rx,ry,${p.size}*1.9,0,Math.PI*2);x.fill();x.globalAlpha=1;x.lineWidth=2.5;x.beginPath();x.arc(rx,ry,${p.size}/2+Math.sin(t*3)*2,0,Math.PI*2);x.stroke();x.fillStyle=c;x.beginPath();x.arc(mx,my,3,0,Math.PI*2);x.fill();requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "curseur-repulseur",
    name: "Curseur répulseur",
    category: "curseurs",
    description:
      "Un nuage de particules qui fuit le curseur comme un aimant inversé, puis regagne sa place en douceur.",
    tags: ["Canvas", "Particules", "Interactif"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#4ade80" },
      { key: "count", label: "Particules", type: "range", min: 50, max: 400, step: 10, default: 200 },
      {
        key: "size",
        label: "Rayon de répulsion",
        type: "range",
        min: 60,
        max: 320,
        step: 10,
        default: 150,
      },
      {
        key: "speed",
        label: "Vitesse de retour",
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1,
        default: 1,
      },
      bg("#060a0f"),
    ],
    generate: (p) => ({
      html: CANVAS_HTML + HINT,
      css: `body{background:${p.bg}}${CANVAS_CSS}${HINT_CSS}`,
      js: `${CANVAS_JS}${POINTER_JS}const C='${p.color}',R=${p.size},rsp=${p.speed};const P=Array.from({length:${p.count}},()=>({hx:Math.random()*w,hy:Math.random()*h,x:0,y:0,vx:0,vy:0,r:0.8+Math.random()*2,init:false}));function f(){tickAuto();x.clearRect(0,0,w,h);x.fillStyle='${p.bg}';x.fillRect(0,0,w,h);x.fillStyle=C;for(const q of P){if(!q.init){q.x=q.hx;q.y=q.hy;q.init=true}const dx=q.x-mx,dy=q.y-my,d=Math.hypot(dx,dy);if(d<R&&d>0.1){const fo=(R-d)/R*1.6;q.vx+=dx/d*fo;q.vy+=dy/d*fo}q.vx*=0.9;q.vy*=0.9;q.x+=q.vx*0.02;q.y+=q.vy*0.02;q.x+=(q.hx-q.x)*0.004*rsp;q.y+=(q.hy-q.y)*0.004*rsp;const sp=Math.hypot(q.vx,q.vy);x.globalAlpha=Math.min(1,0.35+sp*0.25);x.beginPath();x.arc(q.x,q.y,q.r,0,Math.PI*2);x.fill()}x.globalAlpha=1;requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "conique",
    name: "Bordure conique",
    category: "cadres",
    description: "Un dégradé tourne en continu autour de la carte.",
    tags: ["CSS", "@property"],
    params: [
      { key: "c1", label: "Couleur 1", type: "color", default: "#7cff6b" },
      { key: "c2", label: "Couleur 2", type: "color", default: "#22d3ee" },
      {
        key: "speed",
        label: "Tour complet (s)",
        type: "range",
        min: 0.5,
        max: 12,
        step: 0.5,
        default: 3,
      },
      { key: "thick", label: "Épaisseur", type: "range", min: 1, max: 12, step: 1, default: 3 },
      { key: "radius", label: "Arrondi", type: "range", min: 0, max: 40, step: 1, default: 18 },
      bg(),
    ],
    generate: (p) => ({
      html: `<div class="cone"><div>Votre contenu</div></div>`,
      css: `body{background:${p.bg}}${CENTER}@property --a{syntax:'<angle>';initial-value:0deg;inherits:false}.cone{width:280px;height:180px;padding:${p.thick}px;border-radius:${p.radius}px;background:conic-gradient(from var(--a),${p.c1},${p.c2},transparent 60%,${p.c1});animation:cone ${p.speed}s linear infinite;box-shadow:0 0 40px -10px ${p.c1}}.cone>div{height:100%;border-radius:${Math.max(0, Number(p.radius) - Number(p.thick))}px;background:#111116;display:grid;place-items:center;color:#eee;font:600 18px system-ui}@keyframes cone{to{--a:360deg}}`,
      js: ``,
    }),
  },
  {
    id: "neon",
    name: "Néon pulsant",
    category: "cadres",
    description: "Une lueur néon qui respire autour de l'élément.",
    tags: ["CSS", "Sans JS"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#f472b6" },
      {
        key: "speed",
        label: "Respiration (s)",
        type: "range",
        min: 0.3,
        max: 6,
        step: 0.1,
        default: 2,
      },
      { key: "glow", label: "Intensité", type: "range", min: 4, max: 60, step: 1, default: 24 },
      bg(),
    ],
    generate: (p) => ({
      html: `<div class="neon">NEON</div>`,
      css: `body{background:${p.bg}}${CENTER}.neon{width:260px;height:160px;display:grid;place-items:center;border:2px solid ${p.color};border-radius:14px;color:${p.color};font:700 32px system-ui;letter-spacing:.3em;animation:neon ${p.speed}s ease-in-out infinite}@keyframes neon{0%,100%{box-shadow:0 0 ${Number(p.glow) / 4}px ${p.color},inset 0 0 ${Number(p.glow) / 4}px ${p.color};text-shadow:0 0 4px ${p.color}}50%{box-shadow:0 0 ${p.glow}px ${p.color},inset 0 0 ${Number(p.glow) / 2}px ${p.color};text-shadow:0 0 ${Number(p.glow) / 2}px ${p.color}}}`,
      js: ``,
    }),
  },
  {
    id: "fourmis",
    name: "Pointillés en marche",
    category: "cadres",
    description: "Contour en tirets qui défile, parfait pour les zones de dépôt.",
    tags: ["SVG", "CSS"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#7cff6b" },
      { key: "speed", label: "Durée (s)", type: "range", min: 0.2, max: 6, step: 0.1, default: 1 },
      {
        key: "dash",
        label: "Longueur des tirets",
        type: "range",
        min: 2,
        max: 40,
        step: 1,
        default: 10,
      },
      bg(),
    ],
    generate: (p) => ({
      html: `<div class="ants"><svg><rect rx="14"/></svg><span>Déposez vos fichiers</span></div>`,
      css: `body{background:${p.bg}}${CENTER}.ants{position:relative;width:280px;height:170px;display:grid;place-items:center;color:#ddd;font:500 16px system-ui}.ants svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}.ants rect{x:1px;y:1px;width:calc(100% - 2px);height:calc(100% - 2px);fill:none;stroke:${p.color};stroke-width:2;stroke-dasharray:${p.dash} ${p.dash};animation:ants ${p.speed}s linear infinite}@keyframes ants{to{stroke-dashoffset:-${Number(p.dash) * 2}}}`,
      js: ``,
    }),
  },
  {
    id: "viseur",
    name: "Coins viseur",
    category: "cadres",
    description: "Quatre coins qui se resserrent comme un viseur de mise au point.",
    tags: ["CSS", "Sans JS"],
    params: [
      { key: "color", label: "Couleur", type: "color", default: "#22d3ee" },
      {
        key: "speed",
        label: "Durée (s)",
        type: "range",
        min: 0.4,
        max: 6,
        step: 0.1,
        default: 1.6,
      },
      {
        key: "size",
        label: "Taille des coins",
        type: "range",
        min: 10,
        max: 60,
        step: 1,
        default: 26,
      },
      bg(),
    ],
    generate: (p) => ({
      html: `<div class="scope"><i></i><i></i><i></i><i></i>Focus</div>`,
      css: `body{background:${p.bg}}${CENTER}.scope{position:relative;width:240px;height:150px;display:grid;place-items:center;color:#eee;font:600 18px system-ui;letter-spacing:.2em;text-transform:uppercase}.scope i{position:absolute;width:${p.size}px;height:${p.size}px;border:3px solid ${p.color};animation:scope ${p.speed}s ease-in-out infinite alternate}.scope i:nth-child(1){top:0;left:0;border-right:0;border-bottom:0;--dx:-12px;--dy:-12px}.scope i:nth-child(2){top:0;right:0;border-left:0;border-bottom:0;--dx:12px;--dy:-12px}.scope i:nth-child(3){bottom:0;left:0;border-right:0;border-top:0;--dx:-12px;--dy:12px}.scope i:nth-child(4){bottom:0;right:0;border-left:0;border-top:0;--dx:12px;--dy:12px}@keyframes scope{to{transform:translate(var(--dx),var(--dy))}}`,
      js: ``,
    }),
  },
  {
    id: "bordure-lumiere",
    name: "Bordure lumière rasante",
    category: "cadres",
    description:
      "Un reflet coloré suit le curseur le long des bords de la carte, avec halo interne au survol.",
    tags: ["CSS vars", "Interactif"],
    params: [
      { key: "color", label: "Couleur du reflet", type: "color", default: "#4ade80" },
      {
        key: "glow",
        label: "Portée du reflet (px)",
        type: "range",
        min: 60,
        max: 400,
        step: 10,
        default: 180,
      },
      { key: "thick", label: "Épaisseur de bordure", type: "range", min: 1, max: 6, step: 1, default: 2 },
      { key: "radius", label: "Arrondi", type: "range", min: 0, max: 40, step: 1, default: 16 },
      bg(),
    ],
    generate: (p) => ({
      html: `<div class="lc"><div class="lc-in">Votre contenu</div></div>`,
      css: `body{background:${p.bg}}${CENTER}.lc{position:relative;width:280px;height:170px;border-radius:${p.radius}px;padding:${p.thick}px;background:#1a1a22}.lc-in{position:relative;overflow:hidden;height:100%;border-radius:${Math.max(0, Number(p.radius) - Number(p.thick))}px;background:#101016;display:grid;place-items:center;color:#eee;font:600 17px system-ui}.lc::before{content:'';position:absolute;inset:-1px;border-radius:${p.radius}px;padding:${p.thick}px;background:radial-gradient(circle ${p.glow}px at var(--x,50%) var(--y,50%),${p.color},transparent 70%);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}.lc-in::after{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle ${p.glow}px at var(--x,50%) var(--y,50%),${p.color}22,transparent 70%);opacity:0;transition:opacity .3s}.lc:hover .lc-in::after{opacity:1}`,
      js: `const c=document.querySelector('.lc');c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left)+'px');c.style.setProperty('--y',(e.clientY-r.top)+'px')});c.addEventListener('pointerleave',()=>{c.style.setProperty('--x','50%');c.style.setProperty('--y','50%')});`,
    }),
  },
  {
    id: "scintillement",
    name: "Texte scintillant",
    category: "textes",
    description: "Un reflet lumineux balaie le titre en boucle.",
    tags: ["CSS", "Sans JS"],
    params: [
      { key: "text", label: "Texte", type: "text", default: "Motion Studio" },
      { key: "c1", label: "Couleur de base", type: "color", default: "#6b7280" },
      { key: "c2", label: "Reflet", type: "color", default: "#ffffff" },
      {
        key: "speed",
        label: "Durée (s)",
        type: "range",
        min: 0.5,
        max: 8,
        step: 0.1,
        default: 2.5,
      },
      { key: "size", label: "Taille (px)", type: "range", min: 20, max: 120, step: 2, default: 56 },
      bg(),
    ],
    generate: (p) => ({
      html: `<h1 class="shine">${p.text}</h1>`,
      css: `body{background:${p.bg}}${CENTER}.shine{margin:0;font:800 ${p.size}px system-ui;letter-spacing:-.03em;background:linear-gradient(110deg,${p.c1} 40%,${p.c2} 50%,${p.c1} 60%);background-size:250% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:shine ${p.speed}s linear infinite}@keyframes shine{from{background-position:100% 0}to{background-position:-150% 0}}`,
      js: ``,
    }),
  },
  {
    id: "machine",
    name: "Machine à écrire",
    category: "textes",
    description: "Le texte s'écrit et s'efface lettre par lettre.",
    tags: ["JS", "Boucle"],
    params: [
      {
        key: "text",
        label: "Phrases (séparées par |)",
        type: "text",
        default: "Concevez.|Animez.|Intégrez.",
      },
      { key: "color", label: "Couleur", type: "color", default: "#7cff6b" },
      {
        key: "speed",
        label: "Délai par lettre (ms)",
        type: "range",
        min: 20,
        max: 300,
        step: 10,
        default: 90,
      },
      { key: "size", label: "Taille (px)", type: "range", min: 20, max: 100, step: 2, default: 48 },
      bg(),
    ],
    generate: (p) => ({
      html: `<h1 class="tw"><span class="tw-t"></span><span class="tw-c">|</span></h1>`,
      css: `body{background:${p.bg}}${CENTER}.tw{margin:0;color:${p.color};font:700 ${p.size}px ui-monospace,monospace}.tw-c{animation:blink 1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`,
      js: `const W=${JSON.stringify(String(p.text).split("|"))},el=document.querySelector('.tw-t');let i=0,j=0,del=false;function f(){const s=W[i];el.textContent=s.slice(0,j);if(!del&&j<s.length)j++;else if(!del){del=true;return setTimeout(f,1200)}else if(j>0)j--;else{del=false;i=(i+1)%W.length}setTimeout(f,del?${p.speed}/2:${p.speed})}f();`,
    }),
  },
  {
    id: "glitch",
    name: "Glitch RVB",
    category: "textes",
    description: "Décalages chromatiques saccadés façon signal corrompu.",
    tags: ["CSS", "Sans JS"],
    params: [
      { key: "text", label: "Texte", type: "text", default: "GLITCH" },
      { key: "c1", label: "Canal 1", type: "color", default: "#22d3ee" },
      { key: "c2", label: "Canal 2", type: "color", default: "#f472b6" },
      { key: "speed", label: "Durée (s)", type: "range", min: 0.3, max: 5, step: 0.1, default: 2 },
      { key: "size", label: "Taille (px)", type: "range", min: 20, max: 140, step: 2, default: 72 },
      bg(),
    ],
    generate: (p) => ({
      html: `<h1 class="gl" data-t="${p.text}">${p.text}</h1>`,
      css: `body{background:${p.bg}}${CENTER}.gl{position:relative;margin:0;color:#fff;font:900 ${p.size}px system-ui;letter-spacing:.05em}.gl::before,.gl::after{content:attr(data-t);position:absolute;inset:0}.gl::before{color:${p.c1};animation:gl1 ${p.speed}s infinite steps(1);mix-blend-mode:screen}.gl::after{color:${p.c2};animation:gl2 ${p.speed}s infinite steps(1);mix-blend-mode:screen}@keyframes gl1{0%,100%{transform:none;clip-path:inset(0 0 0 0)}10%{transform:translate(-4px,2px);clip-path:inset(10% 0 60% 0)}30%{transform:translate(3px,-2px);clip-path:inset(50% 0 20% 0)}55%{transform:translate(-2px,0);clip-path:inset(80% 0 5% 0)}}@keyframes gl2{0%,100%{transform:none;clip-path:inset(0 0 0 0)}15%{transform:translate(4px,-1px);clip-path:inset(60% 0 10% 0)}40%{transform:translate(-3px,2px);clip-path:inset(20% 0 55% 0)}70%{transform:translate(2px,1px);clip-path:inset(5% 0 80% 0)}}`,
      js: ``,
    }),
  },
  {
    id: "texte-degrade",
    name: "Texte dégradé animé",
    category: "textes",
    description: "Dégradé multicolore qui coule en boucle à travers les lettres.",
    tags: ["CSS", "Sans JS"],
    params: [
      { key: "text", label: "Texte", type: "text", default: "MotionKit" },
      { key: "c1", label: "Couleur 1", type: "color", default: "#7cff6b" },
      { key: "c2", label: "Couleur 2", type: "color", default: "#22d3ee" },
      { key: "c3", label: "Couleur 3", type: "color", default: "#f472b6" },
      {
        key: "speed",
        label: "Durée du cycle (s)",
        type: "range",
        min: 1,
        max: 20,
        step: 0.5,
        default: 6,
      },
      { key: "size", label: "Taille (px)", type: "range", min: 20, max: 140, step: 2, default: 64 },
      bg(),
    ],
    generate: (p) => ({
      html: `<h1 class="flow">${p.text}</h1>`,
      css: `body{background:${p.bg}}${CENTER}.flow{margin:0;font:800 ${p.size}px system-ui;letter-spacing:-.03em;background:linear-gradient(90deg,${p.c1},${p.c2},${p.c3},${p.c1});background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:flow ${p.speed}s linear infinite}@keyframes flow{from{background-position:0 0}to{background-position:300% 0}}`,
      js: ``,
    }),
  },
  {
    id: "texte-ondulant",
    name: "Texte ondulant",
    category: "textes",
    description: "Les lettres flottent en vague, comme portées par la houle.",
    tags: ["JS", "Lettres"],
    params: [
      { key: "text", label: "Texte", type: "text", default: "Vagues de lettres" },
      { key: "c1", label: "Couleur", type: "color", default: "#22d3ee" },
      {
        key: "speed",
        label: "Vitesse",
        type: "range",
        min: 0.2,
        max: 4,
        step: 0.1,
        default: 1,
      },
      { key: "amp", label: "Amplitude (px)", type: "range", min: 4, max: 40, step: 1, default: 14 },
      { key: "size", label: "Taille (px)", type: "range", min: 20, max: 120, step: 2, default: 56 },
      bg(),
    ],
    generate: (p) => ({
      html: `<h1 class="wave-t" id="wt"></h1>`,
      css: `body{background:${p.bg}}${CENTER}.wave-t{margin:0;font:800 ${p.size}px system-ui;letter-spacing:-.02em}.wave-t span{display:inline-block;white-space:pre;color:${p.c1}}`,
      js: `const T=${JSON.stringify(String(p.text))},el=document.getElementById('wt');for(const ch of T){const s=document.createElement('span');s.textContent=ch;el.appendChild(s)}const sp=[...el.children];let t=0;function f(){t+=0.02*${p.speed};sp.forEach((s,i)=>{s.style.transform='translateY('+Math.sin(t*2.2+i*0.35)*${p.amp}+'px) rotate('+Math.sin(t*2.2+i*0.35)*4+'deg)'});requestAnimationFrame(f)}f();`,
    }),
  },
  {
    id: "mots-tournants",
    name: "Mots tournants",
    category: "textes",
    description: "Les mots se remplacent par une rotation 3D façon panneau d'affichage.",
    tags: ["JS", "3D"],
    params: [
      {
        key: "text",
        label: "Mots (séparés par |)",
        type: "text",
        default: "élégant|fluide|vivant|magique",
      },
      { key: "color", label: "Couleur", type: "color", default: "#7cff6b" },
      {
        key: "speed",
        label: "Pause entre mots (s)",
        type: "range",
        min: 0.4,
        max: 5,
        step: 0.1,
        default: 1.6,
      },
      { key: "size", label: "Taille (px)", type: "range", min: 20, max: 120, step: 2, default: 60 },
      bg(),
    ],
    generate: (p) => ({
      html: `<h1 class="flip-t" id="ft"></h1>`,
      css: `body{background:${p.bg}}${CENTER}.flip-t{margin:0;color:${p.color};font:800 ${p.size}px system-ui;letter-spacing:-.02em;transform-style:preserve-3d}`,
      js: `const W=${JSON.stringify(String(p.text).split("|"))},el=document.getElementById('ft');let i=0,t0=performance.now(),phase='hold',dur=${p.speed}*1000;el.textContent=W[0];function f(now){if(phase==='hold'){if(now-t0>=dur){phase='flip';t0=now}}else{const a=Math.min(1,(now-t0)/600);el.style.transform='perspective(600px) rotateX('+(a*Math.PI)+'rad)';if(a>=0.5)el.textContent=W[(i+1)%W.length];if(a>=1){i=(i+1)%W.length;phase='hold';t0=now;el.style.transform='none'}}requestAnimationFrame(f)}requestAnimationFrame(f);`,
    }),
  },
];

export function defaults(e: Effect): Values {
  return Object.fromEntries(e.params.map((p) => [p.key, p.default]));
}

export function buildDoc(e: Effect, v: Values = defaults(e)): string {
  const { html, css, js } = e.generate(v);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e.name}</title>
<style>
html,body{margin:0;height:100%;overflow:hidden}
${css}
</style>
</head>
<body>
${html}
${js ? `<script>\n${js}\n</script>` : ""}
</body>
</html>`;
}

export function getEffect(id: string) {
  return EFFECTS.find((e) => e.id === id);
}
