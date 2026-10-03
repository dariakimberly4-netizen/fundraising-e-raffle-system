(function(){
  const SEEN_KEY='gt27_seller_overview_seen_v1';
  const RECENT_VERSION='recent-sales-v2';
  const PENDING_VERSION='pending-payments-v2';
  let lastSignature='';

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function peso(n){return '₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2})}
  function seen(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')||{}}catch(e){return{}}}
  function saveSeen(x){try{localStorage.setItem(SEEN_KEY,JSON.stringify(x))}catch(e){}}
  function fmtDate(v){
    if(!v)return '';
    const d=new Date(v);if(Number.isNaN(d.getTime()))return '';
    return d.toLocaleString('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
  }
  function sales(){try{return (typeof db!=='undefined'&&Array.isArray(db.sales))?db.sales:[]}catch(e){return[]}}
  function ticketsFor(saleId){try{return (db.tickets||[]).filter(t=>t.saleId===saleId)}catch(e){return[]}}
  function sortedSales(){
    return sales().map((s,i)=>({s,i})).sort((a,b)=>{
      const ad=new Date(a.s.createdAt||a.s.date||0).getTime()||0;
      const bd=new Date(b.s.createdAt||b.s.date||0).getTime()||0;
      return bd-ad||b.i-a.i;
    }).map(x=>x.s);
  }
  function style(){
    if(document.getElementById('sellerSimpleOverviewStyle'))return;
    const s=document.createElement('style');s.id='sellerSimpleOverviewStyle';s.textContent=`
      #sellerSalesOverview{margin-top:14px!important}
      #sellerSalesOverview .seller-overview-card{position:relative!important;overflow:hidden!important}
      #sellerSalesOverview .seller-overview-card.feature-new{
        border:3px solid #d7a91f!important;
        background:linear-gradient(135deg,#fffef8 0%,#fff6c9 100%)!important;
        box-shadow:0 0 0 5px rgba(215,169,31,.18),0 14px 34px rgba(112,82,0,.18)!important;
        animation:sellerOverviewNewPulse 1.9s ease-in-out infinite!important;
      }
      #sellerSalesOverview .seller-overview-card.feature-new:before{
        content:'NEW FEATURE';position:absolute;top:10px;right:10px;z-index:2;
        background:#ee3a16;color:#fff;border-radius:999px;padding:6px 10px;
        font-size:9px;font-weight:950;letter-spacing:.08em;line-height:1;
        box-shadow:0 5px 12px rgba(238,58,22,.22)
      }
      #sellerSalesOverview .seller-overview-card.feature-new h3{padding-right:92px!important}
      #sellerSalesOverview .new-pill{display:inline-flex;margin-left:7px;padding:4px 8px;border-radius:999px;background:#ee3a16;color:#fff;font-size:9px;font-weight:950;line-height:1;letter-spacing:.06em;vertical-align:middle}
      #sellerSalesOverview .sale-row{padding:11px 0;border-bottom:1px solid #edf2ea}
      #sellerSalesOverview .sale-row:last-child{border-bottom:0}
      #sellerSalesOverview .sale-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
      #sellerSalesOverview .sale-name{font-weight:900;color:#263524}
      #sellerSalesOverview .sale-meta{font-size:12px;color:#6b7567;margin-top:3px;line-height:1.35}
      #sellerSalesOverview .sale-amount{font-weight:900;color:#246b2d;text-align:right;white-space:nowrap}
      #sellerSalesOverview .status-pill{display:inline-flex;margin-top:5px;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:950}
      #sellerSalesOverview .status-paid{background:#e5f5ed;color:#187650}
      #sellerSalesOverview .status-pending{background:#fff1d6;color:#8a6111}
      #sellerSalesOverview .pending-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
      #sellerSalesOverview .overview-empty{padding:16px 0;color:#6b7567;font-size:13px}
      @keyframes sellerOverviewNewPulse{
        0%,100%{box-shadow:0 0 0 5px rgba(215,169,31,.18),0 14px 34px rgba(112,82,0,.18)}
        50%{box-shadow:0 0 0 9px rgba(215,169,31,.10),0 16px 38px rgba(112,82,0,.22)}
      }
      @media(prefers-reduced-motion:reduce){#sellerSalesOverview .seller-overview-card.feature-new{animation:none!important}}
      @media(max-width:760px){#sellerSalesOverview .sale-top{flex-direction:column}#sellerSalesOverview .sale-amount{text-align:left}#sellerSalesOverview .seller-overview-card.feature-new:before{top:8px;right:8px}}
    `;document.head.appendChild(s);
  }
  function markSeen(kind){
    const x=seen();
    if(kind==='recent')x.recent=RECENT_VERSION;
    if(kind==='pending')x.pending=PENDING_VERSION;
    saveSeen(x);
    applyHighlights();
  }
  function applyHighlights(){
    const x=seen();
    const recent=document.getElementById('sellerRecentSalesCard');
    const pending=document.getElementById('sellerPendingPaymentsCard');
    if(recent){
      const isNew=x.recent!==RECENT_VERSION;recent.classList.toggle('feature-new',isNew);
      const h=recent.querySelector('h3');let p=h?.querySelector('.new-pill');
      if(isNew&&!p&&h){p=document.createElement('span');p.className='new-pill';p.textContent='NEW';h.appendChild(p)}
      if(!isNew)p?.remove();
    }
    if(pending){
      const isNew=x.pending!==PENDING_VERSION;pending.classList.toggle('feature-new',isNew);
      const h=pending.querySelector('h3');let p=h?.querySelector('.new-pill');
      if(isNew&&!p&&h){p=document.createElement('span');p.className='new-pill';p.textContent='NEW';h.appendChild(p)}
      if(!isNew)p?.remove();
    }
  }
  function ensureShell(){
    const dashboard=document.getElementById('dashboard');if(!dashboard)return null;
    let wrap=document.getElementById('sellerSalesOverview');
    if(wrap)return wrap;
    wrap=document.createElement('div');wrap.id='sellerSalesOverview';wrap.className='two';
    wrap.innerHTML=`
      <div id="sellerRecentSalesCard" class="card seller-overview-card"><h3>Recent Sales</h3><p class="note">Latest buyer transactions.</p><div id="sellerRecentSalesList"></div></div>
      <div id="sellerPendingPaymentsCard" class="card seller-overview-card"><h3>Pending Payments</h3><p class="note">Sales still waiting for payment confirmation.</p><div id="sellerPendingPaymentsList"></div></div>`;
    dashboard.appendChild(wrap);
    document.getElementById('sellerRecentSalesCard')?.addEventListener('click',()=>markSeen('recent'),{once:true});
    document.getElementById('sellerPendingPaymentsCard')?.addEventListener('click',e=>{if(!e.target.closest('[data-mark-paid]'))markSeen('pending')},{once:true});
    return wrap;
  }
  function row(s,withAction){
    const status=(s.status||'pending').toLowerCase()==='paid'?'paid':'pending';
    const date=fmtDate(s.createdAt||s.date);
    const ts=ticketsFor(s.id).length;
    return `<div class="sale-row"><div class="sale-top"><div><div class="sale-name">${esc(s.buyerName||'Unnamed buyer')}</div><div class="sale-meta">${esc(s.contact||s.email||'No contact')} • ${Number(s.qty||ts||0)} ticket${Number(s.qty||ts||0)!==1?'s':''}${date?' • '+esc(date):''}</div></div><div class="sale-amount">${peso(s.total)}<div><span class="status-pill status-${status}">${status.toUpperCase()}</span></div></div></div>${withAction?`<div class="pending-actions"><button type="button" class="btn primary" data-mark-paid="${esc(s.id)}">Mark Paid</button></div>`:''}</div>`;
  }
  function setPaid(id){
    try{
      if(typeof setSaleStatus==='function')setSaleStatus(id,'paid');
      else{
        const sale=sales().find(x=>String(x.id)===String(id));
        if(!sale)return;
        sale.status='paid';
        try{(db.tickets||[]).filter(t=>String(t.saleId)===String(sale.id)&&!t.voided).forEach(t=>t.status='paid')}catch(e){}
        localStorage.setItem('fundraising_eraffle_v1',JSON.stringify(db));
        try{if(typeof renderAll==='function')renderAll()}catch(e){}
      }
      markSeen('pending');lastSignature='';render();
      try{if(typeof toast==='function')toast('Payment marked Paid.')}catch(e){}
    }catch(e){alert('Unable to mark this payment Paid.')}
  }
  function render(){
    style();if(!ensureShell())return;
    const all=sortedSales();
    const pending=all.filter(s=>(s.status||'pending').toLowerCase()==='pending');
    const signature=JSON.stringify(all.map(s=>[s.id,s.status,s.total,s.qty,s.createdAt]).slice(0,12));
    if(signature===lastSignature){applyHighlights();return}
    lastSignature=signature;
    const recentBox=document.getElementById('sellerRecentSalesList');
    const pendingBox=document.getElementById('sellerPendingPaymentsList');
    if(recentBox)recentBox.innerHTML=all.length?all.slice(0,6).map(s=>row(s,false)).join(''):'<div class="overview-empty">No sales yet.</div>';
    if(pendingBox)pendingBox.innerHTML=pending.length?pending.slice(0,6).map(s=>row(s,true)).join(''):'<div class="overview-empty">No pending payments.</div>';
    document.querySelectorAll('#sellerPendingPaymentsList [data-mark-paid]').forEach(b=>b.onclick=e=>{e.stopPropagation();setPaid(b.dataset.markPaid)});
    applyHighlights();
  }
  function loadEmphasis(){
    if(document.getElementById('sellerOverviewEmphasisLoader'))return;
    const s=document.createElement('script');s.id='sellerOverviewEmphasisLoader';s.src='./seller-overview-emphasis.js?v=3&t='+Date.now();document.head.appendChild(s);
  }
  function init(){render();loadEmphasis();setTimeout(render,350);setTimeout(render,900);setInterval(render,2500);document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastSignature='';render()}})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
