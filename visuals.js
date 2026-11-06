/* Home with Lana · Studio
   Visuals: illustrated room scenes, textured swatches, and charts. All SVG, no images. */

const shade = (hex,amt) => { const n=parseInt(hex.slice(1),16); const f=v=>Math.max(0,Math.min(255,v+amt)); return '#'+[f(n>>16),f((n>>8)&255),f(n&255)].map(v=>v.toString(16).padStart(2,'0')).join(''); };
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

/* ---------- Room scenes ----------
   Each scene is a flat illustration drawn in the home's own palette.
   c = [wall, floor, wood, accent, dark] */
let _gid=0;
function scene(type, c, w=600, h=340, align='xMidYMid'){
  const [wall, floor, wood, accent, dark] = c;
  const floorY = h*0.66;
  const sofa = (x,y,wd,col)=>`<g><rect x="${x}" y="${y}" width="${wd}" height="${h*0.14}" rx="10" fill="${col}"/><rect x="${x+8}" y="${y-18}" width="${wd-16}" height="26" rx="8" fill="${shade(col,14)}"/><rect x="${x-10}" y="${y+6}" width="18" height="${h*0.11}" rx="7" fill="${shade(col,-12)}"/><rect x="${x+wd-8}" y="${y+6}" width="18" height="${h*0.11}" rx="7" fill="${shade(col,-12)}"/><rect x="${x+wd*0.25}" y="${y-12}" width="${wd*0.18}" height="22" rx="5" fill="${accent}"/><rect x="${x+wd*0.55}" y="${y-12}" width="${wd*0.18}" height="22" rx="5" fill="${shade(accent,30)}"/></g>`;
  const lamp = (x,y,col)=>`<g><rect x="${x-2}" y="${y-70}" width="4" height="70" fill="${dark}"/><path d="M${x-26} ${y-70} h52 l-8 -34 h-36 z" fill="${col}"/><ellipse cx="${x}" cy="${y}" rx="16" ry="5" fill="${dark}"/></g>`;
  const plant = (x,y,col)=>`<g><rect x="${x-14}" y="${y-30}" width="28" height="30" rx="4" fill="${wood}"/><path d="M${x} ${y-30} c -30 -20 -34 -60 -8 -72 c 4 20 2 44 8 72 z" fill="${col}"/><path d="M${x} ${y-30} c 30 -22 36 -58 10 -70 c -6 18 -4 40 -10 70 z" fill="${shade(col,-20)}"/><path d="M${x} ${y-30} c -4 -36 10 -64 26 -78 c -2 30 -8 52 -26 78 z" fill="${shade(col,12)}"/></g>`;
  const rug = (x,y,wd,ht,col)=>`<g><rect x="${x}" y="${y}" width="${wd}" height="${ht}" rx="3" fill="${col}" opacity=".9"/><rect x="${x+8}" y="${y+8}" width="${wd-16}" height="${ht-16}" rx="2" fill="none" stroke="${shade(col,-28)}" stroke-width="2"/></g>`;
  const windowFrame = (x,y,wd,ht,inner)=>`<g><rect x="${x-6}" y="${y-6}" width="${wd+12}" height="${ht+12}" rx="4" fill="${dark}"/>${inner}<rect x="${x+wd/2-2}" y="${y}" width="4" height="${ht}" fill="${dark}"/><rect x="${x}" y="${y+ht/2-2}" width="${wd}" height="4" fill="${dark}"/></g>`;
  const base = `<rect width="${w}" height="${h}" fill="${wall}"/><rect y="${floorY}" width="${w}" height="${h-floorY}" fill="${floor}"/><rect y="${floorY-8}" width="${w}" height="8" fill="${shade(wall,-10)}"/>`;
  let body='';
  if(type==='lake'){
    const wx=w*0.3, wy=h*0.14, ww=w*0.4, wh=h*0.42;
    body += windowFrame(wx,wy,ww,wh, `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh*0.55}" fill="#CFDAE0"/><rect x="${wx}" y="${wy+wh*0.55}" width="${ww}" height="${wh*0.45}" fill="#7D93A0"/><path d="M${wx} ${wy+wh*0.55} q ${ww*0.25} -14 ${ww*0.5} 0 t ${ww*0.5} 0 v ${wh*0.45} h -${ww} z" fill="#6F8796"/><ellipse cx="${wx+ww*0.78}" cy="${wy+wh*0.2}" rx="16" ry="16" fill="#F3E9D2"/>`);
    body += rug(w*0.18,floorY+14,w*0.64,h*0.26,shade(floor,-14));
    body += sofa(w*0.28,floorY+8,w*0.44,accent);
    body += lamp(w*0.14,floorY+40,shade(wall,-6));
    body += plant(w*0.86,floorY+56,accent);
  } else if(type==='bungalow'){
    const wx=w*0.58, wy=h*0.12, ww=w*0.26, wh=h*0.5;
    body += `<path d="M${wx-6} ${wy+wh+6} v-${wh*0.6} a${ww/2+6} ${ww/2+6} 0 0 1 ${ww+12} 0 v${wh*0.6} z" fill="${dark}"/><path d="M${wx} ${wy+wh} v-${wh*0.6} a${ww/2} ${ww/2} 0 0 1 ${ww} 0 v${wh*0.6} z" fill="#E6DDCD"/><path d="M${wx} ${wy+wh} v-${wh*0.6} a${ww/2} ${ww/2} 0 0 1 ${ww} 0 v${wh*0.6} z" fill="url(#g1)"/><rect x="${wx+ww/2-2}" y="${wy}" width="4" height="${wh}" fill="${dark}"/>`;
    body += `<g><rect x="${w*0.3-2}" y="0" width="4" height="${h*0.2}" fill="${dark}"/><path d="M${w*0.3-40} ${h*0.2} h80 l-14 30 h-52 z" fill="${shade(wall,-16)}"/></g>`;
    body += rug(w*0.08,floorY+12,w*0.56,h*0.27,shade(accent,40));
    body += sofa(w*0.14,floorY+6,w*0.42,wood);
    body += `<g><rect x="${w*0.64}" y="${floorY+24}" width="${w*0.14}" height="${h*0.06}" rx="4" fill="${shade(wood,-20)}"/><rect x="${w*0.65}" y="${floorY+24+h*0.06}" width="6" height="${h*0.1}" fill="${dark}"/><rect x="${w*0.76}" y="${floorY+24+h*0.06}" width="6" height="${h*0.1}" fill="${dark}"/></g>`;
    body += plant(w*0.9,floorY+64,accent);
    body += `<rect x="${w*0.08}" y="${h*0.16}" width="${w*0.16}" height="${h*0.22}" rx="3" fill="${shade(wall,-24)}"/><rect x="${w*0.1}" y="${h*0.18}" width="${w*0.12}" height="${h*0.18}" fill="${accent}" opacity=".85"/>`;
  } else if(type==='kitchen'){
    body += `<rect x="0" y="${h*0.1}" width="${w}" height="${h*0.42}" fill="${shade(wall,-6)}"/>`;
    /* tile */
    for(let r=0;r<5;r++) for(let k=0;k<14;k++) body += `<rect x="${k*w/14+1}" y="${h*0.1+r*h*0.084+1}" width="${w/14-2}" height="${h*0.084-2}" rx="2" fill="${shade(wall,-10+(k+r)%2*4)}"/>`;
    /* shelves */
    [h*0.2,h*0.36].forEach((y,i)=>{ body += `<rect x="${w*0.1}" y="${y}" width="${w*0.8}" height="8" rx="2" fill="${wood}"/>`;
      const items = i===0 ? [[0.14,24,30,accent],[0.24,18,22,'#F2EBE1'],[0.3,30,16,shade(wood,30)],[0.5,14,36,accent],[0.58,22,22,'#F2EBE1'],[0.72,34,18,shade(accent,40)]] : [[0.16,40,14,'#F2EBE1'],[0.3,20,26,accent],[0.44,28,20,shade(wood,40)],[0.62,18,30,'#F2EBE1'],[0.74,36,14,shade(accent,-20)]];
      items.forEach(([fx,iw,ih,col])=> body += `<rect x="${w*fx}" y="${y-ih}" width="${iw}" height="${ih}" rx="3" fill="${col}"/>`); });
    /* counter + cabinets */
    body += `<rect x="0" y="${h*0.52}" width="${w}" height="12" fill="${shade('#D9D5CC',-6)}"/><rect x="0" y="${h*0.56}" width="${w}" height="${h*0.44}" fill="${accent}"/>`;
    for(let k=0;k<5;k++) body += `<rect x="${k*w/5+10}" y="${h*0.6}" width="${w/5-20}" height="${h*0.34}" rx="3" fill="none" stroke="${shade(accent,-22)}" stroke-width="2"/><circle cx="${k*w/5+w/10}" cy="${h*0.77}" r="4" fill="#B08A4A"/>`;
    /* pendants */
    [0.3,0.7].forEach(fx=> body += `<rect x="${w*fx-1}" y="0" width="2" height="${h*0.14}" fill="${dark}"/><path d="M${w*fx-18} ${h*0.14} h36 l-6 22 h-24 z" fill="#B08A4A"/>`);
  } else if(type==='lodge'){
    /* stone fireplace */
    const fx=w*0.36, fw=w*0.28;
    body += `<rect x="${fx}" y="${h*0.08}" width="${fw}" height="${floorY-h*0.08}" fill="#8D8579"/>`;
    for(let r=0;r<9;r++) for(let k=0;k<4;k++) body += `<rect x="${fx+k*fw/4+(r%2?8:2)}" y="${h*0.08+r*(floorY-h*0.08)/9+2}" width="${fw/4-10}" height="${(floorY-h*0.08)/9-4}" rx="5" fill="${shade('#8D8579',(k*7+r*5)%3*10-10)}"/>`;
    body += `<rect x="${fx+fw*0.2}" y="${floorY-h*0.26}" width="${fw*0.6}" height="${h*0.24}" rx="3" fill="${dark}"/><path d="M${fx+fw*0.5} ${floorY-h*0.04} c -22 -10 -20 -40 -4 -56 c 2 20 16 24 10 44 c 12 -8 14 -28 10 -44 c 18 18 14 48 -16 56 z" fill="#D98A3A"/>`;
    body += `<rect x="${fx-10}" y="${floorY-h*0.3}" width="${fw+20}" height="10" fill="${wood}"/>`;
    /* antlers */
    body += `<g stroke="#E6DCCB" stroke-width="4" fill="none" stroke-linecap="round"><path d="M${fx+fw*0.5-6} ${h*0.22} c -10 -16 -30 -16 -36 -40 M${fx+fw*0.5-24} ${h*0.1} c -2 8 2 14 8 18 M${fx+fw*0.5-34} ${h*0.03} c 0 8 4 12 10 16"/><path d="M${fx+fw*0.5+6} ${h*0.22} c 10 -16 30 -16 36 -40 M${fx+fw*0.5+24} ${h*0.1} c 2 8 -2 14 -8 18 M${fx+fw*0.5+34} ${h*0.03} c 0 8 -4 12 -10 16"/></g><ellipse cx="${fx+fw*0.5}" cy="${h*0.25}" rx="7" ry="9" fill="${wood}"/>`;
    body += rug(w*0.04,floorY+16,w*0.3,h*0.24,shade(floor,-12));
    body += `<g><rect x="${w*0.08}" y="${floorY+4}" width="${w*0.2}" height="${h*0.15}" rx="10" fill="${accent}"/><rect x="${w*0.08}" y="${floorY-24}" width="${w*0.2}" height="32" rx="8" fill="${shade(accent,10)}"/></g>`;
    body += `<g><rect x="${w*0.72}" y="${floorY+4}" width="${w*0.2}" height="${h*0.15}" rx="10" fill="${accent}"/><rect x="${w*0.72}" y="${floorY-24}" width="${w*0.2}" height="32" rx="8" fill="${shade(accent,10)}"/></g>`;
    body += lamp(w*0.95,floorY+44,'#E6DCCB');
  } else if(type==='bedroom'){
    const wx=w*0.08, wy=h*0.12, ww=w*0.22, wh=h*0.4;
    body += windowFrame(wx,wy,ww,wh, `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#DCE4E8"/><rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="url(#g1)"/>`);
    body += `<path d="M${w*0.36} ${floorY-h*0.1} v-${h*0.26} a${w*0.2} ${h*0.12} 0 0 1 ${w*0.4} 0 v${h*0.26} z" fill="${wood}"/>`;
    body += `<rect x="${w*0.34}" y="${floorY-h*0.14}" width="${w*0.44}" height="${h*0.2}" rx="6" fill="#F2ECE3"/><rect x="${w*0.34}" y="${floorY-h*0.02}" width="${w*0.44}" height="${h*0.12}" rx="4" fill="${accent}"/><rect x="${w*0.34}" y="${floorY+h*0.1}" width="${w*0.44}" height="${h*0.05}" fill="${shade(wood,-10)}"/><rect x="${w*0.35}" y="${floorY+h*0.15}" width="8" height="${h*0.06}" fill="${dark}"/><rect x="${w*0.78-8}" y="${floorY+h*0.15}" width="8" height="${h*0.06}" fill="${dark}"/>`;
    body += `<rect x="${w*0.38}" y="${floorY-h*0.2}" width="${w*0.16}" height="${h*0.1}" rx="6" fill="#fff" stroke="${shade('#F2ECE3',-18)}"/><rect x="${w*0.58}" y="${floorY-h*0.2}" width="${w*0.16}" height="${h*0.1}" rx="6" fill="#fff" stroke="${shade('#F2ECE3',-18)}"/><rect x="${w*0.47}" y="${floorY-h*0.15}" width="${w*0.18}" height="${h*0.07}" rx="5" fill="${shade(accent,24)}"/>`;
    body += `<rect x="${w*0.8}" y="${floorY-h*0.02}" width="${w*0.12}" height="${h*0.14}" rx="3" fill="${wood}"/>`;
    body += lamp(w*0.86,floorY-2,shade(wall,-14));
    body += `<rect x="${w*0.22}" y="${floorY-h*0.02}" width="${w*0.1}" height="${h*0.14}" rx="3" fill="${wood}"/>`;
    body += plant(w*0.27,floorY-4,'#7E8C73');
  } else { /* retreat: porch chair, window, plant */
    const wx=w*0.56, wy=h*0.1, ww=w*0.34, wh=h*0.46;
    body += windowFrame(wx,wy,ww,wh, `<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" fill="#DCE6D9"/><rect x="${wx}" y="${wy+wh*0.72}" width="${ww}" height="${wh*0.28}" fill="#9FAE94"/><rect x="${wx+ww*0.3-5}" y="${wy+wh*0.4}" width="10" height="${wh*0.36}" fill="${wood}"/><circle cx="${wx+ww*0.3}" cy="${wy+wh*0.36}" r="${ww*0.16}" fill="#7E8C73"/><circle cx="${wx+ww*0.22}" cy="${wy+wh*0.44}" r="${ww*0.11}" fill="#6F7F66"/><circle cx="${wx+ww*0.39}" cy="${wy+wh*0.44}" r="${ww*0.11}" fill="#8A9A80"/>`);
    body += rug(w*0.06,floorY+10,w*0.46,h*0.28,shade(floor,-10));
    body += `<g><rect x="${w*0.14}" y="${floorY-10}" width="${w*0.24}" height="${h*0.2}" rx="14" fill="${accent}"/><rect x="${w*0.12}" y="${floorY-46}" width="${w*0.28}" height="46" rx="14" fill="${shade(accent,12)}"/><rect x="${w*0.16}" y="${floorY-30}" width="${w*0.1}" height="26" rx="6" fill="#F2EBE1"/></g>`;
    body += `<rect x="${w*0.44}" y="${floorY+8}" width="${w*0.1}" height="${h*0.12}" rx="4" fill="${wood}"/>`;
    body += plant(w*0.49,floorY+8,'#7E8C73');
    body += `<rect x="${w*0.1}" y="${h*0.14}" width="${w*0.3}" height="${h*0.22}" rx="3" fill="${dark}"/><rect x="${w*0.115}" y="${h*0.155}" width="${w*0.27}" height="${h*0.19}" fill="#F7F2EA"/><rect x="${w*0.15}" y="${h*0.19}" width="${w*0.2}" height="${h*0.12}" fill="${shade(accent,30)}"/><path d="M${w*0.15} ${h*0.31} q ${w*0.05} -${h*0.08} ${w*0.1} 0 t ${w*0.1} 0 z" fill="${shade(accent,-10)}"/>`;
  }
  const gid='g'+(++_gid); body=body.split('url(#g1)').join('url(#'+gid+')');
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="${align} slice" role="img" aria-label="${esc(type)} room illustration"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>${base}${body}</svg>`;
}

/* ---------- Textured swatches ---------- */
function swatchStyle(sw){
  const c=sw.hex;
  switch(sw.tex){
    case 'linen': return `background:${c};background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.12) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 1px,transparent 1px 3px)`;
    case 'wood': return `background:${c};background-image:repeating-linear-gradient(100deg,rgba(0,0,0,.08) 0 2px,transparent 2px 9px,rgba(255,255,255,.07) 9px 11px,transparent 11px 20px)`;
    case 'leather': return `background:${c};background-image:radial-gradient(circle at 30% 30%,rgba(255,255,255,.18),transparent 55%),radial-gradient(circle at 70% 80%,rgba(0,0,0,.18),transparent 50%)`;
    case 'stone': return `background:${c};background-image:linear-gradient(135deg,rgba(255,255,255,.35) 0%,transparent 40%,rgba(0,0,0,.08) 60%,transparent 80%),linear-gradient(35deg,transparent 60%,rgba(255,255,255,.25) 61%,transparent 63%)`;
    case 'metal': return `background:linear-gradient(135deg,${shade(c,40)} 0%,${c} 45%,${shade(c,-30)} 55%,${shade(c,20)} 100%)`;
    default: return `background:${c}`;
  }
}

/* ---------- Charts ---------- */
const INK='#2A1F1A', MUTED='#6B5B4F', LINE='#E4D9C9', SANS='Inter, system-ui, sans-serif';

function barsChart(labels, a, b, colA, colB, opts={}){
  const W=opts.W||640,H=opts.W&&opts.W<480?260:240,padL=40,padR=12,top=16,bottom=28, n=labels.length;
  const max = Math.ceil(Math.max(...a,...b)/20000)*20000;
  const bw=(W-padL-padR)/n, innerH=H-top-bottom;
  let s='';
  for(let v=max/4; v<=max; v+=max/4){ const y=top+innerH-v/max*innerH; s+=`<line x1="${padL}" x2="${W-padR}" y1="${y}" y2="${y}" stroke="${LINE}"/><text x="${padL-6}" y="${y+4}" text-anchor="end" font-size="11" fill="${MUTED}" font-family="${SANS}">${v/1000}k</text>`; }
  labels.forEach((l,i)=>{ const x=padL+i*bw, ha=a[i]/max*innerH, hb=b[i]/max*innerH;
    const dim = opts.hl && i < n-opts.hl ? ' opacity=".35"' : '';
    s+=`<rect x="${x+bw*.12}" y="${top+innerH-ha}" width="${bw*.36}" height="${ha}" rx="3" fill="${colA}"${dim}><title>${esc(l)}: in ${usd(a[i])}</title></rect>`;
    s+=`<rect x="${x+bw*.52}" y="${top+innerH-hb}" width="${bw*.36}" height="${hb}" rx="3" fill="${colB}"${dim||' opacity=".85"'}><title>${esc(l)}: out ${usd(b[i])}</title></rect>`;
    s+=`<text x="${x+bw/2}" y="${H-8}" text-anchor="middle" font-size="11" fill="${MUTED}" font-family="${SANS}">${esc(l)}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label||'Bar chart')}">${s}</svg>`;
}

