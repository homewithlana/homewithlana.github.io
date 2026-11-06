/* Home with Lana · Studio  (app) */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
};
const col = k => (SWATCH[k]||{hex:k}).hex;

/* ---------- Greeting, word, date ---------- */
const isSunday = TODAY.getDay()===0;
function greeting(){ const hour=new Date().getHours(); return hour<12?'Good morning, Lana.':hour<17?'Good afternoon, Lana.':'Good evening, Lana.'; }
const doy = Math.round((TODAY - new Date(TODAY.getFullYear(),0,0))/864e5);
const WORD = WORDS[doy % WORDS.length];

/* ---------- Navigation ---------- */
const TABS = [['today','Today'],['homes','Homes'],['money','Money'],['show','Showroom'],['safe','Peace of Mind']];
function buildNav(){
  $('#bottomnav').innerHTML = TABS.map(([k,l])=>`<button data-go="${k}" aria-label="${l}">${svgi(k)}<span>${l==='Peace of Mind'?'Peace':l}</span></button>`).join('');
  $('#sidenav').innerHTML = TABS.concat([['conn','Connected'],['help','Help']]).map(([k,l])=>`<button data-go="${k}">${svgi(k)}<span>${l}</span></button>`).join('');
}
let current='today';
const VIEWS=['today','homes','money','show','safe','conn','help'];
function go(v, push=true){
  const same = v===current && !$('#detail').classList.contains('open') && !$('#client').classList.contains('open');
  current=v;
  $$('.view').forEach(e=>e.classList.toggle('on', e.id==='v-'+v));
  $$('[data-go]').forEach(b=>{ const on=b.dataset.go===v && !!b.closest('nav'); b.classList.toggle('on', on); if(b.closest('nav')) b.setAttribute('aria-current', on?'page':'false'); });
  closeDetail(); closeClient();
  window.scrollTo({top:0,behavior:'instant'});
  if(v==='money') renderMoney(); if(v==='show') renderShow();
  if(push && history.pushState){ if(same) history.replaceState({v}, '', '#'+v); else history.pushState({v}, '', '#'+v); }
  document.title = {today:'Today',homes:'Our Homes',money:'The Money',show:'The Showroom',safe:'Peace of Mind',conn:'Connected',help:'Help'}[v] + ' · Home with Lana';
}
window.addEventListener('popstate', e=>{
  const s=e.state||{}; const hv=location.hash.slice(1);
  const v = s.v || (VIEWS.includes(hv)?hv:'today');
  go(v,false);
  if(s.detail) openDetail(s.detail,false);
});
window.addEventListener('hashchange', ()=>{ const v=location.hash.slice(1); if(VIEWS.includes(v) && v!==current) go(v,false); });
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2800); }
function toggleBig(){ const on=document.documentElement.classList.toggle('big'); store.set('big', on?'1':'0'); toast(on?'Larger text is on':'Regular text size'); }
if(store.get('big')==='1') document.documentElement.classList.add('big');

/* ---------- Gate ---------- */
let pinN=0;
function buildGate(){
  $('#gate-hello').textContent = isSunday ? 'Happy Sunday, Lana.' : 'Welcome back, Lana.';
  $('#pad').innerHTML = [1,2,3,4,5,6,7,8,9].map(n=>`<button data-k="${n}" aria-label="${n}">${n}</button>`).join('') + `<button class="txt" data-k="clear">Clear</button><button data-k="0" aria-label="0">0</button><button class="txt" data-k="go">Open</button>`;
  $('#pad').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; const k=b.dataset.k;
    if(k==='clear'){ pinN=0; } else if(k==='go'){ enter(); return; } else { pinN=Math.min(4,pinN+1); }
    $$('#pin i').forEach((i,idx)=>i.classList.toggle('on', idx<pinN));
    if(pinN===4) setTimeout(enter, 260);
  });
  document.addEventListener('keydown', e=>{ if($('#gate').classList.contains('gone')) return; if(/^[0-9]$/.test(e.key)){ pinN=Math.min(4,pinN+1); $$('#pin i').forEach((i,idx)=>i.classList.toggle('on', idx<pinN)); if(pinN===4) setTimeout(enter,260);} if(e.key==='Enter') enter(); });
}
function enter(){ $('#gate').classList.add('gone'); $('#gate').setAttribute('aria-hidden','true'); ['.shell','#bottomnav'].forEach(s=>{ $(s).inert=false; }); const g=$('#greet'); g.setAttribute('tabindex','-1'); g.focus({preventScroll:true}); }
['.shell','#bottomnav'].forEach(s=>{ $(s).inert=true; });

