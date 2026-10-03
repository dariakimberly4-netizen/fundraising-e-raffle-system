(function(){
  const DATA_KEY='fundraising_eraffle_v1';
  const LOG_KEY='gt27_seller_activity_v1';
  const DRAW_LOCK_KEY='gt27_draw_lock_v1';
  const STYLE_ID='sellerFinalToolsStyleV1';
  const originalEligible=typeof window.eligibleTickets==='function'?window.eligibleTickets:null;

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function peso(n){return '₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2})}
  function sales(){try{return (typeof db!=='undefined'&&Array.isArray(db.sales))?db.sales:[]}catch(e){return[]}}
  function tickets(){try{return (typeof db!=='undefined'&&Array.isArray(db.tickets))?db.tickets:[]}catch(e){return[]}}
  function winners(){try{return (typeof db!=='undefined'&&Array.isArray(db.winners))?db.winners:[]}catch(e){return[]}}
  function saveDb(){try{localStorage.setItem(DATA_KEY,JSON.stringify(db));if(typeof renderAll==='function')renderAll()}catch(e){}}
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}
  function log(action,detail){try{const a=JSON.parse(localStorage.getItem(LOG_KEY)||'[]')||[];a.unshift({id:'L'+Date.now()+Math.random().toString(36).slice(2,7),ts:Date.now(),action,detail,actor:'Seller',sig:action+'|'+detail});localStorage.setItem(LOG_KEY,JSON.stringify(a.slice(0,200)))}catch(e){}}
  function dateKey(v){const d=new Date(v);if(Number.isNaN(d.getTime()))return'';return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function download(name,content,type){const b=new Blob([content],{type});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),700)}

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .seller-final-new{position:relative!important;border:4px solid #d7a91f!important;background:linear-gradient(135deg,#fffdf3,#fff3ad)!important;box-shadow:0 0 0 6px rgba(215,169,31,.16),0 12px 28px rgba(112,82,0,.14)!important}
      .seller-final-new:before{content:'NEW';position:absolute;top:10px;right:10px;z-index:3;padding:6px 9px;border-radius:999px;background:#ee3a16;color:#fff;font-size:9px;font-weight:950;letter-spacing:.07em;line-height:1}
      .seller-final-btn{position:relative!important;border:2px solid #d7a91f!important;box-shadow:0 0 0 3px rgba(215,169,31,.14)!important;font-weight:900!important}
      .seller-final-btn:after{content:'NEW';display:inline-flex;margin-left:7px;padding:4px 7px;border-radius:999px;background:#ee3a16;color:#fff;font-size:8px;font-weight:950;line-height:1;vertical-align:middle}
      #sellerQuickBackupCard,#sellerDateRangeReport,#sellerSaleManagement,#sellerDrawLockCard,#sellerWinnerClaims{margin:14px 0!important}
      .sfinal-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:12px}.sfinal-stat{background:#fff;border:1px solid #e2e9de;border-radius:14px;padding:12px}.sfinal-stat b{display:block;color:#246b2d;font-size:20px}.sfinal-stat span{display:block;color:#6b7567;font-size:11px;margin-top:5px}
      .sfinal-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.sfinal-row{padding:11px 0;border-bottom:1px solid #e7ede3}.sfinal-row:last-child{border-bottom:0}.sfinal-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.sfinal-name{font-weight:900;color:#263524}.sfinal-meta{font-size:12px;color:#6b7567;margin-top:3px;line-height:1.45}.sfinal-note{margin-top:6px;padding:8px 10px;border-radius:10px;background:#f6f9f3;color:#4e5e48;font-size:12px}
      .sfinal-filters{display:grid;grid-template-columns:1fr 1fr auto;gap:9px;align-items:end;margin-top:12px}.sfinal-lock{display:inline-flex;padding:6px 9px;border-radius:999px;font-size:11px;font-weight:950}.sfinal-locked{background:#fde7e9;color:#a33038}.sfinal-unlocked{background:#e5f5ed;color:#187650}.sfinal-claimed{background:#e5f5ed;color:#187650}.sfinal-unclaimed{background:#fff1d6;color:#8a6111}
      @media(max-width:760px){.sfinal-grid{grid-template-columns:1fr 1fr}.sfinal-filters{grid-template-columns:1fr}.sfinal-top{flex-direction:column}}
    `;document.head.appendChild(s);
  }

  function ensureQuickBackup(){
    const dash=document.getElementById('dashboard');if(!dash)return;
    if(document.getElementById('sellerQuickBackupCard'))return;
    const c=document.createElement('div');c.id='sellerQuickBackupCard';c.className='card seller-final-new';
    c.innerHTML='<h3 style="margin-top:0">Quick Backup</h3><p class="note">Save a complete copy of this seller device data before or after major raffle activity.</p><div class="sfinal-actions"><button type="button" class="btn primary seller-final-btn" id="sellerQuickBackupBtn">Download Backup</button></div>';
    const target=document.getElementById('sellerTodaySummary')||dash.querySelector('.stats');target?.insertAdjacentElement('afterend',c);if(!target)dash.appendChild(c);
    c.querySelector('#sellerQuickBackupBtn').onclick=()=>{log('Quick Backup','Downloaded full raffle backup');if(typeof exportData==='function')exportData();else download('fundraising-eraffle-backup.json',JSON.stringify(db,null,2),'application/json');toastMsg('Backup created.')};
  }

  function rangeSales(){
    const from=document.getElementById('sellerRangeFrom')?.value||'';const to=document.getElementById('sellerRangeTo')?.value||'';
    return sales().filter(s=>{const k=dateKey(s.createdAt||s.date);return(!from||k>=from)&&(!to||k<=to)});
  }
  function rangeSummary(list){
    const paid=list.filter(s=>!s.voided&&String(s.status).toLowerCase()==='paid'),pending=list.filter(s=>!s.voided&&String(s.status||'pending').toLowerCase()==='pending'),voided=list.filter(s=>s.voided);
    return {revenue:paid.reduce((a,s)=>a+Number(s.total||0),0),sales:list.length,paid:paid.length,pending:pending.length,voided:voided.length,tickets:list.reduce((a,s)=>a+Number(s.qty||0),0)};
  }
  function renderRange(){
    const list=rangeSales();const d=rangeSummary(list);const box=document.getElementById('sellerRangeResults');if(!box)return;
    box.innerHTML=`<div class="sfinal-grid"><div class="sfinal-stat"><b>${peso(d.revenue)}</b><span>Paid Revenue</span></div><div class="sfinal-stat"><b>${d.sales}</b><span>Total Sales</span></div><div class="sfinal-stat"><b>${d.paid}</b><span>Paid Sales</span></div><div class="sfinal-stat"><b>${d.pending}</b><span>Pending Sales</span></div></div><div style="margin-top:10px">${list.length?list.slice(0,50).map(s=>`<div class="sfinal-row"><div class="sfinal-top"><div><div class="sfinal-name">${esc(s.buyerName||'Buyer')}</div><div class="sfinal-meta">${esc(new Date(s.createdAt||s.date).toLocaleString('en-PH'))} • ${Number(s.qty||0)} ticket${Number(s.qty||0)===1?'':'s'} • ${esc(s.method||'')}</div></div><div><b>${peso(s.total)}</b><br><span class="badge ${s.voided?'void':esc(s.status||'pending')}">${s.voided?'VOID':esc(String(s.status||'pending').toUpperCase())}</span></div></div></div>`).join(''):'<div class="note" style="padding:12px 0">No sales in this date range.</div>'}</div>`;
  }
  function exportRange(){
    const list=rangeSales();const rows=[['Date','Buyer','Contact','Status','Qty','Amount','Method','Reference','Notes']];
    list.forEach(s=>rows.push([new Date(s.createdAt||s.date).toLocaleString('en-PH'),s.buyerName,s.contact||s.email||'',s.voided?'void':s.status,s.qty,s.total,s.method,s.ref||'',s.notes||'']));
    const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');download('raffle-date-range-report.csv',csv,'text/csv;charset=utf-8');log('Date-Range Report','Exported '+list.length+' sale(s)');
  }
  function ensureDateRange(){
    const reports=document.getElementById('reports');if(!reports)return;
    if(document.getElementById('sellerDateRangeReport'))return;
    const c=document.createElement('div');c.id='sellerDateRangeReport';c.className='card seller-final-new';
    const today=dateKey(new Date());
    c.innerHTML=`<h3 style="margin-top:0">Date-Range Report</h3><p class="note">Choose a start and end date to review seller transactions.</p><div class="sfinal-filters"><label>From<input type="date" id="sellerRangeFrom" value="${today}"></label><label>To<input type="date" id="sellerRangeTo" value="${today}"></label><button type="button" class="btn primary seller-final-btn" id="sellerRunRange">Generate</button></div><div id="sellerRangeResults"></div><div class="sfinal-actions"><button type="button" class="btn secondary" id="sellerExportRange">Export CSV</button></div>`;
    const anchor=document.getElementById('sellerActivityLog')||document.getElementById('sellerEodReport')||reports.querySelector('.section-title');anchor?.insertAdjacentElement('afterend',c);if(!anchor)reports.appendChild(c);
    c.querySelector('#sellerRunRange').onclick=()=>{renderRange();log('Date-Range Report','Generated custom report')};c.querySelector('#sellerExportRange').onclick=exportRange;renderRange();
  }

  function editSaleNote(id){
    const s=sales().find(x=>String(x.id)===String(id));if(!s)return;
    const next=prompt('Sale note for '+(s.buyerName||'buyer')+':',s.notes||'');if(next===null)return;s.notes=next.trim();saveDb();log('Sale Note',`${s.buyerName||'Buyer'} • ${s.notes?'Updated note':'Cleared note'}`);toastMsg('Sale note saved.');renderSaleManagement();
  }
  function restoreSale(id){
    const s=sales().find(x=>String(x.id)===String(id));if(!s||!s.voided)return;if(!confirm(`Restore the sale for ${s.buyerName||'this buyer'} and all linked tickets?`))return;
    s.voided=false;tickets().filter(t=>String(t.saleId)===String(s.id)).forEach(t=>{t.voided=false;t.status=s.status||'pending'});saveDb();log('Restored Sale',`${s.buyerName||'Buyer'} • ${peso(s.total)}`);toastMsg('Sale and linked tickets restored.');renderSaleManagement();
  }
  function renderSaleManagement(){
    const box=document.getElementById('sellerSaleManagementList');if(!box)return;const list=sales().slice().sort((a,b)=>(new Date(b.createdAt||b.date).getTime()||0)-(new Date(a.createdAt||a.date).getTime()||0)).slice(0,30);
    box.innerHTML=list.length?list.map(s=>`<div class="sfinal-row"><div class="sfinal-top"><div><div class="sfinal-name">${esc(s.buyerName||'Buyer')}</div><div class="sfinal-meta">${esc(new Date(s.createdAt||s.date).toLocaleString('en-PH'))} • ${Number(s.qty||0)} ticket${Number(s.qty||0)===1?'':'s'} • ${peso(s.total)}</div>${s.notes?`<div class="sfinal-note">${esc(s.notes)}</div>`:''}</div><span class="badge ${s.voided?'void':esc(s.status||'pending')}">${s.voided?'VOID':esc(String(s.status||'pending').toUpperCase())}</span></div><div class="sfinal-actions"><button type="button" class="btn secondary" data-sale-note="${esc(s.id)}">Sale Notes</button>${s.voided?`<button type="button" class="btn gold seller-final-btn" data-restore-sale="${esc(s.id)}">Restore Voided Sale</button>`:''}</div></div>`).join(''):'<div class="note">No sales yet.</div>';
    box.querySelectorAll('[data-sale-note]').forEach(b=>b.onclick=()=>editSaleNote(b.dataset.saleNote));box.querySelectorAll('[data-restore-sale]').forEach(b=>b.onclick=()=>restoreSale(b.dataset.restoreSale));
  }
  function ensureSaleManagement(){
    const reports=document.getElementById('reports');if(!reports)return;if(document.getElementById('sellerSaleManagement'))return;
    const c=document.createElement('div');c.id='sellerSaleManagement';c.className='card seller-final-new';c.innerHTML='<h3 style="margin-top:0">Sale Notes & Restore</h3><p class="note">Add or edit notes and recover an accidentally voided sale.</p><div id="sellerSaleManagementList"></div>';
    const anchor=document.getElementById('sellerDateRangeReport')||reports.querySelector('.section-title');anchor?.insertAdjacentElement('afterend',c);if(!anchor)reports.appendChild(c);renderSaleManagement();
  }

  function getLock(){try{return JSON.parse(localStorage.getItem(DRAW_LOCK_KEY)||'null')}catch(e){return null}}
  function setLock(v){try{v?localStorage.setItem(DRAW_LOCK_KEY,JSON.stringify(v)):localStorage.removeItem(DRAW_LOCK_KEY)}catch(e){}}
  function normalEligible(){if(originalEligible){try{return originalEligible()}catch(e){}}const won=new Set(winners().map(w=>String(w.ticketId)));return tickets().filter(t=>t.status==='paid'&&!t.voided&&!won.has(String(t.id)))}
  function lockedEligible(){const lock=getLock();if(!lock)return normalEligible();const ids=new Set((lock.ticketIds||[]).map(String));const won=new Set(winners().map(w=>String(w.ticketId)));return tickets().filter(t=>ids.has(String(t.id))&&!won.has(String(t.id)))}
  window.eligibleTickets=lockedEligible;
  function toggleDrawLock(){
    const lock=getLock();
    if(lock){if(!confirm('Unlock the raffle draw pool? New payment/status changes can affect eligibility again.'))return;setLock(null);log('Draw Lock','Unlocked raffle eligibility');toastMsg('Draw pool unlocked.')}else{const pool=normalEligible();if(!pool.length){toastMsg('There are no eligible paid tickets to lock.');return}if(!confirm(`Lock the raffle draw with ${pool.length} eligible ticket${pool.length===1?'':'s'}?`))return;setLock({lockedAt:new Date().toISOString(),ticketIds:pool.map(t=>t.id),count:pool.length});log('Draw Lock',`Locked ${pool.length} eligible ticket${pool.length===1?'':'s'}`);toastMsg('Draw pool locked.')}
    renderDrawLock();try{const ec=document.getElementById('eligibleCount');if(ec)ec.textContent=`${lockedEligible().length} eligible ticket${lockedEligible().length===1?'':'s'}`}catch(e){}
  }
  function renderDrawLock(){
    const lock=getLock(),card=document.getElementById('sellerDrawLockCard');if(!card)return;
    const status=card.querySelector('#sellerDrawLockStatus'),info=card.querySelector('#sellerDrawLockInfo'),btn=card.querySelector('#sellerDrawLockBtn');
    if(lock){status.textContent='LOCKED';status.className='sfinal-lock sfinal-locked';info.textContent=`Frozen at ${new Date(lock.lockedAt).toLocaleString('en-PH')} • ${lock.count||0} ticket${Number(lock.count||0)===1?'':'s'} in the original pool.`;btn.textContent='Unlock Draw Pool';btn.className='btn danger'}else{status.textContent='UNLOCKED';status.className='sfinal-lock sfinal-unlocked';info.textContent='Eligibility still changes when ticket payment or void status changes.';btn.textContent='Lock Draw Pool';btn.className='btn primary seller-final-btn'}
  }
  function ensureDrawLock(){
    const draw=document.getElementById('draw');if(!draw)return;if(document.getElementById('sellerDrawLockCard'))return;
    const c=document.createElement('div');c.id='sellerDrawLockCard';c.className='card seller-final-new';c.innerHTML='<h3 style="margin-top:0">Draw Lock</h3><p class="note">Freeze the eligible ticket pool before the official draw.</p><div><span id="sellerDrawLockStatus" class="sfinal-lock sfinal-unlocked">UNLOCKED</span></div><p id="sellerDrawLockInfo" class="note"></p><div class="sfinal-actions"><button type="button" id="sellerDrawLockBtn" class="btn primary seller-final-btn">Lock Draw Pool</button></div>';
    const title=draw.querySelector('.section-title');title?.insertAdjacentElement('afterend',c);if(!title)draw.insertBefore(c,draw.firstChild);c.querySelector('#sellerDrawLockBtn').onclick=toggleDrawLock;renderDrawLock();
  }

  function setClaim(id,claimed){
    const w=winners().find(x=>String(x.id)===String(id));if(!w)return;w.claimed=claimed;w.claimedAt=claimed?new Date().toISOString():null;saveDb();log('Winner Claim',`${w.number||''} • ${w.buyerName||'Winner'} • ${claimed?'CLAIMED':'UNCLAIMED'}`);toastMsg(claimed?'Prize marked claimed.':'Prize marked unclaimed.');renderClaims();
  }
  function renderClaims(){
    const box=document.getElementById('sellerWinnerClaimsList');if(!box)return;const list=winners();
    box.innerHTML=list.length?list.map(w=>`<div class="sfinal-row"><div class="sfinal-top"><div><div class="sfinal-name">${esc(w.number||'Ticket')} — ${esc(w.buyerName||'Winner')}</div><div class="sfinal-meta">Drawn ${esc(new Date(w.drawnAt).toLocaleString('en-PH'))}${w.claimed&&w.claimedAt?' • Claimed '+esc(new Date(w.claimedAt).toLocaleString('en-PH')):''}</div></div><span class="sfinal-lock ${w.claimed?'sfinal-claimed':'sfinal-unclaimed'}">${w.claimed?'CLAIMED':'UNCLAIMED'}</span></div><div class="sfinal-actions">${w.claimed?`<button type="button" class="btn secondary" data-unclaim-winner="${esc(w.id)}">Mark Unclaimed</button>`:`<button type="button" class="btn primary seller-final-btn" data-claim-winner="${esc(w.id)}">Mark Claimed</button>`}</div></div>`).join(''):'<div class="note">No winners yet.</div>';
    box.querySelectorAll('[data-claim-winner]').forEach(b=>b.onclick=()=>setClaim(b.dataset.claimWinner,true));box.querySelectorAll('[data-unclaim-winner]').forEach(b=>b.onclick=()=>setClaim(b.dataset.unclaimWinner,false));
  }
  function ensureWinnerClaims(){
    const draw=document.getElementById('draw');if(!draw)return;if(document.getElementById('sellerWinnerClaims'))return;
    const c=document.createElement('div');c.id='sellerWinnerClaims';c.className='card seller-final-new';c.innerHTML='<h3 style="margin-top:0">Winner Claim Tracking</h3><p class="note">Track whether each raffle prize has been claimed.</p><div id="sellerWinnerClaimsList"></div>';
    draw.appendChild(c);renderClaims();
  }

  function render(){addStyle();ensureQuickBackup();ensureDateRange();ensureSaleManagement();ensureDrawLock();ensureWinnerClaims();renderSaleManagement();renderDrawLock();renderClaims()}
  function init(){render();setTimeout(render,350);setTimeout(render,900);setInterval(render,2200);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();