function donut(items, total, centerTop, centerBottom){
  const R=70, r=46, cx=90, cy=90; let ang=-Math.PI/2, s='';
  items.forEach(it=>{ const a=it.v/total*2*Math.PI; const x1=cx+R*Math.cos(ang), y1=cy+R*Math.sin(ang), x2=cx+R*Math.cos(ang+a), y2=cy+R*Math.sin(ang+a); const xi1=cx+r*Math.cos(ang+a), yi1=cy+r*Math.sin(ang+a), xi2=cx+r*Math.cos(ang), yi2=cy+r*Math.sin(ang); const big=a>Math.PI?1:0;
    s+=`<path d="M${x1} ${y1} A${R} ${R} 0 ${big} 1 ${x2} ${y2} L${xi1} ${yi1} A${r} ${r} 0 ${big} 0 ${xi2} ${yi2} Z" fill="${it.c}" stroke="#FFFDF9" stroke-width="2"><title>${esc(it.l)}: ${usd(it.v)}</title></path>`; ang+=a; });
  s+=`<text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="22" font-family="Cormorant Garamond, Georgia, serif" fill="${INK}">${esc(centerTop)}</text><text x="${cx}" y="${cy+16}" text-anchor="middle" font-size="9" letter-spacing=".8" fill="${MUTED}" font-family="${SANS}">${esc(centerBottom)}</text>`;
  return `<svg viewBox="0 0 180 180" role="img" aria-label="Where the money comes from" >${s}</svg>`;
}