/* ---------- Today ---------- */
const totalOwed = HOMES.reduce((a,h)=>a+h.owed,0);
const lateHomes = HOMES.filter(h=>h.late);
function spark(vals, c){ const W=84,H=30,max=Math.max(...vals),min=Math.min(...vals); const pts=vals.map((v,i)=>`${i*(W/(vals.length-1))},${H-4-(v-min)/(max-min||1)*(H-8)}`).join(' '); return `<svg viewBox="0 0 ${W} ${H}" class="spark" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" opacity=".7"/></svg>`; }
function trio(el, items){
  $(el).innerHTML = items.map(([cls,l,v,h,to,sp])=>`<${to?'button':'div'} class="card stat ${cls} ${sp?'has-spark':''}" ${to?`data-act="${to}"`:''}>${to?'<span class="go" aria-hidden="true">&rsaquo;</span>':''}<span class="lbl">${l}</span><span class="val num">${v}</span><span class="hint">${h}</span>${sp||''}</${to?'button':'div'}>`).join('');
}
const TASKS = [
  ['alert','Approve a payment of $8,900 to Four Hands',`Dining set for Toledo Bend. It matches the order you approved in ${MONL[dOff(-58).getMonth()]}.`,[['Approve','ok','Approved. The payment goes out today.'],['Hold','ghost','Held. Nothing leaves until you say so.']]],
  ['warn',`The Hollis reveal payment is ${HOMES[5].late} days late`,`${usd(HOMES[5].pay[2].amt)}. A reminder went out at 7 days. Time for a call?`,[['Call Karen','ok','Calling Karen. The home is open behind this.'],['Send another note','ghost','A second note went to Karen and Jim.'],['Open the home','ghost','open:hf']]],
  ['alert','Two things in the books to look at','A bill came in over its quote, and there is a first payment to someone new.',[['Look now','ok','go:safe']]],
  ['good','Calder Avenue order is ready to release','It releases on its own the day the Sonniers’ payment clears.',[['Got it','ghost','Noted.']]]
];
function renderToday(){
  $('#greet').textContent = greeting();
  $('#dateline').textContent = fmtL(TODAY);
  $('#word').innerHTML = `${WORD[0]}<small>${esc(WORD[1])}</small>`;
  $('#word').style.display = store.get('rule_word')==='0' ? 'none' : '';
  trio('#today-trio',[
    ['in','Collected this month',usd(PERIOD.month.in),`From ${PERIOD.month.pays} payments`,'go:money',spark(IN12.slice(5),'#5E7356')],
    ['owed','Owed to you',usd(totalOwed),`${HOMES.reduce((a,h)=>a+h.pay.filter(x=>x.s==='due'||x.s==='late').length,0)} invoices out, ${lateHomes.length} late`,'owed'],
    ['out','Paid out this month',usd(PERIOD.month.out),'Vendors, crews, rent, payroll','go:money',spark(OUT12.slice(5),'#8A2B24')]
  ]);
  const quietSunday = isSunday && store.get('rule_sunday')!=='0';
  if(quietSunday){
    $('#taskhead').textContent='Today';
    $('#tasks').innerHTML = `<div class="rest"><div class="big">Nothing needs you today.</div><div class="muted">It’ll all be here Monday morning.</div><button class="btn ghost sm" style="margin-top:.9rem" data-peek>${TASKS.length} things are waiting for Monday &rsaquo;</button></div>`;
    $('#taskcount').textContent='';
  } else {
    $('#taskhead').textContent='Needs you today';
    $('#tasks').innerHTML = TASKS.map((t,i)=>`<div class="task" id="task${i}"><span class="dot ${t[0]}"></span><div class="body"><b>${t[1]}</b><div class="small muted">${t[2]}</div><div class="acts">${t[3].map(a=>`<button class="btn sm ${a[1]==='ok'?'primary':'ghost'}" data-task="${i}" data-r="${esc(a[2])}">${a[0]}</button>`).join('')}</div><div class="status"></div></div></div>`).join('');
    updateCount();
  }
  /* week strip */
  const start = new Date(TODAY);
  const evs = [];
  HOMES.forEach(h=>{ h.dates.forEach(d=>evs.push({date:d.date,l:d.l,k:d.k,h})); h.pay.filter(p=>p.s==='up').forEach(p=>evs.push({date:p.date,l:`${p.l} due, ${h.short}`,k:'due',h})); });
  BILLS.forEach(b=>evs.push({date:dOff(b[2]),l:`Pay ${b[0]}`,k:'due'}));
  let days='';
  for(let i=0;i<7;i++){ const d=new Date(start); d.setDate(d.getDate()+i); const isT=d.getTime()===TODAY.getTime(); const de=evs.filter(e=>e.date.getTime()===d.getTime());
    days+=`<div class="day ${isT?'today':''} ${d.getDay()===0?'sun':''}" aria-label="${fmtL(d)}"><span class="dw">${DOW[d.getDay()]}</span><span class="dn">${d.getDate()}</span>${de.slice(0,3).map(e=>`<span class="ev ${e.k}" title="${esc(e.l)}"></span>`).join('')}</div>`; }
  $('#week').innerHTML = days;
  const end=new Date(start); end.setDate(end.getDate()+7);
  const wk = evs.filter(e=>e.date>=start&&e.date<end).sort((a,b)=>a.date-b.date);
  const KEY={delivery:['var(--cognac)','Delivery'],install:['var(--sage)','Install'],reveal:['var(--oxblood)','Reveal'],meeting:['var(--slate)','Meeting'],due:['var(--warn)','Money due'],note:['var(--muted)','Due to a client']};
  const kinds=[...new Set(wk.map(e=>e.k))];
  $('#agenda').innerHTML = (wk.length? wk.map(e=>`<div class="row"><div class="l"><b>${esc(e.l)}</b><span class="small muted">${e.h?esc(e.h.name):'Studio'}</span></div><div class="rt small muted">${e.date.getTime()===TODAY.getTime()?'Today':DOWL[e.date.getDay()]}</div></div>`).join('') : '<p class="muted">A quiet week ahead.</p>')
    + (kinds.length?`<div class="ev-key">${kinds.map(k=>`<span><i style="background:${KEY[k][0]}"></i>${KEY[k][1]}</span>`).join('')}</div>`:'');
  $('#mini').innerHTML = HOMES.filter(h=>h.stage<5).map(cardHTML).join('');
  $('#sync').innerHTML = `<button class="chip link" data-go="conn"><i></i>Books checked in, 6:02 AM</button><button class="chip link" data-go="conn"><i></i>14 new photos from the site</button><button class="chip link" data-go="conn"><i></i>Bank checked in, 6:00 AM</button><button class="chip link" data-go="conn">Everything connected &rsaquo;</button>`;
  $('#side-sync').textContent = 'Books checked in, 6:02 AM';
}
function updateCount(){ const n=$$('.task:not(.done)').length; $('#taskcount').textContent = n? n+' to go':'All clear'; }
function doTask(i,a){
  if(a.startsWith('open:')) return openDetail(a.slice(5));
  if(a.startsWith('go:')) return go(a.slice(3));
  const el=$('#task'+i); el.classList.add('done'); el.querySelector('.status').textContent=a; updateCount();
}

