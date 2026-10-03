(function(){
  const DATA_KEY='fundraising_eraffle_v1';
  const NEXT_KEY='gt27_next_control_v1';
  const PREFIX='GT27-CN-';
  let activeReceiptSaleId='';

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function peso(n){return '₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2})}
  function sales(){try{return (typeof db!=='undefined'&&Array.isArray(db.sales))?db.sales:[]}catch(e){return[]}}
  function tickets(){try{return (typeof db!=='undefined'&&Array.isArray(db.tickets))?db.tickets:[]}catch(e){return[]}}
  function saleById(id){return sales().find(s=>String(s.id)===String(id))||null}
  function controlNum(n){return PREFIX+String(n).padStart(6,'0')}
  function parseNum(v){const m=String(v||'').match(/^GT27-CN-(\d{1,9})$/i);return m?Number(m[1]):0}
  function saveDb(){try{localStorage.setItem(DATA_KEY,JSON.stringify(db))}catch(e){}}
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}

  function ensureControlNumbers(){
    const ss=sales();if(!ss.length)return false;
    let max=0,changed=false;
    ss.forEach(s=>{max=Math.max(max,parseNum(s.controlNo))});
    let next=Math.max(max+1,Number(localStorage.getItem(NEXT_KEY)||1));
    const missing=ss.filter(s=>!parseNum(s.controlNo)).slice().sort((a,b)=>{
      const ad=new Date(a.createdAt||a.date||0).getTime()||0;
      const bd=new Date(b.createdAt||b.date||0).getTime()||0;
      return ad-bd;
    });
    missing.forEach(s=>{s.controlNo=controlNum(next++);changed=true});
    localStorage.setItem(NEXT_KEY,String(next));
    if(changed)saveDb();
    return changed;
  }

  function style(){
    if(document.getElementById('sellerControlNumberStyle'))return;
    const s=document.createElement('style');s.id='sellerControlNumberStyle';s.textContent=`
      .seller-control-chip{display:inline-flex;align-items:center;margin-top:5px;padding:4px 8px;border-radius:999px;background:#eef7ea;border:1px solid #cfe2c9;color:#246b2d;font-size:10px;font-weight:950;letter-spacing:.03em}
      #sellerControlLookup{margin:14px 0!important;border:3px solid #d7a91f!important;background:linear-gradient(135deg,#fffef8,#fff9d9)!important;box-shadow:0 0 0 4px rgba(215,169,31,.12)!important;position:relative!important}
      #sellerControlLookup:before{content:'NEW';position:absolute;right:10px;top:10px;padding:6px 9px;border-radius:999px;background:#ee3a16;color:#fff;font-size:9px;font-weight:950;letter-spacing:.07em}
      #sellerControlLookup h3{margin:0 0 5px;color:#246b2d}.control-search-row{display:flex;gap:8px;margin-top:12px}.control-search-row input{flex:1}.control-result{margin-top:12px;padding:12px;border:1px solid #e5eadf;border-radius:14px;background:#fff}.control-result .kv{font-size:13px}
      @media(max-width:620px){.control-search-row{flex-direction:column}}
    `;document.head.appendChild(s);
  }

  function idFromRow(row){const b=row.querySelector('[data-void-sale],[data-resend-release],[data-mark-paid],[data-view-buyer-tickets],[data-seller-receipt],[data-sale-note],[data-restore-sale]');if(!b)return '';return b.dataset.voidSale||b.dataset.resendRelease||b.dataset.markPaid||b.dataset.viewBuyerTickets||b.dataset.sellerReceipt||b.dataset.saleNote||b.dataset.restoreSale||''}

  function decorateOverview(){
    document.querySelectorAll('#sellerSalesOverview .sale-row').forEach(row=>{
      const s=saleById(idFromRow(row));if(!s||!s.controlNo)return;
      const meta=row.querySelector('.sale-meta');if(meta&&!meta.querySelector('.seller-control-chip'))meta.insertAdjacentHTML('beforeend',`<br><span class="seller-control-chip">${esc(s.controlNo)}</span>`);
    });
    const rows=document.querySelectorAll('#recentSales .kv');
    sales().slice(0,rows.length).forEach((s,i)=>{
      const holder=rows[i]?.querySelector('div:first-child');if(holder&&s.controlNo&&!holder.querySelector('.seller-control-chip'))holder.insertAdjacentHTML('beforeend',`<br><span class="seller-control-chip">${esc(s.controlNo)}</span>`);
    });
  }

  function decorateReportsTable(){
    const table=document.getElementById('salesTable')?.closest('table');if(!table)return;
    const hr=table.querySelector('thead tr');if(hr&&!hr.querySelector('[data-control-head]')){
      const th=document.createElement('th');th.dataset.controlHead='1';th.textContent='Control No.';
      hr.insertBefore(th,hr.children[1]||null);
    }
    const rows=[...table.querySelectorAll('tbody tr')];
    rows.forEach((tr,i)=>{
      if(tr.querySelector('[data-control-cell]'))return;
      const s=sales()[i];if(!s)return;
      const td=document.createElement('td');td.dataset.controlCell='1';td.innerHTML=`<b style="color:#246b2d">${esc(s.controlNo||'—')}</b>`;
      tr.insertBefore(td,tr.children[1]||null);
    });
  }

  function ensureLookup(){
    const reports=document.getElementById('reports');if(!reports)return;
    let c=document.getElementById('sellerControlLookup');
    if(!c){
      c=document.createElement('div');c.id='sellerControlLookup';c.className='card';
      c.innerHTML=`<h3>Control Number Lookup</h3><p class="note">Every transaction has one unique control number, separate from the raffle ticket number.</p><div class="control-search-row"><input id="controlSearchInput" placeholder="Example: GT27-CN-000001"><button type="button" class="btn primary" id="controlSearchBtn">Search</button></div><div id="controlSearchResult"></div><div class="actions" style="margin-top:12px"><button type="button" class="btn secondary" id="exportControlRegister">Export Control Register CSV</button></div>`;
      const title=reports.querySelector('.section-title');title?.insertAdjacentElement('afterend',c);if(!title)reports.insertBefore(c,reports.firstChild);
      c.querySelector('#controlSearchBtn').onclick=runLookup;
      c.querySelector('#controlSearchInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runLookup()}});
      c.querySelector('#exportControlRegister').onclick=exportRegister;
    }
  }

  function runLookup(){
    const q=String(document.getElementById('controlSearchInput')?.value||'').trim().toLowerCase();const box=document.getElementById('controlSearchResult');if(!box)return;
    if(!q){box.innerHTML='<div class="note" style="padding:10px 0">Enter a control number.</div>';return}
    const s=sales().find(x=>String(x.controlNo||'').toLowerCase()===q);
    if(!s){box.innerHTML='<div class="control-result"><b style="color:#a33038">NOT FOUND</b><div class="note">No sale matches that control number on this device.</div></div>';return}
    const ts=tickets().filter(t=>String(t.saleId)===String(s.id));
    box.innerHTML=`<div class="control-result"><div class="kv"><span>Control No.</span><b style="color:#246b2d">${esc(s.controlNo)}</b></div><div class="kv"><span>Buyer</span><b>${esc(s.buyerName||'')}</b></div><div class="kv"><span>Tickets</span><b>${Number(s.qty||ts.length||0)}</b></div><div class="kv"><span>Amount</span><b>${peso(s.total)}</b></div><div class="kv"><span>Status</span><b>${s.voided?'VOID':esc(String(s.status||'pending').toUpperCase())}</b></div><div class="kv"><span>Payment Ref.</span><b>${esc(s.ref||'—')}</b></div></div>`;
  }

  function exportRegister(){
    const rows=[['Control No','Date','Buyer','Contact','Qty','Amount','Status','Payment Method','Payment Reference','Sale ID']];
    sales().forEach(s=>rows.push([s.controlNo||'',s.createdAt||s.date||'',s.buyerName||'',s.contact||s.email||'',s.qty||'',s.total||0,s.voided?'void':s.status||'pending',s.method||'',s.ref||'',s.id||'']));
    const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const b=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gt27-control-register.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),600);toastMsg('Control Register exported.');
  }

  function decorateReceiptModal(id){
    const s=saleById(id),body=document.querySelector('#sellerNextDialog #sntBody');if(!s||!body||body.querySelector('[data-control-receipt]'))return;
    const row=document.createElement('div');row.className='snt-kv';row.dataset.controlReceipt='1';row.innerHTML=`<span>Control No.</span><b style="color:#246b2d">${esc(s.controlNo||'—')}</b>`;body.insertBefore(row,body.firstChild);
  }

  function receiptText(s){
    const ts=tickets().filter(t=>String(t.saleId)===String(s.id)&&!t.voided);
    return `GET TOGETHER 2027\nParkinson's Disease Warriors Philippines\nSELLER RECEIPT\n\nControl No.: ${s.controlNo||'—'}\nBuyer: ${s.buyerName||''}\nContact: ${s.contact||s.email||''}\nDate: ${new Date(s.createdAt||Date.now()).toLocaleString('en-PH')}\nPayment: ${(s.status||'pending').toUpperCase()}\nMethod: ${s.method||'—'}\nReference: ${s.ref||'—'}\nTickets: ${s.qty||ts.length}\nAmount: ${peso(s.total)}\nTicket Nos: ${ts.map(t=>t.number).join(', ')||'—'}\n\nDraw: January 16, 2027\nSt. Luke’s Medical Center – Quezon City`;
  }

  function printReceipt(s){
    const ts=tickets().filter(t=>String(t.saleId)===String(s.id)&&!t.voided),w=window.open('','_blank');if(!w){toastMsg('Allow pop-ups to print the receipt.');return}
    w.document.open();w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Seller Receipt ${esc(s.controlNo||'')}</title><style>body{font-family:Arial,sans-serif;max-width:640px;margin:40px auto;color:#24311f;padding:0 20px}h1{font-family:Georgia,serif;color:#246b2d;margin-bottom:4px}.org{font-weight:700;color:#ee3a16}.line{border-top:2px solid #d7a91f;margin:18px 0}.kv{display:flex;justify-content:space-between;gap:20px;padding:8px 0;border-bottom:1px solid #eee}.foot{margin-top:24px;font-size:12px;color:#667}</style></head><body><h1>GET TOGETHER 2027</h1><div class="org">Parkinson's Disease Warriors Philippines</div><div>Seller Receipt</div><div class="line"></div><div class="kv"><span>Control No.</span><b>${esc(s.controlNo||'—')}</b></div><div class="kv"><span>Buyer</span><b>${esc(s.buyerName||'')}</b></div><div class="kv"><span>Contact</span><b>${esc(s.contact||s.email||'—')}</b></div><div class="kv"><span>Date</span><b>${esc(new Date(s.createdAt||Date.now()).toLocaleString('en-PH'))}</b></div><div class="kv"><span>Payment</span><b>${esc(String(s.status||'pending').toUpperCase())}</b></div><div class="kv"><span>Method</span><b>${esc(s.method||'—')}</b></div><div class="kv"><span>Reference</span><b>${esc(s.ref||'—')}</b></div><div class="kv"><span>Tickets</span><b>${esc(s.qty||ts.length)}</b></div><div class="kv"><span>Total</span><b>${peso(s.total)}</b></div><div class="kv"><span>Ticket Nos.</span><b>${esc(ts.map(t=>t.number).join(', ')||'—')}</b></div><div class="foot">Draw: January 16, 2027 • St. Luke’s Medical Center – Quezon City</div><script>window.onload=()=>window.print()<\/script></body></html>`);w.document.close();
  }

  async function shareReceipt(s){const text=receiptText(s);try{if(navigator.share)await navigator.share({title:`GET TOGETHER 2027 Receipt ${s.controlNo||''}`,text});else{await navigator.clipboard.writeText(text);toastMsg('Receipt copied.')}}catch(e){try{await navigator.clipboard.writeText(text);toastMsg('Receipt copied.')}catch(x){}}}

  function bind(){
    if(document.documentElement.dataset.controlNumberBound)return;document.documentElement.dataset.controlNumberBound='1';
    document.addEventListener('submit',e=>{if(e.target?.id==='saleForm')setTimeout(()=>{ensureControlNumbers();decorate()},80)},false);
    document.addEventListener('click',e=>{
      const receipt=e.target.closest('[data-seller-receipt]');if(receipt){activeReceiptSaleId=receipt.dataset.sellerReceipt;setTimeout(()=>decorateReceiptModal(activeReceiptSaleId),60);setTimeout(()=>decorateReceiptModal(activeReceiptSaleId),250)}
      if(e.target.closest('#sntPrintReceipt')&&activeReceiptSaleId){const s=saleById(activeReceiptSaleId);if(s){e.preventDefault();e.stopImmediatePropagation();printReceipt(s)}}
      if(e.target.closest('#sntShareReceipt')&&activeReceiptSaleId){const s=saleById(activeReceiptSaleId);if(s){e.preventDefault();e.stopImmediatePropagation();shareReceipt(s)}}
    },true);
  }

  function decorate(){style();ensureControlNumbers();ensureLookup();decorateOverview();decorateReportsTable();if(activeReceiptSaleId)decorateReceiptModal(activeReceiptSaleId)}
  function init(){bind();decorate();setTimeout(decorate,300);setTimeout(decorate,900);new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});setInterval(decorate,1800)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();