function lineChart(vals, splitAt, col, label, W=640){
  const H=W<480?220:200,padL=44,padR=12,top=14,bottom=26,n=vals.length;
  const min=Math.floor(Math.min(...vals)*0.9/10000)*10000, max=Math.ceil(Math.max(...vals)*1.05/10000)*10000;
  const x=i=>padL+i*(W-padL-padR)/(n-1), y=v=>top+(H-top-bottom)*(1-(v-min)/(max-min));
  let s='';
  for(let v=min; v<=max; v+=(max-min)/4){ s+=`<line x1="${padL}" x2="${W-padR}" y1="${y(v)}" y2="${y(v)}" stroke="${LINE}"/><text x="${padL-6}" y="${y(v)+4}" text-anchor="end" font-size="11" fill="${MUTED}" font-family="${SANS}">${Math.round(v/1000)}k</text>`; }
  const pts=vals.map((v,i)=>`${x(i)},${y(v)}`);
  const solid=pts.slice(0,splitAt+1).join(' '), dashed=pts.slice(splitAt).join(' ');
  s+=`<polygon points="${x(0)},${y(min)} ${solid} ${x(splitAt)},${y(min)}" fill="${col}" opacity=".12"/>`;
  s+=`<polyline points="${solid}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
  s+=`<polyline points="${dashed}" fill="none" stroke="${col}" stroke-width="3" stroke-dasharray="6 6" stroke-linejoin="round" opacity=".7"/>`;
  s+=`<circle cx="${x(splitAt)}" cy="${y(vals[splitAt])}" r="6" fill="#FFFDF9" stroke="${col}" stroke-width="3"/>`;
  s+=`<text x="${x(splitAt)}" y="${y(vals[splitAt])-14}" text-anchor="middle" font-size="12" fill="${INK}" font-family="${SANS}" font-weight="600">Today ${usd(vals[splitAt])}</text>`;
  s+=`<text x="${padL}" y="${H-6}" font-size="11" fill="${MUTED}" font-family="${SANS}">7 weeks ago</text><text x="${W-padR}" y="${H-6}" text-anchor="end" font-size="11" fill="${MUTED}" font-family="${SANS}">4 weeks out</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">${s}</svg>`;
}