/* ---------- Homes ---------- */
function cardHTML(h){
  const pct = Math.round(h.collected/h.contract*100);
  return `<button class="card pcard" data-open="${h.id}">
    <span class="scene">${scene(h.scene,h.colors)}</span>
    <span class="in"><span class="h4">${esc(h.name)}</span><span class="small muted blk">${esc(h.client)} &middot; ${esc(h.city)}</span>
    <span class="stage ${h.late?'late':''}">${h.late? h.late+' days late' : STAGES[h.stage]}</span>
    <span class="bar"><b style="width:${pct}%"></b></span>
    <span class="money"><span class="muted">Collected</span><span class="num">${usd(h.collected)} <span class="muted">of ${usd(h.contract)}</span></span></span></span></button>`;
}
let filt='All';
function renderHomes(){
  const F=['All','Design','Ordering','Install','Revealed'];
  $('#filters').innerHTML = F.map(f=>`<button class="${f===filt?'on':''}" data-filt="${f}" aria-pressed="${f===filt}">${f}</button>`).join('');
  const match = h => filt==='All' || (filt==='Design'&&h.stage<=2) || (filt==='Ordering'&&h.stage===3) || (filt==='Install'&&h.stage===4) || (filt==='Revealed'&&h.stage===5);
  $('#plist').innerHTML = HOMES.filter(match).map(cardHTML).join('') || '<p class="muted">Nothing here right now.</p>';
}
const statusPill = (s,late) => ({paid:'<span class="pill paid">Paid</span>',due:'<span class="pill due">Waiting</span>',late:`<span class="pill late">${late} days late</span>`,up:'<span class="pill up">Coming up</span>'})[s];
let _ret=null;
function openDetail(id, push=true){
  const h = HOMES.find(x=>x.id===id); if(!h) return;
  const spentPct = Math.min(100, h.spent/h.contract*100), profPct = h.profit/h.contract*100;
  $('#dwrap').innerHTML = `
    <div class="back"><button class="btn sm" data-close="detail">${svgi('back',18)} All homes</button><span class="stage ${h.late?'late':''}" style="margin:0">${h.late? h.late+' days late':STAGES[h.stage]}</span></div>
    <div class="hero">${scene(h.scene,h.colors,600,340,'xMidYMax').replace('<svg ','<svg class="m" ')}${scene(h.scene,h.colors,1000,340,'xMidYMid').replace('<svg ','<svg class="d" ')}</div>
    <h2 class="page" style="margin-top:1.2rem">${esc(h.name)}</h2>
    <p class="muted">${esc(h.client)} &middot; ${esc(h.city)}, Texas</p>
    <div class="rooms">${h.rooms.map(r=>`<span>${r}</span>`).join('')}</div>
    <div class="steps" aria-hidden="true">${STAGES.map((s,i)=>`<div class="${i<h.stage?'done':i===h.stage?'now':''}"></div>`).join('')}</div>
    <div class="steplbl">${STAGES.map((s,i)=>`<span class="${i===h.stage?'now':''}">${s}</span>`).join('')}</div>

    <div class="card card-pad" style="margin-top:1.2rem"><b style="font-weight:500">What happens next</b><div class="muted" style="margin-top:.2rem">${h.next}</div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.8rem"><button class="btn ghost sm" data-client="${h.id}">See what ${h.they?'they see':h.he?'he sees':'she sees'}</button><button class="btn ghost sm" data-toast="Message sent to ${esc(h.short)}.">${svgi('text',16)} Text ${esc(h.short)}</button></div></div>

    <h3 class="sec">The money on this home</h3>
    <div class="mgrid">
      <div class="card mbox"><div class="lbl">Contract</div><div class="v num">${usd(h.contract)}</div></div>
      <div class="card mbox"><div class="lbl">Collected</div><div class="v num" style="color:var(--good)">${usd(h.collected)}</div></div>
      <div class="card mbox"><div class="lbl">Owed to you</div><div class="v num" style="color:${h.owed?'var(--cognac)':'inherit'}">${usd(h.owed)}</div></div>
      <div class="card mbox"><div class="lbl">Spent so far</div><div class="v num">${usd(h.spent)}</div>${h.committed>h.spent?`<div class="small muted">${usd(h.committed)} committed</div>`:''}</div>
      <div class="card mbox wide"><div class="lbl">What this home earns you</div><div class="v num">${usd(h.profit)}</div><div style="font-size:.9rem;color:#CDBFAF">${Math.round(profPct)}% of the contract &middot; ${h.hours} hours of your time so far</div>
        <div class="stack"><span style="width:${spentPct}%;background:var(--cognac)"></span><span style="width:${Math.max(0,(h.expected-h.spent)/h.contract*100)}%;background:#7A6A5E"></span><span style="width:${profPct}%;background:var(--sage)"></span></div>
        <div class="legend" style="color:#CDBFAF"><span><i style="background:var(--cognac)"></i>Spent</span><span><i style="background:#7A6A5E"></i>Still to spend</span><span><i style="background:var(--sage)"></i>Yours to keep</span></div></div>
    </div>

    <details class="acc" open><summary><span class="t">Payments</span><span class="r">${h.pay.length} steps<span class="chev" aria-hidden="true">${svgi('chev',16)}</span></span></summary><div class="inner">
      ${h.pay.map(x=>`<div class="row"><div class="l"><b>${x.l}</b><span class="small muted">${x.s==='paid'?'Paid ':x.s==='up'?'Due ':'Sent '}${fmt(x.date)}</span></div><div class="rt"><div class="num">${usd(x.amt)}</div>${statusPill(x.s,h.late)}</div></div>`).join('')}
      ${h.owed?`<button class="btn primary sm" style="margin-top:.8rem" data-toast="Reminder sent to ${esc(h.short)}.">Send a gentle reminder</button>`:''}
    </div></details>

    <details class="acc"><summary><span class="t">Purchases</span><span class="r">${h.buy.length?h.buy.length+' items':'None yet'}<span class="chev" aria-hidden="true">${svgi('chev',16)}</span></span></summary><div class="inner">
      ${h.buy.length?h.buy.map(b=>`<div class="row"><div class="l"><b>${esc(b[1])}</b><span class="small muted">${esc(b[0])} &middot; ${esc(b[4])}</span></div><div class="rt"><div class="num">${usd(b[3])}</div><div class="small muted num">cost ${usd(b[2])}</div></div></div>`).join('')+`<p class="note">You keep ${usd(h.buy.reduce((a,b)=>a+b[3]-b[2],0))} on these items.</p>`:'<p class="muted">Purchases show here once selections are approved.</p>'}
    </div></details>

    <details class="acc"><summary><span class="t">Mood board</span><span class="r">${h.swatches.length} materials<span class="chev" aria-hidden="true">${svgi('chev',16)}</span></span></summary><div class="inner">
      <div class="mood">${h.swatches.map(s=>`<div><div class="sw" style="${swatchStyle(s)}"></div><div class="nm">${s.name}</div></div>`).join('')}</div>
    </div></details>

    <details class="acc"><summary><span class="t">Photos</span><span class="r">${h.photos.length} from the site<span class="chev" aria-hidden="true">${svgi('chev',16)}</span></span></summary><div class="inner">
      <div class="photos">${h.photos.map(([l,a,b])=>`<button class="ph" style="background:linear-gradient(160deg, ${col(a)} 0%, ${col(b)} 100%)" data-toast="Shared to Instagram: ${esc(l)}." aria-label="Photo: ${esc(l)}"><span class="cam">${svgi('cam',13)}</span><small>${l}</small></button>`).join('')}</div>
      <p class="small muted" style="margin-top:.7rem">New photos from the site appear here on their own. Tap one to share it to your Instagram.</p>
    </div></details>

    <details class="acc"><summary><span class="t">Dates</span><span class="r"><span class="chev" aria-hidden="true">${svgi('chev',16)}</span></span></summary><div class="inner">
      <ul class="timeline">${[...h.pay.map(p=>({date:p.date,off:p.off,l:p.l+(p.s==='paid'?' paid':p.s==='up'?' due':' sent')})), ...h.dates.map(d=>({date:d.date,off:d.off,l:d.l}))].sort((a,b)=>a.date-b.date).map(x=>`<li class="${x.off<0?'past':''}"><b>${x.l}</b><span class="small muted">${fmt(x.date)}</span></li>`).join('')}</ul>
    </div></details>`;
  const d=$('#detail'); d.classList.add('open'); d.scrollTop=0; d.setAttribute('aria-hidden','false');
  _ret=document.activeElement; ['.shell','#bottomnav'].forEach(s=>{ $(s).inert=true; }); const fb=d.querySelector('[data-close]'); if(fb) fb.focus({preventScroll:true});
  if(push && history.pushState) history.pushState({v:current,detail:id}, '', '#home-'+id);
}
function closeDetail(){ const d=$('#detail'); if(d.classList.contains('open')){ d.classList.remove('open'); d.setAttribute('aria-hidden','true'); ['.shell','#bottomnav'].forEach(s=>{ $(s).inert=false; }); if(_ret&&_ret.focus){ try{ _ret.focus({preventScroll:true}); }catch(e){} } } }
function dismissDetail(){ if(!$('#detail').classList.contains('open')) return; if(history.state&&history.state.detail) history.back(); else closeDetail(); }

