(function(){
  const TX_KEY='gt27_demo_tx_v2';
  const HISTORY_KEY='gt27_demo_buyer_history_v1';
  const $=id=>document.getElementById(id);
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const fmt=n=>'GT27-'+String(n).padStart(5,'0');
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH');
  function allIssuedNumbers(){
    const set=new Set();
    const h=read(HISTORY_KEY,[]);
    h.forEach(o=>(o.tickets||[]).forEach(t=>{if(t.ticketNo)set.add(t.ticketNo)}));
    const tx=read(TX_KEY,null);
    if(tx?.status==='issued')(tx.tickets||[]).forEach(t=>{if(t.ticketNo)set.add(t.ticketNo)});
    return set;
  }
  function renderAvailability(){
    const input=$('preferredNumbers');
    const box=$('numberAvailability');
    if(!input||!box)return;
    const raw=String(input.value||'').trim();
    if(!raw){box.className='notice ok';box.innerHTML='<b>NUMBER CHECK</b><br>No preferred number selected. The seller can assign available numbers.';return;}
    const used=allIssuedNumbers();
    const parts=raw.split(/[\s,;]+/).filter(Boolean);
    const seen=new Set();
    const rows=[];let hasProblem=false;
    for(const p of parts){
      if(!/^\d+$/.test(p)){rows.push('⚠ '+p+' — INVALID');hasProblem=true;continue}
      const n=Number(p),no=fmt(n);
      if(n<1||n>99999){rows.push('⚠ '+p+' — OUT OF RANGE');hasProblem=true;continue}
      if(seen.has(n)){rows.push('⚠ '+no+' — DUPLICATE IN REQUEST');hasProblem=true;continue}
      seen.add(n);
      if(used.has(no)){rows.push('✕ '+no+' — ALREADY TAKEN');hasProblem=true}else rows.push('✓ '+no+' — AVAILABLE');
    }
    box.className='notice '+(hasProblem?'warn':'ok');
    box.innerHTML='<b>NUMBER AVAILABILITY</b><br>'+rows.join('<br>');
    box.dataset.hasProblem=hasProblem?'1':'0';
  }
  function addAvailability(){
    const input=$('preferredNumbers');if(!input||$('numberAvailability'))return;
    const box=document.createElement('div');box.id='numberAvailability';box.className='notice ok';box.style.marginTop='8px';
    input.closest('div')?.appendChild(box);
    input.addEventListener('input',renderAvailability);
    renderAvailability();
    const pay=$('toPay');
    if(pay&&!pay.dataset.numberGuard){
      pay.dataset.numberGuard='1';
      pay.addEventListener('click',e=>{renderAvailability();if(box.dataset.hasProblem==='1'){e.stopImmediatePropagation();e.preventDefault();alert('Please choose only available raffle numbers before continuing.');}},true);
    }
  }
  function archiveCurrent(){
    const tx=read(TX_KEY,null);if(!tx||tx.status!=='issued'||!tx.requestNo)return;
    const h=read(HISTORY_KEY,[]);
    if(!h.some(x=>x.requestNo===tx.requestNo)){
      h.unshift({requestNo:tx.requestNo,issuedAt:tx.issuedAt||new Date().toISOString(),controlNo:tx.controlNo||'',qty:tx.qty||0,total:tx.total||0,status:'issued',tickets:tx.tickets||[],paymentRef:tx.paymentRef||''});
      write(HISTORY_KEY,h.slice(0,50));
    }
  }
  function renderHistory(){
    archiveCurrent();
    let card=$('purchaseHistoryCard');
    if(!card){
      card=document.createElement('section');card.className='card';card.id='purchaseHistoryCard';
      card.innerHTML='<h2 style="margin:0;color:var(--green);font-family:Georgia,serif">My Purchase History</h2><p class="small">Your previous issued e-tickets stay here when you buy again.</p><div id="purchaseHistoryList"></div>';
      document.querySelector('main')?.appendChild(card);
    }
    const list=$('purchaseHistoryList'),h=read(HISTORY_KEY,[]);
    if(!list)return;
    if(!h.length){list.innerHTML='<div class="notice warn">No completed purchases yet.</div>';return}
    list.innerHTML=h.map(o=>'<div class="summary"><div class="kv"><span>Request No.</span><b>'+(o.requestNo||'—')+'</b></div><div class="kv"><span>Control No.</span><b>'+(o.controlNo||'—')+'</b></div><div class="kv"><span>Quantity</span><b>'+(o.qty||0)+'</b></div><div class="kv"><span>Total</span><b>'+money(o.total||((o.qty||0)*100))+'</b></div><div class="kv"><span>Status</span><b style="color:var(--green)">ISSUED / VALID</b></div><div class="kv"><span>Ticket No(s).</span><b>'+((o.tickets||[]).map(t=>t.ticketNo).join(', ')||'—')+'</b></div></div>').join('');
  }
  function addStatusShortcut(){
    const hero=document.querySelector('.hero');if(!hero||$('historyBtn'))return;
    const b=document.createElement('button');b.id='historyBtn';b.className='btn secondary full';b.style.marginTop='8px';b.textContent='MY PURCHASE HISTORY';b.onclick=()=>{renderHistory();$('purchaseHistoryCard')?.scrollIntoView({behavior:'smooth',block:'start'})};
    hero.appendChild(b);
  }
  function init(){addAvailability();renderHistory();addStatusShortcut();window.addEventListener('focus',()=>{renderAvailability();renderHistory()});window.addEventListener('storage',()=>{renderAvailability();renderHistory()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