function hbars(items, col, fmtv=usd){
  const max=Math.max(...items.map(i=>i.v));
  return items.map(i=>`<div class="hb"><div class="hb-top"><span>${esc(i.l)}</span><span class="num">${fmtv(i.v)}</span></div><div class="bar"><b style="width:${Math.max(3,i.v/max*100)}%;background:${i.c||col}"></b></div>${i.sub?`<div class="small muted">${esc(i.sub)}</div>`:''}</div>`).join('');
}

function weekBars(vals, labels, col, hi, W=640){
  const H=W<480?190:170,pad=12,top=26,bottom=26,max=Math.max(...vals)*1.1,n=vals.length,bw=(W-pad*2)/n;
  let s='';
  vals.forEach((v,i)=>{ const x=pad+i*bw, hh=v/max*(H-top-bottom), y=top+(H-top-bottom)-hh;
    s+=`<rect x="${x+bw*.18}" y="${y}" width="${bw*.64}" height="${hh}" rx="5" fill="${i===hi?col:shade(col,70)}"><title>${esc(labels[i])}: ${usd(v)}</title></rect>`;
    if(v) s+=`<text x="${x+bw/2}" y="${y-7}" text-anchor="middle" font-size="11" fill="${INK}" font-family="${SANS}">${v>=1000?'$'+(v/1000).toFixed(1)+'k':'$'+v}</text>`;
    s+=`<text x="${x+bw/2}" y="${H-8}" text-anchor="middle" font-size="12" fill="${i===hi?INK:MUTED}" font-family="${SANS}" font-weight="${i===hi?600:400}">${esc(labels[i])}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sales by day of the week">${s}</svg>`;
}

/* Icons */
const ICON = {
  today:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  homes:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v5"/>',
  money:'<circle cx="12" cy="12" r="9"/><path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.8 0-3 .9-3 2s1 1.7 3 2 3 .9 3 2-1.2 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6.5V8m0 8v1.5"/>',
  show:'<path d="M9 3h6l3 8H6z"/><path d="M12 11v7M8 21h8"/>',
  safe:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  conn:'<path d="M9 7V3M15 7V3M7 7h10v4a5 5 0 0 1-10 0zM12 16v5"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.2M12 17h.01"/>',
  back:'<path d="M15 5l-7 7 7 7"/>',
  check:'<path d="M5 12l5 5 9-10"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  text:'<path d="M4 4h16v12H8l-4 4z"/>',
  cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  chev:'<path d="M6 9l6 6 6-6"/>'
};
const svgi = (k,sz=24) => `<svg viewBox="0 0 24 24" width="${sz}" height="${sz}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;