/* ---------- Money ---------- */
let per='month';
function chartW(sel){ const w=$(sel).clientWidth; return w>40? Math.round(w) : 640; }
function renderMoney(p){
  if(p) per=p; const d = PERIOD[per];
  trio('#money-trio',[
    ['in','Money in',usd(d.in),d.note,''],
    ['out','Money out',usd(d.out),'Vendors, crews, rent, payroll',''],
    ['in','What is left',usd(d.in-d.out),'You kept '+Math.round((d.in-d.out)/d.in*100)+' cents of every dollar','']
  ]);
  const cw=chartW('#chart'); const narrow=cw<480; const n=narrow?6:12;
  const hl = per==='month'?1:per==='quarter'?3:12;
  $('#chart').innerHTML = barsChart(MONTHS12.slice(-n).map(m=>MON[m.getMonth()]), IN12.slice(-n), OUT12.slice(-n), '#6F7F66', '#6E4F3A', {label:'Money in and out by month',W:cw,hl:Math.min(hl,n)});
  const tot=SOURCES.reduce((a,s)=>a+s[1],0);
  $('#donut').innerHTML = donut(SOURCES.map(s=>({l:s[0],v:s[1],c:col(s[2])})), tot, '$'+Math.round(tot/1000)+'k', '12 MONTHS');
  $('#sources').innerHTML = SOURCES.map(s=>`<div class="row"><div class="l" style="display:flex;align-items:center;gap:.5rem"><i style="width:10px;height:10px;border-radius:50%;background:${col(s[2])};flex:none"></i><span>${s[0]}</span></div><div class="rt"><span class="num">${usd(s[1])}</span> <span class="small muted">${Math.round(s[1]/tot*100)}%</span></div></div>`).join('');
  $('#perhome').innerHTML = hbars(HOMES.slice().sort((a,b)=>b.profit-a.profit).map(h=>({l:h.name,v:h.profit,sub:Math.round(h.profit/h.contract*100)+'% of '+usd(h.contract),c:col(h.pal[3])})),'#6F7F66');
  $('#cash').innerHTML = lineChart(CASH12, 7, '#6F7F66', 'Cash on hand, twelve weeks', chartW('#cash'));
  const owed = HOMES.flatMap(h=>h.pay.filter(x=>x.s==='due'||x.s==='late').map(x=>({h,x})));
  $('#owed-sum').textContent = usd(totalOwed);
  $('#owed').innerHTML = owed.sort((a,b)=>a.x.off-b.x.off).map(({h,x})=>`<div class="row"><div class="l"><b>${h.client}</b><span class="small muted">${h.name} &middot; ${x.l}</span></div><div class="rt"><div class="num">${usd(x.amt)}</div>${x.s==='late'?`<span class="pill late">${-x.off} days late</span>`:'<span class="pill due">Sent '+fmt(x.date)+'</span>'}</div></div>`).join('') + (owed.some(o=>o.x.s==='late')?`<button class="btn primary sm" style="margin-top:.8rem" data-toast="A gentle reminder went to everyone who is late.">Remind the late ones</button>`:'');
  $('#bills-sum').textContent = usd(BILLS.reduce((a,b)=>a+b[3],0));
  $('#bills').innerHTML = BILLS.slice().sort((a,b)=>a[2]-b[2]).map(b=>`<div class="row"><div class="l"><b>${b[0]}</b><span class="small muted">${b[1]}</span></div><div class="rt"><div class="num">${usd(b[3])}</div><span class="pill up">Due ${fmt(dOff(b[2]))}</span></div></div>`).join('');
  $('#bank-sum').textContent = usd(BANK.reduce((a,b)=>a+b[2],0));
  $('#bank').innerHTML = BANK.map(b=>`<div class="card mbox" style="box-shadow:none"><div class="lbl">${b[0]}</div><div class="v num">${usd(b[2])}</div><div class="small muted">${b[1]}</div></div>`).join('');
}

