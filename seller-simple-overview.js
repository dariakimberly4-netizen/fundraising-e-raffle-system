(function(){
  const SEEN_KEY='gt27_seller_overview_seen_v1';
  const ACTION_KEY='gt27_seller_action_seen_v2';
  const RECENT_VERSION='recent-sales-v3';
  const PENDING_VERSION='pending-payments-v3';
  const TODAY_VERSION='today-summary-v1';
  const RESEND_VERSION='resend-release-v2';
  const VOIDSALE_VERSION='void-sale-v2';
  const VOIDTICKET_VERSION='void-ticket-v2';
  const PREFIX='ERTKT1.';
  let lastSignature='';

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function peso(n){return '₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2})}
  function seen(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')||{}}catch(e){return{}}}
  function saveSeen(x){try{localStorage.setItem(SEEN_KEY,JSON.stringify(x))}catch(e){}}
  function actionSeen(){try{return JSON.parse(localStorage.getItem(ACTION_KEY)||'{}')||{}}catch(e){return{}}}
  function saveActionSeen(x){try{localStorage.setItem(ACTION_KEY,JSON.stringify(x))}catch(e){}}
  function fmtDate(v){if(!v)return '';const d=new Date(v);if(Number.isNaN(d.getTime()))return '';return d.toLocaleString('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}
  function isToday(v){if(!v)return false;const d=new Date(v),n=new Date();return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()&&d.getDate()===n.getDate()}
  function sales(){try{return (typeof db!=='undefined'&&Array.isArray(db.sales))?db.sales:[]}catch(e){return[]}}
  function tickets(){try{return (typeof db!=='undefined'&&Array.isArray(db.tickets))?db.tickets:[]}catch(e){return[]}}
  function ticketsFor(saleId){return tickets().filter(t=>String(t.saleId)===String(saleId))}
  function sortedSales(){return sales().map((s,i)=>({s,i})).sort((a,b)=>{const ad=new Date(a.s.createdAt||a.s.date||0).getTime()||0;const bd=new Date(b.s.createdAt||b.s.date||0).getTime()||0;return bd-ad||b.i-a.i}).map(x=>x.s)}
  function enc(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}

  function style(){
    if(document.getElementById('sellerSimpleOverviewStyle'))return;
    const s=document.createElement('style');s.id='sellerSimpleOverviewStyle';s.textContent=`
      #sellerTodaySummary{margin-top:14px!important;position:relative!important;overflow:hidden!important}
      #sellerTodaySummary.feature-new,#sellerSalesOverview .seller-overview-card.feature-new{border:3px solid #d7a91f!important;background:linear-gradient(135deg,#fffef8 0%,#fff6c9 100%)!important;box-shadow:0 0 0 5px rgba(215,169,31,.18),0 14px 34px rgba(112,82,0,.18)!important}
      #sellerTodaySummary.feature-new:before,#sellerSalesOverview .seller-overview-card.feature-new:before{content:'NEW';position:absolute;top:10px;right:10px;z-index:2;background:#ee3a16;color:#fff;border-radius:999px;padding:6px 10px;font-size:9px;font-weight:950;letter-spacing:.08em;line-height:1;box-shadow:0 5px 12px rgba(238,58,22,.22)}
      #sellerTodaySummary h3,#sellerSalesOverview h3{margin-top:0!important}
      #sellerTodaySummary .today-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:12px}
      #sellerTodaySummary .today-stat{border:1px solid #e3eadf;border-radius:14px;padding:12px;background:#fff}
      #sellerTodaySummary .today-stat b{display:block;color:#246b2d;font-size:21px;line-height:1.05}
      #sellerTodaySummary .today-stat span{display:block;color:#6b7567;font-size:11px;margin-top:5px}
      #sellerSalesOverview{margin-top:14px!important}
      #sellerSalesOverview .seller-overview-card{position:relative!important;overflow:hidden!important}
      #sellerSalesOverview .sale-row{padding:11px 0;border-bottom:1px solid #edf2ea}
      #sellerSalesOverview .sale-row:last-child{border-bottom:0}
      #sellerSalesOverview .sale-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
      #sellerSalesOverview .sale-name{font-weight:900;color:#263524}
      #sellerSalesOverview .sale-meta{font-size:12px;color:#6b7567;margin-top:3px;line-height:1.35}
      #sellerSalesOverview .sale-amount{font-weight:900;color:#246b2d;text-align:right;white-space:nowrap}
      #sellerSalesOverview .status-pill{display:inline-flex;margin-top:5px;padding:4px 8px;border-radius:999px;font-size:10px;font-weight:950}
      #sellerSalesOverview .status-paid{background:#e5f5ed;color:#187650}
      #sellerSalesOverview .status-pending{background:#fff1d6;color:#8a6111}
      #sellerSalesOverview .status-void{background:#fde7e9;color:#a33038}
      #sellerSalesOverview .sale-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:8px}
      #sellerSalesOverview .btn.danger{background:#fff0f1!important;color:#a33038!important;border:1px solid #f1c7cb!important}
      #sellerSalesOverview .overview-empty{padding:16px 0;color:#6b7567;font-size:13px}
      .seller-action-new{position:relative!important;border:2px solid #d7a91f!important;box-shadow:0 0 0 4px rgba(215,169,31,.18),0 7px 18px rgba(105,77,0,.14)!important;padding-right:52px!important;animation:sellerActionPulse 1.8s ease-in-out infinite!important}
      .seller-action-new:after{content:'NEW';position:absolute;right:7px;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;padding:4px 7px;border-radius:999px;background:#ee3a16;color:#fff;font-size:8px;font-weight:950;letter-spacing:.06em;line-height:1}
      #ticketList button.seller-action-new{background:#fff7db!important;color:#7a5700!important}
      @keyframes sellerActionPulse{0%,100%{box-shadow:0 0 0 4px rgba(215,169,31,.18),0 7px 18px rgba(105,77,0,.14)}50%{box-shadow:0 0 0 8px rgba(215,169,31,.09),0 9px 22px rgba(105,77,0,.18)}}
      @media(prefers-reduced-motion:reduce){.seller-action-new{animation:none!important}}
      @media(max-width:760px){#sellerTodaySummary .today-grid{grid-template-columns:1fr 1fr}#sellerSalesOverview .sale-top{flex-direction:column}#sellerSalesOverview .sale-amount{text-align:left}}
    `;document.head.appendChild(s);
  }

  function markSeen(kind){const x=seen();if(kind==='recent')x.recent=RECENT_VERSION;if(kind==='pending')x.pending=PENDING_VERSION;if(kind==='today')x.today=TODAY_VERSION;saveSeen(x);applyHighlights()}
  function markActionSeen(kind){
    const x=actionSeen();
    if(kind==='resend')x.resend=RESEND_VERSION;
    if(kind==='voidsale')x.voidsale=VOIDSALE_VERSION;
    if(kind==='voidticket')x.voidticket=VOIDTICKET_VERSION;
    saveActionSeen(x);applyActionHighlights();
  }
  function applyHighlights(){
    const x=seen();
    const today=document.getElementById('sellerTodaySummary'),recent=document.getElementById('sellerRecentSalesCard'),pending=document.getElementById('sellerPendingPaymentsCard');
    if(today)today.classList.toggle('feature-new',x.today!==TODAY_VERSION);
    if(recent)recent.classList.toggle('feature-new',x.recent!==RECENT_VERSION);
    if(pending)pending.classList.toggle('feature-new',x.pending!==PENDING_VERSION);
  }
  function applyActionHighlights(){
    const x=actionSeen();
    document.querySelectorAll('[data-resend-release]').forEach(b=>b.classList.toggle('seller-action-new',x.resend!==RESEND_VERSION));
    document.querySelectorAll('[data-void-sale]').forEach(b=>b.classList.toggle('seller-action-new',x.voidsale!==VOIDSALE_VERSION));
    document.querySelectorAll('#ticketList button[onclick^="voidTicket("]').forEach(b=>{
      b.classList.toggle('seller-action-new',x.voidticket!==VOIDTICKET_VERSION);
      if(!b.dataset.voidTicketHighlightBound){b.dataset.voidTicketHighlightBound='1';b.addEventListener('click',()=>markActionSeen('voidticket'),{once:true})}
    });
  }

  function ensureShell(){
    const dashboard=document.getElementById('dashboard');if(!dashboard)return null;
    let today=document.getElementById('sellerTodaySummary');
    if(!today){
      today=document.createElement('div');today.id='sellerTodaySummary';today.className='card';
      today.innerHTML=`<h3>Today’s Summary</h3><p class="note">Quick seller totals for today.</p><div class="today-grid"><div class="today-stat"><b id="todaySales">0</b><span>Sales Today</span></div><div class="today-stat"><b id="todayPaid">₱0</b><span>Paid Today</span></div><div class="today-stat"><b id="todayPending">₱0</b><span>Pending Amount</span></div><div class="today-stat"><b id="todayTickets">0</b><span>Tickets Issued</span></div></div>`;
      const stats=dashboard.querySelector('.stats');stats?.insertAdjacentElement('afterend',today);
      today.addEventListener('click',()=>markSeen('today'),{once:true});
    }
    let wrap=document.getElementById('sellerSalesOverview');
    if(!wrap){
      wrap=document.createElement('div');wrap.id='sellerSalesOverview';wrap.className='two';
      wrap.innerHTML=`<div id="sellerRecentSalesCard" class="card seller-overview-card"><h3>Recent Sales</h3><p class="note">Latest buyer transactions with quick actions.</p><div id="sellerRecentSalesList"></div></div><div id="sellerPendingPaymentsCard" class="card seller-overview-card"><h3>Pending Payments</h3><p class="note">Sales still waiting for payment confirmation.</p><div id="sellerPendingPaymentsList"></div></div>`;
      dashboard.appendChild(wrap);
      document.getElementById('sellerRecentSalesCard')?.addEventListener('click',()=>markSeen('recent'),{once:true});
      document.getElementById('sellerPendingPaymentsCard')?.addEventListener('click',e=>{if(!e.target.closest('button'))markSeen('pending')},{once:true});
    }
    return wrap;
  }

  function releaseCode(s){
    if(!s||s.status!=='paid'||s.voided)return '';
    const ts=ticketsFor(s.id).filter(t=>!t.voided&&t.status==='paid');if(!ts.length)return '';
    return PREFIX+enc({v:1,campaign:'GET TOGETHER 2027',saleId:s.id,buyerName:s.buyerName,issuedAt:new Date().toISOString(),drawDate:'2027-01-16',tickets:ts.map(t=>({number:t.number,code:t.code,buyerName:t.buyerName,price:t.price}))})
  }
  async function resendRelease(id){
    const s=sales().find(x=>String(x.id)===String(id));const code=releaseCode(s);
    if(!code){toastMsg('Mark the sale Paid first.');return}
    markActionSeen('resend');
    const text=`GET TOGETHER 2027 Buyer Ticket Release Code\n\n${code}`;
    try{if(navigator.share)await navigator.share({title:'GET TOGETHER 2027 Ticket Release',text});else{await navigator.clipboard.writeText(code);toastMsg('Ticket Release Code copied for resend.')}}catch(e){try{await navigator.clipboard.writeText(code);toastMsg('Ticket Release Code copied for resend.')}catch(x){prompt('Copy Ticket Release Code:',code)}}
    markSeen('recent');
  }
  function voidSale(id){
    const s=sales().find(x=>String(x.id)===String(id));if(!s)return;
    if(!confirm(`Void the sale for ${s.buyerName||'this buyer'} and all linked tickets?`))return;
    markActionSeen('voidsale');
    s.voided=true;ticketsFor(s.id).forEach(t=>{t.voided=true});
    try{localStorage.setItem('fundraising_eraffle_v1',JSON.stringify(db));if(typeof renderAll==='function')renderAll()}catch(e){}
    lastSignature='';render();toastMsg('Sale and linked tickets voided.');markSeen('recent');
  }
  function setPaid(id){
    try{
      const sale=sales().find(x=>String(x.id)===String(id));if(!sale||sale.voided)return;
      if(typeof setSaleStatus==='function')setSaleStatus(id,'paid');else{sale.status='paid';ticketsFor(sale.id).filter(t=>!t.voided).forEach(t=>t.status='paid');localStorage.setItem('fundraising_eraffle_v1',JSON.stringify(db));try{if(typeof renderAll==='function')renderAll()}catch(e){}}
      markSeen('pending');lastSignature='';render();toastMsg('Payment marked Paid.');
    }catch(e){alert('Unable to mark this payment Paid.')}
  }

  function row(s,mode){
    const status=s.voided?'void':((s.status||'pending').toLowerCase()==='paid'?'paid':'pending');
    const date=fmtDate(s.createdAt||s.date),ts=ticketsFor(s.id).length;
    let actions='';
    if(!s.voided){
      if(mode==='pending'&&status==='pending')actions+=`<button type="button" class="btn primary" data-mark-paid="${esc(s.id)}">Mark Paid</button>`;
      if(status==='paid')actions+=`<button type="button" class="btn gold" data-resend-release="${esc(s.id)}">Resend Release Code</button>`;
      actions+=`<button type="button" class="btn danger" data-void-sale="${esc(s.id)}">Void Sale</button>`;
    }
    return `<div class="sale-row"><div class="sale-top"><div><div class="sale-name">${esc(s.buyerName||'Unnamed buyer')}</div><div class="sale-meta">${esc(s.contact||s.email||'No contact')} • ${Number(s.qty||ts||0)} ticket${Number(s.qty||ts||0)!==1?'s':''}${date?' • '+esc(date):''}</div></div><div class="sale-amount">${peso(s.total)}<div><span class="status-pill status-${status}">${status.toUpperCase()}</span></div></div></div>${actions?`<div class="sale-actions">${actions}</div>`:''}</div>`;
  }

  function renderToday(){
    const todaySales=sortedSales().filter(s=>!s.voided&&isToday(s.createdAt||s.date));
    const todayTickets=tickets().filter(t=>!t.voided&&isToday(t.createdAt));
    const paidAmount=todaySales.filter(s=>s.status==='paid').reduce((a,s)=>a+Number(s.total||0),0);
    const pendingAmount=todaySales.filter(s=>s.status==='pending').reduce((a,s)=>a+Number(s.total||0),0);
    const issued=todayTickets.filter(t=>t.status==='paid').length;
    const a=document.getElementById('todaySales'),b=document.getElementById('todayPaid'),c=document.getElementById('todayPending'),d=document.getElementById('todayTickets');
    if(a)a.textContent=todaySales.length;if(b)b.textContent=peso(paidAmount);if(c)c.textContent=peso(pendingAmount);if(d)d.textContent=issued;
  }

  function bindActions(){
    document.querySelectorAll('#sellerSalesOverview [data-mark-paid]').forEach(b=>b.onclick=e=>{e.stopPropagation();setPaid(b.dataset.markPaid)});
    document.querySelectorAll('#sellerSalesOverview [data-resend-release]').forEach(b=>b.onclick=e=>{e.stopPropagation();resendRelease(b.dataset.resendRelease)});
    document.querySelectorAll('#sellerSalesOverview [data-void-sale]').forEach(b=>b.onclick=e=>{e.stopPropagation();voidSale(b.dataset.voidSale)});
  }

  function render(){
    style();if(!ensureShell())return;renderToday();
    const all=sortedSales();const pending=all.filter(s=>!s.voided&&(s.status||'pending').toLowerCase()==='pending');
    const signature=JSON.stringify(all.map(s=>[s.id,s.status,s.voided,s.total,s.qty,s.createdAt]).slice(0,12));
    if(signature!==lastSignature){
      lastSignature=signature;
      const recentBox=document.getElementById('sellerRecentSalesList'),pendingBox=document.getElementById('sellerPendingPaymentsList');
      if(recentBox)recentBox.innerHTML=all.length?all.slice(0,6).map(s=>row(s,'recent')).join(''):'<div class="overview-empty">No sales yet.</div>';
      if(pendingBox)pendingBox.innerHTML=pending.length?pending.slice(0,6).map(s=>row(s,'pending')).join(''):'<div class="overview-empty">No pending payments.</div>';
      bindActions();
    }
    applyHighlights();applyActionHighlights();
  }
  function init(){render();setTimeout(render,350);setTimeout(render,900);setInterval(render,1800);const ticketRoot=document.getElementById('tickets')||document.body;new MutationObserver(()=>applyActionHighlights()).observe(ticketRoot,{childList:true,subtree:true});document.addEventListener('visibilitychange',()=>{if(!document.hidden){lastSignature='';render()}})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();