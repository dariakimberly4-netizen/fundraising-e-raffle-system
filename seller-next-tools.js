(function(){
  const DATA_KEY='fundraising_eraffle_v1';
  const SEEN_KEY='gt27_seller_next_tools_seen_v1';
  const VERSIONS={receipt:'seller-receipt-v1',tickets:'view-buyer-tickets-v1',duplicate:'duplicate-warning-v1'};

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function peso(n){return '₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2})}
  function normalize(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
  function sales(){try{return (typeof db!=='undefined'&&Array.isArray(db.sales))?db.sales:[]}catch(e){return[]}}
  function tickets(){try{return (typeof db!=='undefined'&&Array.isArray(db.tickets))?db.tickets:[]}catch(e){return[]}}
  function ticketSet(id){return tickets().filter(t=>String(t.saleId)===String(id))}
  function getSale(id){return sales().find(s=>String(s.id)===String(id))||null}
  function seen(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')||{}}catch(e){return{}}}
  function markSeen(kind){const x=seen();x[kind]=VERSIONS[kind];try{localStorage.setItem(SEEN_KEY,JSON.stringify(x))}catch(e){};decorate()}
  function isNew(kind){return seen()[kind]!==VERSIONS[kind]}
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}

  function style(){
    if(document.getElementById('sellerNextToolsStyle'))return;
    const s=document.createElement('style');s.id='sellerNextToolsStyle';s.textContent=`
      .seller-next-new{position:relative!important;border:2px solid #d7a91f!important;box-shadow:0 0 0 4px rgba(215,169,31,.16)!important;padding-right:52px!important}
      .seller-next-new:after{content:'NEW';position:absolute;right:7px;top:50%;transform:translateY(-50%);padding:4px 7px;border-radius:999px;background:#ee3a16;color:#fff;font-size:8px;font-weight:950;line-height:1;letter-spacing:.06em}
      #sellerDuplicateNotice{position:relative;margin:0 0 13px;padding:12px 14px;border:1px solid #dce8d8;border-radius:14px;background:#f8fbf5;color:#315234;font-size:12px;line-height:1.45}
      #sellerDuplicateNotice strong{display:block;color:#246b2d;font-size:13px;margin-bottom:2px}
      #sellerDuplicateNotice.seller-next-new{background:linear-gradient(135deg,#fffdf3,#fff5c6)!important;border:2px solid #d7a91f!important;padding-right:60px!important}
      #sellerNextDialog{border:0;padding:0;border-radius:20px;max-width:min(92vw,640px);width:640px;box-shadow:0 24px 70px rgba(20,35,18,.28)}
      #sellerNextDialog::backdrop{background:rgba(18,29,17,.45)}
      #sellerNextDialog .snt-modal{padding:22px;background:#fff;color:#263524}
      #sellerNextDialog .snt-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;border-bottom:1px solid #e6ece2;padding-bottom:12px;margin-bottom:14px}
      #sellerNextDialog h2{margin:0;color:#246b2d;font-family:Georgia,'Times New Roman',serif}
      #sellerNextDialog .snt-close{border:0;background:#f1f5ee;border-radius:999px;width:38px;height:38px;font-size:20px;cursor:pointer}
      #sellerNextDialog .snt-kv{display:flex;justify-content:space-between;gap:15px;padding:9px 0;border-bottom:1px solid #eef2eb;font-size:13px}
      #sellerNextDialog .snt-kv b{text-align:right}
      #sellerNextDialog .snt-ticket{padding:10px 0;border-bottom:1px solid #edf1ea}
      #sellerNextDialog .snt-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#5d6b59}
      #sellerNextDialog .snt-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}
      @media(max-width:620px){#sellerNextDialog .snt-modal{padding:17px}#sellerNextDialog .snt-kv{flex-direction:column;gap:3px}#sellerNextDialog .snt-kv b{text-align:left}}
    `;document.head.appendChild(s);
  }

  function ensureDialog(){
    let d=document.getElementById('sellerNextDialog');
    if(d)return d;
    d=document.createElement('dialog');d.id='sellerNextDialog';
    d.innerHTML='<div class="snt-modal"><div class="snt-head"><div><h2 id="sntTitle">Seller Tool</h2><div class="note" id="sntSub"></div></div><button class="snt-close" type="button" aria-label="Close">×</button></div><div id="sntBody"></div><div class="snt-actions" id="sntActions"></div></div>';
    document.body.appendChild(d);d.querySelector('.snt-close').onclick=()=>d.close();
    d.addEventListener('click',e=>{if(e.target===d)d.close()});
    return d;
  }

  function showBuyerTickets(id){
    const sale=getSale(id);if(!sale)return;
    markSeen('tickets');
    const ts=ticketSet(id);const d=ensureDialog();
    d.querySelector('#sntTitle').textContent='Buyer Tickets';
    d.querySelector('#sntSub').textContent=sale.buyerName||'Buyer';
    d.querySelector('#sntBody').innerHTML=ts.length?ts.map(t=>`<div class="snt-ticket"><b>${esc(t.number)}</b> <span class="badge ${t.voided?'void':esc(t.status||'pending')}">${t.voided?'VOID':esc(String(t.status||'pending').toUpperCase())}</span><div class="snt-code">Verification: ${esc(t.code)}</div></div>`).join(''):'<div class="note">No tickets found for this sale.</div>';
    const a=d.querySelector('#sntActions');a.innerHTML='<button type="button" class="btn primary" id="sntOpenTickets">Open E-Tickets</button><button type="button" class="btn secondary" id="sntCloseTickets">Close</button>';
    a.querySelector('#sntOpenTickets').onclick=()=>{d.close();try{if(typeof showView==='function')showView('tickets');const q=document.getElementById('ticketSearch');if(q){q.value=sale.buyerName||'';if(typeof renderTickets==='function')renderTickets()}}catch(e){}};
    a.querySelector('#sntCloseTickets').onclick=()=>d.close();d.showModal();
  }

  function receiptText(sale){
    const ts=ticketSet(sale.id).filter(t=>!t.voided);
    return `GET TOGETHER 2027\nParkinson's Disease Warriors Philippines\nSELLER RECEIPT\n\nBuyer: ${sale.buyerName||''}\nContact: ${sale.contact||sale.email||''}\nDate: ${new Date(sale.createdAt||Date.now()).toLocaleString('en-PH')}\nPayment: ${(sale.status||'pending').toUpperCase()}\nMethod: ${sale.method||'—'}\nReference: ${sale.ref||'—'}\nTickets: ${sale.qty||ts.length}\nAmount: ${peso(sale.total)}\nTicket Nos: ${ts.map(t=>t.number).join(', ')||'—'}\n\nDraw: January 16, 2027\nSt. Luke’s Medical Center – Quezon City`;
  }
  function receiptHtml(sale){
    const ts=ticketSet(sale.id).filter(t=>!t.voided);
    return `<!doctype html><html><head><meta charset="utf-8"><title>Seller Receipt</title><style>body{font-family:Arial,sans-serif;max-width:640px;margin:40px auto;color:#24311f;padding:0 20px}h1{font-family:Georgia,serif;color:#246b2d;margin-bottom:4px}.org{font-weight:700;color:#ee3a16}.line{border-top:2px solid #d7a91f;margin:18px 0}.kv{display:flex;justify-content:space-between;gap:20px;padding:8px 0;border-bottom:1px solid #eee}.foot{margin-top:24px;font-size:12px;color:#667} @media print{button{display:none}}</style></head><body><h1>GET TOGETHER 2027</h1><div class="org">Parkinson's Disease Warriors Philippines</div><div>Seller Receipt</div><div class="line"></div><div class="kv"><span>Buyer</span><b>${esc(sale.buyerName||'')}</b></div><div class="kv"><span>Contact</span><b>${esc(sale.contact||sale.email||'—')}</b></div><div class="kv"><span>Date</span><b>${esc(new Date(sale.createdAt||Date.now()).toLocaleString('en-PH'))}</b></div><div class="kv"><span>Payment</span><b>${esc(String(sale.status||'pending').toUpperCase())}</b></div><div class="kv"><span>Method</span><b>${esc(sale.method||'—')}</b></div><div class="kv"><span>Reference</span><b>${esc(sale.ref||'—')}</b></div><div class="kv"><span>Tickets</span><b>${esc(sale.qty||ts.length)}</b></div><div class="kv"><span>Total</span><b>${peso(sale.total)}</b></div><div class="kv"><span>Ticket Nos.</span><b>${esc(ts.map(t=>t.number).join(', ')||'—')}</b></div><div class="foot">Draw: January 16, 2027 • St. Luke’s Medical Center – Quezon City</div><script>window.onload=()=>window.print()<\/script></body></html>`;
  }
  async function showReceipt(id){
    const sale=getSale(id);if(!sale)return;
    if((sale.status||'pending')!=='paid'){toastMsg('Seller Receipt is available after payment is marked Paid.');return}
    markSeen('receipt');
    const ts=ticketSet(id).filter(t=>!t.voided),d=ensureDialog();
    d.querySelector('#sntTitle').textContent='Seller Receipt';d.querySelector('#sntSub').textContent='GET TOGETHER 2027';
    d.querySelector('#sntBody').innerHTML=`<div class="snt-kv"><span>Buyer</span><b>${esc(sale.buyerName||'')}</b></div><div class="snt-kv"><span>Contact</span><b>${esc(sale.contact||sale.email||'—')}</b></div><div class="snt-kv"><span>Payment</span><b>${esc(String(sale.status||'pending').toUpperCase())}</b></div><div class="snt-kv"><span>Method</span><b>${esc(sale.method||'—')}</b></div><div class="snt-kv"><span>Reference</span><b>${esc(sale.ref||'—')}</b></div><div class="snt-kv"><span>Tickets</span><b>${esc(sale.qty||ts.length)}</b></div><div class="snt-kv"><span>Total</span><b>${peso(sale.total)}</b></div>`;
    const a=d.querySelector('#sntActions');a.innerHTML='<button type="button" class="btn primary" id="sntPrintReceipt">Print / Save PDF</button><button type="button" class="btn gold" id="sntShareReceipt">Share Receipt</button><button type="button" class="btn secondary" id="sntCloseReceipt">Close</button>';
    a.querySelector('#sntPrintReceipt').onclick=()=>{const w=window.open('','_blank');if(!w){toastMsg('Allow pop-ups to print the receipt.');return}w.document.open();w.document.write(receiptHtml(sale));w.document.close()};
    a.querySelector('#sntShareReceipt').onclick=async()=>{const text=receiptText(sale);try{if(navigator.share)await navigator.share({title:'GET TOGETHER 2027 Seller Receipt',text});else{await navigator.clipboard.writeText(text);toastMsg('Receipt copied.')}}catch(e){try{await navigator.clipboard.writeText(text);toastMsg('Receipt copied.')}catch(x){}}};
    a.querySelector('#sntCloseReceipt').onclick=()=>d.close();d.showModal();
  }

  function saleIdFromRow(row){const b=row.querySelector('[data-void-sale],[data-resend-release],[data-mark-paid]');return b?.dataset.voidSale||b?.dataset.resendRelease||b?.dataset.markPaid||''}
  function decorateRows(){
    document.querySelectorAll('#sellerSalesOverview .sale-row').forEach(row=>{
      const id=saleIdFromRow(row);if(!id)return;const sale=getSale(id);if(!sale)return;
      let actions=row.querySelector('.sale-actions');if(!actions){actions=document.createElement('div');actions.className='sale-actions';row.appendChild(actions)}
      if(!actions.querySelector('[data-view-buyer-tickets]')){const b=document.createElement('button');b.type='button';b.className='btn secondary';b.dataset.viewBuyerTickets=id;b.textContent='View Buyer Tickets';b.onclick=e=>{e.stopPropagation();showBuyerTickets(id)};actions.insertBefore(b,actions.firstChild)}
      if((sale.status||'pending')==='paid'&&!sale.voided&&!actions.querySelector('[data-seller-receipt]')){const b=document.createElement('button');b.type='button';b.className='btn gold';b.dataset.sellerReceipt=id;b.textContent='Seller Receipt';b.onclick=e=>{e.stopPropagation();showReceipt(id)};actions.appendChild(b)}
    });
    document.querySelectorAll('[data-view-buyer-tickets]').forEach(b=>b.classList.toggle('seller-next-new',isNew('tickets')));
    document.querySelectorAll('[data-seller-receipt]').forEach(b=>b.classList.toggle('seller-next-new',isNew('receipt')));
  }

  function duplicateMatches(){
    const name=normalize(document.getElementById('buyerName')?.value),contact=normalize(document.getElementById('buyerContact')?.value),email=normalize(document.getElementById('buyerEmail')?.value),ref=normalize(document.getElementById('paymentRef')?.value);
    return sales().filter(s=>!s.voided).filter(s=>{
      if(ref&&normalize(s.ref)===ref)return true;
      const sameName=name&&normalize(s.buyerName)===name;
      if(sameName&&contact&&normalize(s.contact)===contact)return true;
      if(sameName&&email&&normalize(s.email)===email)return true;
      return false;
    });
  }
  function setupDuplicateWarning(){
    const form=document.getElementById('saleForm');if(!form||form.dataset.duplicateWarningBound)return;form.dataset.duplicateWarningBound='1';
    let note=document.getElementById('sellerDuplicateNotice');if(!note){note=document.createElement('div');note.id='sellerDuplicateNotice';note.innerHTML='<strong>Duplicate Payment Protection</strong>Checks the payment reference and buyer details before a sale is created.';form.insertBefore(note,form.firstChild)}
    note.classList.toggle('seller-next-new',isNew('duplicate'));
    form.addEventListener('submit',e=>{
      const matches=duplicateMatches();if(!matches.length){markSeen('duplicate');return}
      markSeen('duplicate');
      const s=matches[0],parts=[];if(normalize(document.getElementById('paymentRef')?.value)&&normalize(s.ref)===normalize(document.getElementById('paymentRef')?.value))parts.push('same payment reference');else parts.push('same buyer details');
      const ok=confirm(`Possible duplicate sale detected (${parts.join(', ')}).\n\nExisting buyer: ${s.buyerName||'Unknown'}\nExisting amount: ${peso(s.total)}\nExisting status: ${(s.status||'pending').toUpperCase()}\n\nCreate this sale anyway?`);
      if(!ok){e.preventDefault();e.stopImmediatePropagation();toastMsg('Sale not created. Duplicate warning cancelled it.')}
    },true);
  }

  function decorate(){style();setupDuplicateWarning();decorateRows()}
  function init(){decorate();setTimeout(decorate,300);setTimeout(decorate,900);new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});setInterval(decorate,1800)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();