/* ---------- Showroom ---------- */
function renderShow(){
  const sales=SELL.reduce((a,s)=>a+s[2]*s[3],0);
  trio('#show-trio',[
    ['in','Sold this month',usd(sales),SELL.reduce((a,s)=>a+s[2],0)+' items, in store and by card',''],
    ['out','Best day','Saturday',Math.round(WEEKDAY[6]/WEEKDAY.reduce((a,b)=>a+b,0)*100)+'% of the week’s sales',''],
    ['out','On the floor',usd(FLOOR.reduce((a,f)=>a+f[2],0)),'What the stock on hand cost you','']
  ]);
  $('#weekchart').innerHTML = weekBars(WEEKDAY, DOW, '#A4693A', 6, chartW('#weekchart'));
  $('#sellers').innerHTML = hbars(SELL.map(s=>({l:s[0],v:s[2]*s[3],sub:s[1]+' · '+s[2]+' sold'})),'#A4693A');
  $('#low-n').textContent = LOW.length+' items';
  $('#low').innerHTML = LOW.map(l=>`<div class="row"><div class="l"><b>${l[0]}</b><span class="small muted">${l[1]}</span></div><div class="rt"><button class="btn ghost sm" data-toast="Reorder of ${l[2]} added to the next order.">Reorder ${l[2]}</button></div></div>`).join('');
  $('#asked').innerHTML = ASKED.map(a=>`<div class="row"><div class="l"><b>${a[0]}</b><span class="small muted">${a[1]}</span></div><div class="rt"><span class="pill ${a[2]==='not stocked'?'due':'up'}">${a[2]}</span></div></div>`).join('')+'<p class="note">When the register hears the same request three times, it lands here. Your buying list, writing itself.</p>';
  $('#floor-sum').textContent = usd(FLOOR.reduce((a,f)=>a+f[2],0));
  $('#floor').innerHTML = FLOOR.map(f=>`<div class="row"><div class="l"><b>${f[0]}</b><span class="small muted">${f[1]}</span></div><div class="rt num">${usd(f[2])}</div></div>`).join('');
}

