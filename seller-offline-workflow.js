(function(){
  const QUEUE_KEY='gt27_seller_offline_requests_v1';
  const DB_NAME='gt27_seller_proofs_v1';
  const DB_VERSION=1;
  const STORE='proofs';
  const DATA_KEY='fundraising_eraffle_v1';
  const REL_PREFIX='ERTKT1.';
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const peso=n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2});
  const queue=()=>{try{return JSON.parse(localStorage.getItem(QUEUE_KEY)||'[]')||[]}catch(e){return[]}};
  const saveQueue=v=>localStorage.setItem(QUEUE_KEY,JSON.stringify(v));
  const toastMsg=msg=>{try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}};

  function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains(STORE))d.createObjectStore(STORE,{keyPath:'requestId'})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
  async function putProof(requestId,blob,meta){const d=await openDb();await new Promise((resolve,reject)=>{const tx=d.transaction(STORE,'readwrite');tx.objectStore(STORE).put({requestId,blob,name:meta.name||'payment-proof',type:meta.type||blob.type||'application/octet-stream',size:meta.size||blob.size,savedAt:new Date().toISOString()});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});d.close()}
  async function getProof(requestId){const d=await openDb();const out=await new Promise((resolve,reject)=>{const tx=d.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(requestId);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)});d.close();return out}
  function dataURLToBlob(dataURL){const [h,b]=String(dataURL).split(',');const type=(h.match(/data:([^;]+)/)||[])[1]||'application/octet-stream';const bin=atob(b||''),arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return new Blob([arr],{type})}
  function enc(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}

  function addStyle(){
    if($('sellerOfflineWorkflowStyle'))return;
    const s=document.createElement('style');s.id='sellerOfflineWorkflowStyle';s.textContent=`
      #sellerOfflineRequestCard{margin:14px 0!important;border:2px solid #d7a91f!important;background:linear-gradient(135deg,#fffef8,#fff9dd)!important;box-shadow:0 0 0 4px rgba(215,169,31,.10)!important}
      #sellerOfflineRequestCard h3{color:#246b2d;margin:0 0 5px}.sow-import{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:12px 0}.sow-import input{flex:1;min-width:220px}
      .sow-list{display:grid;gap:10px;margin-top:12px}.sow-item{border:1px solid #e1e8dc;border-radius:16px;padding:13px;background:#fff}.sow-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.sow-name{font-weight:950;color:#263524}.sow-meta{font-size:12px;color:#6b7567;line-height:1.5;margin-top:4px}.sow-pill{padding:5px 8px;border-radius:999px;font-size:10px;font-weight:950;white-space:nowrap}.sow-imported{background:#fff1d6;color:#8a6111}.sow-processing{background:#eef1f4;color:#4d5964}.sow-approved{background:#e5f5ed;color:#187650}.sow-rejected{background:#fde7e9;color:#a33038}.sow-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.sow-actions .btn{min-height:42px}.sow-proof{margin-top:8px;padding:9px 10px;border-radius:12px;background:#f7faf5;border:1px solid #e1e8dc;font-size:12px;color:#40523d}.sow-release{margin-top:9px;padding:10px;border-radius:12px;background:#eef7ea;border:1px solid #cde0c7;font-size:11px;color:#246b2d;word-break:break-all}
      @media(max-width:620px){.sow-top{flex-direction:column}.sow-import{flex-direction:column;align-items:stretch}.sow-import input{min-width:0}.sow-actions>*{flex:1 1 145px}}
    `;document.head.appendChild(s);
  }

  function ensureCard(){
    const reports=$('reports');if(!reports||$('sellerOfflineRequestCard'))return;
    const card=document.createElement('div');card.id='sellerOfflineRequestCard';card.className='card';card.innerHTML=`<h3>Offline Buyer Requests & Payment Proofs</h3><p class="note">Import the buyer's offline request package, review the actual proof, then approve to create the paid sale and exact e-tickets automatically on this seller device.</p><div class="sow-import"><input id="sellerRequestPackageFile" type="file" accept=".json,.gt27,.txt,application/json"><button id="sellerRefreshOfflineQueue" class="btn secondary" type="button">Refresh</button></div><div class="sow-list" id="sellerOfflineRequestList"></div>`;
    const title=reports.querySelector('.section-title');title?.insertAdjacentElement('afterend',card);if(!title)reports.insertBefore(card,reports.firstChild);
    $('sellerRequestPackageFile').addEventListener('change',e=>importPackage(e.target.files?.[0]));$('sellerRefreshOfflineQueue').onclick=render;
  }

  async function importPackage(file){
    if(!file)return;try{
      const pkg=JSON.parse(await file.text());if(pkg?.format!=='GT27-BUYER-REQUEST-PACKAGE'||!pkg.order?.requestId)throw new Error('This is not a valid GT27 buyer request package.');
      const o=pkg.order;if(!String(pkg.requestCode||o.code||'').startsWith('ERREQ1.'))throw new Error('The buyer request code is missing or invalid.');
      if(!Number(o.qty)||Number(o.qty)<1)throw new Error('The request has an invalid ticket quantity.');
      if(pkg.proof?.dataUrl){const blob=dataURLToBlob(pkg.proof.dataUrl);await putProof(o.requestId,blob,pkg.proof)}
      const list=queue();let item=list.find(x=>x.requestId===o.requestId);const next={requestId:o.requestId,order:o,profile:pkg.profile||null,requestCode:pkg.requestCode||o.code||'',proofMeta:pkg.proof?{name:pkg.proof.name||'',type:pkg.proof.type||'',size:Number(pkg.proof.size||0)}:null,importedAt:item?.importedAt||new Date().toISOString(),status:item?.status||'imported',reviewedAt:item?.reviewedAt||'',saleId:item?.saleId||'',releaseCode:item?.releaseCode||'',controlNo:item?.controlNo||'',ticketCount:item?.ticketCount||0,rejectionReason:item?.rejectionReason||''};
      if(item)Object.assign(item,next);else list.unshift(next);saveQueue(list.slice(0,200));render();toastMsg(`Buyer request ${o.requestId} imported${pkg.proof?' with payment proof':''}.`);e.target.value='';
    }catch(err){alert(err.message||'Unable to import the buyer request package.')}
  }

  async function viewProof(id){const p=await getProof(id);if(!p?.blob)return alert('No actual payment proof is attached to this request.');const u=URL.createObjectURL(p.blob);window.open(u,'_blank');setTimeout(()=>URL.revokeObjectURL(u),60000)}

  function paidTicketsFor(saleId){try{return (db.tickets||[]).filter(t=>String(t.saleId)===String(saleId)&&!t.voided&&t.status==='paid')}catch(e){return[]}}
  function makeRelease(sale){
    const ts=paidTicketsFor(sale.id),expected=Math.max(1,Number(sale.qty||0));
    if(ts.length!==expected)return{error:`Expected ${expected} paid e-ticket${expected===1?'':'s'}, but found ${ts.length}.`};
    const nums=ts.map(t=>String(t.number||'').trim()),codes=ts.map(t=>String(t.code||'').trim());if(nums.some(x=>!x)||new Set(nums).size!==nums.length||codes.some(x=>!x)||new Set(codes).size!==codes.length)return{error:'Ticket numbers or verification codes are incomplete or duplicated.'};
    const payload={v:3,campaign:'GET TOGETHER 2027',saleId:sale.id,controlNo:sale.controlNo||'',buyerName:sale.buyerName,issuedAt:new Date().toISOString(),drawDate:'2027-01-16',ticketCount:ts.length,tickets:ts.map(t=>({number:t.number,code:t.code,buyerName:t.buyerName,price:t.price}))};return{code:REL_PREFIX+enc(payload),count:ts.length,controlNo:sale.controlNo||''};
  }

  function fill(id,value){const el=$(id);if(el){el.value=value??'';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}}
  async function approve(id){
    const list=queue(),item=list.find(x=>x.requestId===id);if(!item||item.status==='processing')return;if(item.status==='approved'&&item.releaseCode){shareRelease(id);return}
    const o=item.order||{};item.status='processing';item.reviewedAt=new Date().toISOString();saveQueue(list);render();
    try{
      if(typeof showView==='function')showView('sell');
      fill('buyerName',o.buyerName||item.profile?.name||'');fill('buyerContact',o.contact||item.profile?.contact||'');fill('buyerEmail',o.email||item.profile?.email||'');fill('qty',Math.max(1,Number(o.qty||1)));fill('price',Number(o.price||0));fill('paymentStatus','paid');fill('paymentMethod',o.method||'Other');fill('paymentRef',o.ref||'');fill('notes',`${o.notes||''}${o.notes?' • ':''}Offline buyer request ${o.requestId}`);
      await new Promise(r=>setTimeout(r,120));
      if($('sellerPreferredNumbers'))fill('sellerPreferredNumbers',(o.preferredNumbers||[]).join(', '));
      const before=new Set((db.sales||[]).map(s=>String(s.id)));const form=$('saleForm');if(!form)throw new Error('Seller sale form is unavailable.');form.requestSubmit();
      await new Promise(r=>setTimeout(r,950));
      const sale=(db.sales||[]).find(s=>!before.has(String(s.id)));if(!sale)throw new Error('The sale was not created. Check the requested raffle number(s) and try again.');
      sale.requestId=o.requestId;sale.proofStatus='approved';sale.proofFileName=item.proofMeta?.name||'';sale.proofReviewedAt=new Date().toISOString();
      try{localStorage.setItem(DATA_KEY,JSON.stringify(db));if(typeof renderAll==='function')renderAll()}catch(e){}
      await new Promise(r=>setTimeout(r,250));
      const pack=makeRelease(sale);if(pack.error)throw new Error(pack.error);
      item.status='approved';item.saleId=sale.id;item.releaseCode=pack.code;item.controlNo=sale.controlNo||pack.controlNo||'';item.ticketCount=pack.count;item.reviewedAt=new Date().toISOString();saveQueue(list);render();
      try{if(typeof showView==='function')showView('reports')}catch(e){}
      toastMsg(`${pack.count} paid e-ticket${pack.count===1?'':'s'} issued for ${sale.buyerName}. Seller release file is ready.`);
    }catch(err){item.status='imported';item.error=err.message||'Approval failed.';saveQueue(list);render();alert(item.error)}
  }

  function reject(id){const list=queue(),item=list.find(x=>x.requestId===id);if(!item)return;const reason=prompt('Reason for rejection (optional):',item.rejectionReason||'');if(reason===null)return;item.status='rejected';item.rejectionReason=reason.trim();item.reviewedAt=new Date().toISOString();saveQueue(list);render();toastMsg('Buyer request marked Rejected on this seller device.')}

  async function shareRelease(id){
    const item=queue().find(x=>x.requestId===id);if(!item?.releaseCode)return alert('No seller release file is ready yet.');
    const pkg={format:'GT27-SELLER-RELEASE',version:1,campaign:'GET TOGETHER 2027',requestId:item.requestId,controlNo:item.controlNo||'',ticketCount:Number(item.ticketCount||0),issuedAt:new Date().toISOString(),releaseCode:item.releaseCode};const blob=new Blob([JSON.stringify(pkg)],{type:'application/json'}),name=`${item.requestId}-seller-release.gt27.json`,file=new File([blob],name,{type:'application/json'});
    try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:'GET TOGETHER 2027 Seller Release',text:`${item.ticketCount} e-ticket${Number(item.ticketCount)===1?'':'s'} approved for ${item.order?.buyerName||'buyer'}.`,files:[file]});return}}catch(e){}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);toastMsg('Seller release file saved. Send it to the buyer by Quick Share, Bluetooth, USB, Messenger, or another available method.');
  }
  async function copyRelease(id){const item=queue().find(x=>x.requestId===id);if(!item?.releaseCode)return;try{await navigator.clipboard.writeText(item.releaseCode);toastMsg('Ticket Release Code copied.')}catch(e){prompt('Copy Ticket Release Code:',item.releaseCode)}}

  function render(){
    const box=$('sellerOfflineRequestList');if(!box)return;const list=queue();if(!list.length){box.innerHTML='<div class="note">No offline buyer request packages imported yet.</div>';return}
    box.innerHTML=list.map(x=>{const o=x.order||{},st=x.status||'imported';return `<div class="sow-item"><div class="sow-top"><div><div class="sow-name">${esc(o.buyerName||x.profile?.name||'Buyer')}</div><div class="sow-meta">${esc(x.requestId)}<br>${Number(o.qty||0)} ticket${Number(o.qty||0)===1?'':'s'} • ${peso(Number(o.qty||0)*Number(o.price||0))} • ${esc(o.method||'')} ${o.ref?`• Ref ${esc(o.ref)}`:''}${o.preferredNumbers?.length?`<br>Preferred: ${o.preferredNumbers.map(n=>'GT27-'+String(n).padStart(5,'0')).join(', ')}`:''}</div></div><span class="sow-pill sow-${st}">${st==='approved'?'APPROVED / ISSUED':st==='rejected'?'REJECTED':st==='processing'?'PROCESSING':'FOR REVIEW'}</span></div>${x.proofMeta?`<div class="sow-proof"><b>Payment Proof:</b> ${esc(x.proofMeta.name)} • ${Math.round(Number(x.proofMeta.size||0)/1024)} KB</div>`:'<div class="sow-proof"><b>Payment Proof:</b> None attached</div>'}${x.error?`<div class="sow-meta" style="color:#a33038">${esc(x.error)}</div>`:''}${x.rejectionReason?`<div class="sow-meta"><b>Reason:</b> ${esc(x.rejectionReason)}</div>`:''}${st==='approved'?`<div class="sow-release"><b>Control No.:</b> ${esc(x.controlNo||'—')}<br><b>E-Tickets:</b> ${Number(x.ticketCount||0)}<br>Seller release file is ready for the buyer.</div>`:''}<div class="sow-actions">${x.proofMeta?`<button class="btn secondary" type="button" data-sow-proof="${esc(x.requestId)}">View Proof</button>`:''}${st==='imported'?`<button class="btn primary" type="button" data-sow-approve="${esc(x.requestId)}">APPROVE & ISSUE TICKETS</button><button class="btn danger" type="button" data-sow-reject="${esc(x.requestId)}">Reject</button>`:''}${st==='approved'?`<button class="btn primary" type="button" data-sow-share="${esc(x.requestId)}">SAVE / SHARE SELLER RELEASE</button><button class="btn secondary" type="button" data-sow-copy="${esc(x.requestId)}">Copy Release Code</button>`:''}</div></div>`}).join('');
    box.querySelectorAll('[data-sow-proof]').forEach(b=>b.onclick=()=>viewProof(b.dataset.sowProof));box.querySelectorAll('[data-sow-approve]').forEach(b=>b.onclick=()=>approve(b.dataset.sowApprove));box.querySelectorAll('[data-sow-reject]').forEach(b=>b.onclick=()=>reject(b.dataset.sowReject));box.querySelectorAll('[data-sow-share]').forEach(b=>b.onclick=()=>shareRelease(b.dataset.sowShare));box.querySelectorAll('[data-sow-copy]').forEach(b=>b.onclick=()=>copyRelease(b.dataset.sowCopy));
  }

  function init(){addStyle();ensureCard();render();setTimeout(()=>{ensureCard();render()},600);new MutationObserver(()=>{ensureCard()}).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();