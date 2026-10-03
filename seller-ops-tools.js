(function(){
  const LOG_KEY='gt27_seller_activity_v1';
  const STYLE_ID='sellerOpsToolsStyleV1';
  let lastSnapshot='';

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function peso(n){return '₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2})}
  function sales(){try{return (typeof db!=='undefined'&&Array.isArray(db.sales))?db.sales:[]}catch(e){return[]}}
  function tickets(){try{return (typeof db!=='undefined'&&Array.isArray(db.tickets))?db.tickets:[]}catch(e){return[]}}
  function today(v){if(!v)return false;const d=new Date(v),n=new Date();return d.getFullYear()===n.getFullYear()&&d.getMonth()===n.getMonth()&&d.getDate()===n.getDate()}
  function logs(){try{return JSON.parse(localStorage.getItem(LOG_KEY)||'[]')||[]}catch(e){return[]}}
  function saveLogs(a){try{localStorage.setItem(LOG_KEY,JSON.stringify(a.slice(0,200)))}catch(e){}}
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}
  function log(action,detail){
    const a=logs();
    const now=Date.now();
    const sig=action+'|'+detail;
    if(a[0]&&a[0].sig===sig&&now-(a[0].ts||0)<2500)return;
    a.unshift({id:'L'+now+Math.random().toString(36).slice(2,7),ts:now,action,detail,actor:'Seller',sig});
    saveLogs(a);renderActivity();
  }

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .seller-pending-count{display:inline-flex!important;min-width:24px!important;height:24px!important;padding:0 7px!important;margin-left:8px!important;align-items:center!important;justify-content:center!important;border-radius:999px!important;background:#ee3a16!important;color:#fff!important;font-size:11px!important;font-weight:950!important;line-height:1!important;box-shadow:0 4px 10px rgba(238,58,22,.25)!important}
      #sellerEodReport,#sellerActivityLog{position:relative!important;margin:14px 0!important;border:4px solid #d7a91f!important;background:linear-gradient(135deg,#fffdf1,#fff7c9)!important;box-shadow:0 0 0 6px rgba(215,169,31,.16),0 12px 28px rgba(112,82,0,.14)!important}
      #sellerEodReport:before,#sellerActivityLog:before{content:'NEW';position:absolute;top:10px;right:10px;background:#ee3a16;color:#fff;border-radius:999px;padding:6px 9px;font-size:9px;font-weight:950;letter-spacing:.07em;z-index:2}
      #sellerEodReport h3,#sellerActivityLog h3{margin:0 0 5px!important;color:#246b2d!important}
      .seller-eod-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;margin-top:12px}
      .seller-eod-stat{background:#fff;border:1px solid #e5eadf;border-radius:14px;padding:12px}
      .seller-eod-stat b{display:block;color:#246b2d;font-size:20px;line-height:1.05}.seller-eod-stat span{display:block;color:#6b7567;font-size:11px;margin-top:5px}
      .seller-ops-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}
      .seller-activity-row{display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid #e9eee5}.seller-activity-row:last-child{border-bottom:0}.seller-activity-action{font-weight:900;color:#263524}.seller-activity-detail{font-size:12px;color:#6b7567;margin-top:2px}.seller-activity-time{font-size:11px;color:#7c856f;white-space:nowrap;text-align:right}
      @media(max-width:760px){.seller-eod-grid{grid-template-columns:1fr 1fr}.seller-activity-row{flex-direction:column;gap:4px}.seller-activity-time{text-align:left}}
    `;document.head.appendChild(s);
  }

  function pendingCount(){return sales().filter(s=>!s.voided&&String(s.status||'pending').toLowerCase()==='pending').length}
  function updatePendingBadge(){
    const nav=document.querySelector('#nav button[data-view="dashboard"]');if(!nav)return;
    let b=nav.querySelector('.seller-pending-count');if(!b){b=document.createElement('span');b.className='seller-pending-count';nav.appendChild(b)}
    const n=pendingCount();b.textContent=String(n);b.title=n+' pending payment'+(n===1?'':'s');b.style.display=n?'inline-flex':'none';
  }

  function ensureReportCards(){
    const reports=document.getElementById('reports');if(!reports)return;
    if(!document.getElementById('sellerEodReport')){
      const c=document.createElement('div');c.id='sellerEodReport';c.className='card';
      c.innerHTML=`<h3>End-of-Day Report</h3><p class="note">Today’s seller totals at a glance.</p><div class="seller-eod-grid"><div class="seller-eod-stat"><b id="eodRevenue">₱0</b><span>Paid Revenue</span></div><div class="seller-eod-stat"><b id="eodPaidSales">0</b><span>Paid Sales</span></div><div class="seller-eod-stat"><b id="eodPendingSales">0</b><span>Pending Sales</span></div><div class="seller-eod-stat"><b id="eodTickets">0</b><span>Tickets Issued</span></div><div class="seller-eod-stat"><b id="eodVoids">0</b><span>Voids Today</span></div></div><div class="seller-ops-actions"><button type="button" class="btn primary" id="shareEodReport">Share Report</button><button type="button" class="btn secondary" id="printEodReport">Print / Save PDF</button></div>`;
      const title=reports.querySelector('.section-title');title?.insertAdjacentElement('afterend',c);if(!title)reports.insertBefore(c,reports.firstChild);
      c.querySelector('#shareEodReport').onclick=shareEod;c.querySelector('#printEodReport').onclick=printEod;
    }
    if(!document.getElementById('sellerActivityLog')){
      const c=document.createElement('div');c.id='sellerActivityLog';c.className='card';
      c.innerHTML=`<h3>Seller Activity Log</h3><p class="note">Recent seller actions saved on this device.</p><div id="sellerActivityList"></div><div class="seller-ops-actions"><button type="button" class="btn secondary" id="clearSellerActivity">Clear Log</button></div>`;
      const eod=document.getElementById('sellerEodReport');eod?.insertAdjacentElement('afterend',c);if(!eod)reports.appendChild(c);
      c.querySelector('#clearSellerActivity').onclick=()=>{if(confirm('Clear the seller activity log on this device?')){saveLogs([]);renderActivity();toastMsg('Activity log cleared.')}};
    }
  }

  function eodData(){
    const ss=sales().filter(s=>!s.voided&&today(s.createdAt||s.date));
    const paid=ss.filter(s=>String(s.status).toLowerCase()==='paid');
    const pending=ss.filter(s=>String(s.status||'pending').toLowerCase()==='pending');
    const ts=tickets().filter(t=>!t.voided&&today(t.createdAt));
    const voids=tickets().filter(t=>t.voided&&today(t.createdAt));
    return {revenue:paid.reduce((a,s)=>a+Number(s.total||0),0),paidSales:paid.length,pendingSales:pending.length,tickets:ts.length,voids:voids.length};
  }
  function renderEod(){const d=eodData();const map={eodRevenue:peso(d.revenue),eodPaidSales:d.paidSales,eodPendingSales:d.pendingSales,eodTickets:d.tickets,eodVoids:d.voids};Object.entries(map).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v})}
  function eodText(){const d=eodData();return `GET TOGETHER 2027 — END-OF-DAY REPORT\n${new Date().toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})}\n\nPaid Revenue: ${peso(d.revenue)}\nPaid Sales: ${d.paidSales}\nPending Sales: ${d.pendingSales}\nTickets Issued: ${d.tickets}\nVoids Today: ${d.voids}`}
  async function shareEod(){const text=eodText();log('End-of-Day Report','Shared report');try{if(navigator.share)await navigator.share({title:'GET TOGETHER 2027 End-of-Day Report',text});else{await navigator.clipboard.writeText(text);toastMsg('End-of-Day Report copied.')}}catch(e){try{await navigator.clipboard.writeText(text);toastMsg('End-of-Day Report copied.')}catch(x){}}}
  function printEod(){log('End-of-Day Report','Printed / saved report');const d=eodData();const w=window.open('','_blank');if(!w){toastMsg('Allow pop-ups to print the report.');return}w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>End-of-Day Report</title><style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#24311f}h1{font-family:Georgia,serif;color:#246b2d}.org{color:#ee3a16;font-weight:700}.kv{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #ddd}.line{border-top:3px solid #d7a91f;margin:18px 0}</style></head><body><h1>GET TOGETHER 2027</h1><div class="org">Parkinson's Disease Warriors Philippines</div><h2>End-of-Day Report</h2><div>${esc(new Date().toLocaleString('en-PH'))}</div><div class="line"></div><div class="kv"><span>Paid Revenue</span><b>${peso(d.revenue)}</b></div><div class="kv"><span>Paid Sales</span><b>${d.paidSales}</b></div><div class="kv"><span>Pending Sales</span><b>${d.pendingSales}</b></div><div class="kv"><span>Tickets Issued</span><b>${d.tickets}</b></div><div class="kv"><span>Voids Today</span><b>${d.voids}</b></div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close()}

  function renderActivity(){const box=document.getElementById('sellerActivityList');if(!box)return;const a=logs().slice(0,30);box.innerHTML=a.length?a.map(x=>`<div class="seller-activity-row"><div><div class="seller-activity-action">${esc(x.action)}</div><div class="seller-activity-detail">${esc(x.detail||'')}</div></div><div class="seller-activity-time">${esc(new Date(x.ts).toLocaleString('en-PH',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}))}</div></div>`).join(''):'<div class="note" style="padding:12px 0">No seller activity recorded yet.</div>'}

  function saleById(id){return sales().find(s=>String(s.id)===String(id))}
  function ticketById(id){return tickets().find(t=>String(t.id)===String(id))}
  function idFromInline(text,name){const m=String(text||'').match(new RegExp(name+"\\(['\"]([^'\"]+)['\"]\\)"));return m?m[1]:''}
  function bindActivityCapture(){
    if(document.documentElement.dataset.sellerOpsCapture)return;document.documentElement.dataset.sellerOpsCapture='1';
    document.addEventListener('click',e=>{
      const b=e.target.closest('button');if(!b)return;
      if(b.dataset.markPaid){const id=b.dataset.markPaid;setTimeout(()=>{const s=saleById(id);if(s&&s.status==='paid')log('Marked Paid',`${s.buyerName||'Buyer'} • ${peso(s.total)}`)},180)}
      else if(b.dataset.voidSale){const id=b.dataset.voidSale;setTimeout(()=>{const s=saleById(id);if(s&&s.voided)log('Voided Sale',`${s.buyerName||'Buyer'} • ${peso(s.total)}`)},220)}
      else if(b.dataset.resendRelease){const s=saleById(b.dataset.resendRelease);if(s)log('Release Code',`Shared/copy for ${s.buyerName||'Buyer'}`)}
      else if(b.dataset.sellerReceipt){const s=saleById(b.dataset.sellerReceipt);if(s)log('Seller Receipt',`Opened receipt for ${s.buyerName||'Buyer'}`)}
      else if(b.dataset.viewBuyerTickets){const s=saleById(b.dataset.viewBuyerTickets);if(s)log('Viewed Buyer Tickets',s.buyerName||'Buyer')}
      const oc=b.getAttribute('onclick')||'';
      let id=idFromInline(oc,'voidTicket');if(id)setTimeout(()=>{const t=ticketById(id);if(t&&t.voided)log('Voided Ticket',`${t.number||id} • ${t.buyerName||''}`)},220);
      id=idFromInline(oc,'restoreTicket');if(id)setTimeout(()=>{const t=ticketById(id);if(t&&!t.voided)log('Restored Ticket',`${t.number||id} • ${t.buyerName||''}`)},220);
      id=idFromInline(oc,'shareTicket');if(id){const t=ticketById(id);if(t)log('Shared Ticket',`${t.number||id} • ${t.buyerName||''}`)}
    },true);
  }

  function snapshot(){return JSON.stringify(sales().map(s=>[s.id,s.status,!!s.voided]).slice(0,60))+'|'+JSON.stringify(tickets().map(t=>[t.id,t.status,!!t.voided]).slice(0,120))}
  function detectNewSales(){
    const snap=snapshot();if(!lastSnapshot){lastSnapshot=snap;return}
    if(snap===lastSnapshot)return;
    const prev=lastSnapshot;lastSnapshot=snap;
    try{
      const a=JSON.parse(prev.split('|')[0]||'[]');const oldIds=new Set(a.map(x=>String(x[0])));
      sales().filter(s=>!oldIds.has(String(s.id))).forEach(s=>log('Sale Created',`${s.buyerName||'Buyer'} • ${s.qty||0} ticket${Number(s.qty||0)===1?'':'s'} • ${peso(s.total)}`));
    }catch(e){}
  }

  function render(){addStyle();ensureReportCards();updatePendingBadge();renderEod();renderActivity();detectNewSales()}
  function init(){bindActivityCapture();render();setTimeout(render,350);setTimeout(render,900);setInterval(render,1800);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();