/* ---------- Peace of Mind ---------- */
function renderSafe(){
  $('#s-moves').textContent = MOVES.length; $('#s-flag').textContent = FLAGS.length;
  $('#nights').innerHTML = NIGHTLY.map((n,i)=>{ const d=dOff(i-6); return `<div><i>${svgi('check',14)}</i>${DOW[d.getDay()]}</div>`; }).join('');
  $('#flags').innerHTML = FLAGS.map((f,i)=>`<div class="move" id="flag${i}"><div class="h"><b>${f[0]}</b></div><div class="small muted">${f[1]}</div><div class="why">${f[2]}</div>
    <div class="acts"><button class="btn primary sm" data-flag="${i}" data-r="ok">Yes, I know about this</button><button class="btn ghost sm" data-flag="${i}" data-r="ask">Ask about this</button></div>
    <div class="res ok">Noted. Thank you.</div><div class="res ask">Held, and a note went to your bookkeeper. Nothing moves until you clear it.</div></div>`).join('');
  $('#moves').innerHTML = MOVES.map(m=>`<div class="row"><div class="l"><b>${m[1]}</b><span class="small muted">${m[2]}</span></div><div class="rt num" style="color:${m[0]==='In'?'var(--good)':'var(--ink)'}">${m[0]==='In'?'+':'-'}${usd(m[3])}</div></div>`).join('');
  const out=[['Vendors and orders',12960,'cognac'],['Payroll',6880,'walnut'],['Crews and labor',6800,'sage'],['Rent and utilities',2240,'slate'],['Everything else',530,'ink']]; const mx=out[0][1];
  $('#flow').innerHTML = out.map(o=>`<div class="f"><span style="width:150px;flex:none">${o[0]}</span><div class="bar"><b style="width:${o[1]/mx*100}%;background:${col(o[2])}"></b></div><span class="num" style="width:70px;text-align:right">${usd(o[1])}</span></div>`).join('')+'<p class="note">All of it matched to a home or a bill. If a dollar ever moved that the Studio could not match, it would be waiting at the top of this page, and in your 7 AM text.</p>';
  $('#rules').innerHTML = RULES.map(r=>{ const on = r[2] ? store.get('rule_'+r[2])!=='0' : r[1]; return `<div class="rule"><span>${r[0]}</span><button class="switch ${on?'on':''}" role="switch" aria-checked="${on}" aria-label="${esc(r[0])}" data-switch ${r[2]?`data-rule="${r[2]}"`:''}></button></div>`; }).join('');
  $('#team').innerHTML = TEAM.map(t=>`<div class="who"><span class="av" style="background:${col(t[3])}">${t[0]}</span><div><b style="font-weight:500">${t[1]}</b><div class="small muted">${t[2]}</div></div></div>`).join('');
}

