/* Home with Lana · Studio  (first-open walkthrough)
   Gentle, skippable, never more than one sentence at a time.
   Opens on its own the first time. The second and third time it only offers.
   After that it lives under Help as "Show me around." */
(function(){
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  const isAndroid = /Android/.test(ua);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone===true;
  const mobile = () => window.innerWidth < 1040;

  function installStep(){
    if(standalone) return {title:'You’re all set.', body:'The Studio is on your phone now. Open it any morning, like any other app.', done:true};
    if(isIOS) return {title:'Put it on your phone.', body:'Tap the Share button at the bottom of Safari (the square with the arrow), then tap <b>Add to Home Screen</b>, then <b>Add</b>. After that it opens in one tap.', done:true, help:true};
    if(isAndroid) return {title:'Put it on your phone.', body:'Tap the three dots at the top right of Chrome, then <b>Add to Home screen</b>, then <b>Add</b>. After that it opens in one tap.', done:true, help:true, install:true};
    return {title:'Keep it close.', body:'In Chrome or Edge, click the small install icon at the right end of the address bar and it opens in its own window. On your phone, the Help page shows you how.', done:true, help:true};
  }

  const STEPS = () => [
    {title:'Welcome to your Studio, Lana.', body:'Let me show you around. It takes about a minute, and you can stop anytime.', first:true},
    {target:'#today-trio', title:'Three numbers, every morning.', body:'What came in, what you’re owed, and what went out. Tap one to see where it comes from.'},
    {target:'#tasks', title:'Needs you today.', body:'Anything waiting on your OK lands here. Tap a button and it’s handled. Nothing else needs you.'},
    {target: mobile()? 'nav.bottom' : 'nav.side', title:'Five places, that’s all.', body:'Homes, Money, Showroom and Peace of Mind. Tap any of them whenever you like. Tap Today to come back.'},
    {target:'#mini .pcard', title:'Tap a home to open it.', body:'Every payment, purchase, photo and date for that home lives inside.'},
    installStep()
  ];

  let i=0, steps=[], root, spot, card;
  function build(){
    root=document.createElement('div'); root.id='tour'; root.setAttribute('role','dialog'); root.setAttribute('aria-label','Quick tour');
    root.innerHTML='<div class="spot" id="tour-spot"></div><div class="tcard" id="tour-card"></div>';
    document.body.appendChild(root);
    spot=root.querySelector('.spot'); card=root.querySelector('.tcard');
    root.addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return;
      if(b.dataset.t==='next') show(i+1);
      else if(b.dataset.t==='back') show(i-1);
      else if(b.dataset.t==='skip') end(false);
      else if(b.dataset.t==='done') end(true);
      else if(b.dataset.t==='help'){ end(true); go('help'); }
      else if(b.dataset.t==='install'){ const ib=document.getElementById('installbtn'); if(ib) ib.click(); }
    });
    window.addEventListener('resize', ()=>{ if(root.classList.contains('on')) place(); });
    window.addEventListener('scroll', ()=>{ if(root.classList.contains('on')) place(false); }, {passive:true});
  }
  function place(scroll=true){
    const s=steps[i]; const t=s.target && document.querySelector(s.target);
    const vh=window.innerHeight, navH = mobile()? 72 : 0;
    root.classList.toggle('dim', !t);
    if(t){
      const tall = t.getBoundingClientRect().height > vh*0.42;
      if(scroll){ const r0=t.getBoundingClientRect(); const target = tall ? r0.top + window.scrollY - 84 : r0.top + window.scrollY - (vh - r0.height)/2; window.scrollTo({top: Math.max(0,target), behavior:'instant'}); }
      const r=t.getBoundingClientRect(); const pad=8;
      spot.style.display='block';
      spot.style.left=(r.left-pad)+'px'; spot.style.top=(r.top-pad)+'px'; spot.style.width=(r.width+pad*2)+'px'; spot.style.height=(r.height+pad*2)+'px';
      card.classList.add('float');
      const ch=card.offsetHeight;
      const fitsBelow = r.bottom + 16 + ch < vh - navH - 12;
      const fitsAbove = r.top - 16 - ch > 12;
      if(s.target==='nav.bottom'){ card.style.top='auto'; card.style.bottom=(r.height+20)+'px'; }
      else if(s.target==='nav.side'){ card.style.top='40%'; card.style.bottom='auto'; }
      else if(fitsBelow){ card.style.top=(r.bottom+16)+'px'; card.style.bottom='auto'; }
      else if(fitsAbove && !tall){ card.style.top='auto'; card.style.bottom=(vh - r.top + 16)+'px'; }
      else { card.style.top='auto'; card.style.bottom=(navH+16)+'px'; }
    } else {
      spot.style.display='none'; card.classList.remove('float'); card.style.top=''; card.style.bottom='';
    }
  }
  function show(n){
    i=Math.max(0, Math.min(steps.length-1, n)); const s=steps[i]; const last=i===steps.length-1;
    card.innerHTML = `<div class="tstep">${i+1} of ${steps.length}</div><h4>${s.title}</h4><p>${s.body}</p>
      <div class="tacts">
        ${s.install?'<button class="btn primary sm" data-t="install">Add it now</button>':''}
        ${last?'<button class="btn primary sm" data-t="done">Done</button>':'<button class="btn primary sm" data-t="next">'+(s.first?'Show me':'Next')+'</button>'}
        ${s.help?'<button class="btn ghost sm" data-t="help">Open Help</button>':''}
        ${(!s.first&&!last)?'<button class="btn ghost sm" data-t="back">Back</button>':''}
        ${!last?'<button class="btn txt" data-t="skip">'+(s.first?'Maybe later':'Stop here')+'</button>':''}
      </div>`;
    card.style.visibility='hidden'; requestAnimationFrame(()=>{ place(); card.style.visibility=''; const f=card.querySelector('button'); if(f) f.focus({preventScroll:true}); });
  }
  function start(){ if(!root) build(); steps=STEPS(); go('today',false); root.classList.add('on'); document.body.classList.add('touring'); show(0); }
  function end(done){ root.classList.remove('on'); document.body.classList.remove('touring'); if(done) store.set('tour_done','1'); const g=document.getElementById('greet'); if(g) g.focus({preventScroll:true}); }
  document.addEventListener('keydown', e=>{ if(root&&root.classList.contains('on')&&e.key==='Escape') end(false); });

  /* Offer: a quiet line under the greeting on the second and third open */
  function offer(){
    const host=document.getElementById('word'); if(!host) return;
    const o=document.createElement('div'); o.className='tour-offer'; o.innerHTML='<span>Want the quick tour again?</span><button class="btn ghost sm" data-tour="start">Yes, show me</button><button class="btn txt" data-tour="no">No thanks</button>';
    host.insertAdjacentElement('afterend', o);
    o.addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; o.remove(); if(b.dataset.tour==='start') start(); else store.set('tour_done','1'); });
  }

  /* Decide on open */
  const opens = (parseInt(store.get('opens')||'0',10) || 0) + 1; store.set('opens', String(opens));
  const done = store.get('tour_done')==='1';
  window.startTour = start;
  const origEnter = window.enter;
  window.enter = function(){ origEnter(); if(window._toured) return; window._toured=true;
    if(done) return;
    if(opens<=1) setTimeout(start, 650);
    else if(opens<=3) setTimeout(offer, 400);
  };
})();