/* ---------- Connected ---------- */
function renderConn(){
  $('#conns').innerHTML = CONNS.map(c=>`<details class="acc ctile"><summary><span class="nm"><span class="ic" style="background:${col(c[2])}">${c[0]}</span><span><b>${c[1]}</b><small>${c[3]}</small></span></span><span class="r"><span class="chev" aria-hidden="true">${svgi('chev',16)}</span></span></summary><div class="inner">
    <h5>Works with</h5><div class="works">${c[4].map((w,i)=>`<span class="${i===0?'pick':''}">${w}</span>`).join('')}${c[5].map(w=>`<span>${w}</span>`).join('')}</div>
    <h5>What it brings into the studio</h5><ul>${c[6].map(x=>`<li>${x}</li>`).join('')}</ul>
    <h5>What you can stop doing</h5><ul>${c[7].map(x=>`<li class="no">${x}</li>`).join('')}</ul></div></details>`).join('');
  $('#recipes').innerHTML = RECIPES.map(r=>`<div class="recipe"><div class="when">${r[0]}</div><ol>${r[1].map(s=>`<li>${s}</li>`).join('')}</ol><span class="hands">Happens on its own</span></div>`).join('');
}

/* ---------- Client view ---------- */
function openClient(id){
  const h = HOMES.find(x=>x.id===id); if(!h) return;
  const quoted = h.buy.filter(b=>b[4]==='Quoted').map(b=>[b[1],b[3],b[0]]);
  const sels = quoted.length? quoted : (h.sels||[]);
  const inv = h.pay.find(x=>x.s==='due'||x.s==='late') || h.pay.find(x=>x.s==='up');
  $('#csheet').innerHTML = `
    <div class="cbar"><div class="mark sm"><span class="h">HOME.</span><span class="t">with Lana</span></div><button class="btn ghost sm" data-close="client">Close</button></div>
    <div class="tag">Your client’s private page</div>
    <h3>Welcome home, ${esc(h.short.replace(/^the /,'the '))}.</h3>
    <p class="muted" style="margin-top:.3rem">${esc(h.name)}</p>
    <div class="cscene">${scene(h.scene,h.colors)}</div>
    <div class="steps" aria-hidden="true">${STAGES.map((s,i)=>`<div class="${i<h.stage?'done':i===h.stage?'now':''}"></div>`).join('')}</div>
    <div class="steplbl">${STAGES.map((s,i)=>`<span class="${i===h.stage?'now':''}">${s}</span>`).join('')}</div>
    <div class="cl-card"><div class="lbl">A note from Lana</div><p class="serif" style="font-size:1.2rem;margin-top:.3rem;font-style:italic">${h.note}</p></div>
    ${sels.length?`<div class="cl-card"><div class="lbl">Waiting on your yes</div>
      ${sels.map((s,i)=>`<div class="sel"><span class="sw" style="background:linear-gradient(150deg, ${h.colors[(i+1)%5]}, ${h.colors[(i+3)%5]})"></span><div class="d"><b>${esc(s[0])}</b><span class="small muted">${esc(s[2])} &middot; ${usd(s[1])}</span><div class="okm">Approved. Lana has it.</div></div><button class="btn primary sm" data-approve>Approve</button></div>`).join('')}
    </div>`:''}
    ${inv?`<div class="cl-card"><div class="lbl">${inv.s==='up'?'Coming up':'Ready to pay'}</div><div class="inv"><div><b style="font-weight:500">${inv.l}</b><div class="v">${usd(inv.amt)}</div></div>${inv.s==='up'?'<span class="pill up">'+fmt(inv.date)+'</span>':`<button class="btn primary sm" data-pay>Pay now</button>`}</div><p class="small muted" style="margin-top:.5rem">Card or bank transfer. Your receipt arrives by email.</p></div>`:''}
    <div class="cl-card"><div class="lbl">Fresh from your home</div><div class="photos" style="margin-top:.6rem;grid-template-columns:repeat(3,1fr)">${h.photos.slice(0,3).map(([l,a,b])=>`<div class="ph" style="background:linear-gradient(160deg, ${col(a)}, ${col(b)})"><small>${l}</small></div>`).join('')}</div></div>
    <button class="btn ghost block" style="margin-top:1rem" data-toast="Message sent to Lana.">Send Lana a message</button>`;
  $('#client').classList.add('open'); $('#csheet').scrollTop=0; _cret=document.activeElement; ['.shell','#bottomnav','#detail'].forEach(s=>{ $(s).inert=true; }); const cb=$('#csheet [data-close]'); if(cb) cb.focus({preventScroll:true});
}
let _cret=null;
function closeClient(){ if(!$('#client').classList.contains('open')) return; $('#client').classList.remove('open'); ['.shell','#bottomnav','#detail'].forEach(s=>{ $(s).inert=false; }); if($('#detail').classList.contains('open')){ ['.shell','#bottomnav'].forEach(s=>{ $(s).inert=true; }); } if(_cret&&_cret.focus){ try{ _cret.focus({preventScroll:true}); }catch(e){} } }

/* ---------- Events (one delegated listener) ---------- */
document.addEventListener('click', e=>{
  const t = e.target.closest('button,[data-go]'); if(!t) return;
  if(t.dataset.go){ go(t.dataset.go); return; }
  if(t.dataset.act){ const a=t.dataset.act; if(a==='owed'){ go('money'); setTimeout(()=>{ $('#owed-acc').open=true; $('#owed-acc').scrollIntoView({behavior:'smooth',block:'start'}); },300); } else if(a.startsWith('go:')) go(a.slice(3)); return; }
  if(t.dataset.task!==undefined){ doTask(+t.dataset.task, t.dataset.r); return; }
  if(t.dataset.open){ openDetail(t.dataset.open); return; }
  if(t.dataset.close==='detail'){ dismissDetail(); return; }
  if(t.dataset.close==='client'){ closeClient(); return; }
  if(t.dataset.client){ openClient(t.dataset.client); return; }
  if(t.dataset.filt){ filt=t.dataset.filt; renderHomes(); return; }
  if(t.dataset.flag!==undefined){ $('#flag'+t.dataset.flag).classList.add(t.dataset.r); const left=$$('.move:not(.ok):not(.ask)').length; $('#s-flag').textContent=left; if(!left) $('#flags').insertAdjacentHTML('beforeend','<div class="allclear">All clear. Nothing waiting on you.</div>'); return; }
  if(t.hasAttribute('data-switch')){ t.classList.toggle('on'); const on=t.classList.contains('on'); t.setAttribute('aria-checked',on); if(t.dataset.rule){ store.set('rule_'+t.dataset.rule, on?'1':'0'); if(t.dataset.rule==='word') $('#word').style.display=on?'':'none'; if(t.dataset.rule==='sunday') renderToday(); } toast(on?'Turned on':'Turned off'); return; }
  if(t.hasAttribute('data-peek')){ store.set('rule_sunday','0'); renderToday(); $$('[data-rule=sunday]').forEach(s=>{s.classList.remove('on');s.setAttribute('aria-checked','false');}); return; }
  if(t.hasAttribute('data-approve')){ t.closest('.sel').classList.add('ok'); toast('Approved. Lana has it.'); return; }
  if(t.hasAttribute('data-pay')){ t.outerHTML='<span class="pill paid">Paid</span>'; toast('Paid by bank transfer. It is already in Lana’s books.'); return; }
  if(t.hasAttribute('data-big')||t.id==='bigbtn'){ toggleBig(); return; }
  if(t.dataset.toast){ toast(t.dataset.toast); return; }
  if(t.dataset.p){ $$('#seg button').forEach(x=>{ x.classList.toggle('on',x===t); x.setAttribute('aria-pressed',x===t); }); renderMoney(t.dataset.p); return; }
});
$('#client').addEventListener('click', e=>{ if(e.target===$('#client')) closeClient(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ if($('#client').classList.contains('open')) closeClient(); else dismissDetail(); } });

/* ---------- Install prompt (Android / desktop Chrome) ---------- */
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; $('#install-cta').classList.add('show'); });
$('#installbtn').addEventListener('click', async()=>{ if(!deferredPrompt) return; deferredPrompt.prompt(); const r=await deferredPrompt.userChoice; if(r.outcome==='accepted') toast('Added. Look for Lana’s Studio on your home screen.'); deferredPrompt=null; $('#install-cta').classList.remove('show'); });
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }

let _rz,_w=innerWidth; window.addEventListener('resize',()=>{ clearTimeout(_rz); _rz=setTimeout(()=>{ if(innerWidth===_w) return; _w=innerWidth; if(current==='money') renderMoney(); if(current==='show') renderShow(); },200); });
document.addEventListener('visibilitychange',()=>{ if(!document.hidden && new Date().setHours(0,0,0,0)!==TODAY.getTime()) location.reload(); });

/* ---------- Boot ---------- */
buildNav(); buildGate(); renderToday(); renderHomes(); renderMoney(); renderShow(); renderSafe(); renderConn();
const h0 = location.hash.replace('#','');
if(h0.startsWith('home-')){ go('homes',false); if(history.replaceState) history.replaceState({v:'homes'}, '', '#homes'); openDetail(h0.slice(5)); }
else { const v=VIEWS.includes(h0)?h0:'today'; go(v,false); if(history.replaceState) history.replaceState({v}, '', '#'+v); }
