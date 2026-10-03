(function(){
  const ORDER_KEY='gt27_buyer_order_v2';
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const ACTIVE_PROFILE_KEY='gt27_buyer_active_profile_v1';
  const PROFILES_KEY='gt27_buyer_profiles_v1';
  const HISTORY_PREFIX='gt27_buyer_history_v1:';
  const DB_NAME='gt27_buyer_files_v1';
  const DB_VERSION=1;
  const STORE='proofs';
  const MAX_PROOF=8*1024*1024;

  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const peso=n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2});
  const load=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch(e){return f}};
  const activeProfileId=()=>localStorage.getItem(ACTIVE_PROFILE_KEY)||'default';
  const historyKey=()=>HISTORY_PREFIX+activeProfileId();
  const history=()=>load(historyKey(),[]);
  const saveHistory=v=>localStorage.setItem(historyKey(),JSON.stringify(v));

  function openDb(){
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'requestId'})};
      req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
    });
  }
  async function putProof(requestId,file){
    if(!requestId||!file)return;
    if(file.size>MAX_PROOF)throw new Error('Payment proof is too large. Please use a file smaller than 8 MB.');
    const db=await openDb();
    await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put({requestId,name:file.name,type:file.type||'application/octet-stream',size:file.size,blob:file,savedAt:new Date().toISOString()});tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)});
    db.close();
  }
  async function getProof(requestId){
    const db=await openDb();
    const out=await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const r=tx.objectStore(STORE).get(requestId);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)});
    db.close();return out;
  }
  function blobToDataURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob)})}

  function currentProfile(){
    const id=activeProfileId();
    return (load(PROFILES_KEY,[])||[]).find(p=>p&&p.id===id)||null;
  }
  function upsertHistory(order,extra={}){
    if(!order?.requestId)return;
    const list=history();let item=list.find(x=>x.requestId===order.requestId);
    const base={requestId:order.requestId,createdAt:order.createdAt||new Date().toISOString(),buyerName:order.buyerName||'',qty:Number(order.qty||0),price:Number(order.price||0),total:Number(order.qty||0)*Number(order.price||0),method:order.method||'',ref:order.ref||'',preferredNumbers:order.preferredNumbers||[],status:order.status||'pending',controlNo:'',ticketCount:0,ticketNumbers:[],proofName:order.proofName||'',proofSize:Number(order.proofSize||0)};
    if(item)Object.assign(item,base,extra,{updatedAt:new Date().toISOString()});else list.unshift(Object.assign(base,extra,{updatedAt:new Date().toISOString()}));
    saveHistory(list.slice(0,100));renderHistory();
  }
  function syncHistoryFromCurrent(){
    const o=load(ORDER_KEY),pack=load(TICKET_KEY);
    if(!o)return;
    const extra=pack?.tickets?.length?{status:'paid',controlNo:pack.controlNo||'',ticketCount:pack.tickets.length,ticketNumbers:pack.tickets.map(t=>t.number)}:{};
    upsertHistory(o,extra);
  }

  function addStyle(){
    if($('buyerOfflineWorkflowStyle'))return;
    const s=document.createElement('style');s.id='buyerOfflineWorkflowStyle';s.textContent=`
      .bow-card{margin-top:12px;border:1px solid #dfe8d9;border-radius:16px;padding:14px;background:#f8fbf6}
      .bow-card b{color:#246b2d}.bow-small{font-size:12px;color:#6b7567;line-height:1.45;margin-top:4px}
      .bow-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.bow-actions .btn{min-height:44px}
      .bow-history{display:grid;gap:10px}.bow-history-item{border:1px solid #dfe8d9;border-radius:16px;padding:13px;background:#fff}
      .bow-history-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.bow-history-id{font-weight:950;color:#246b2d}.bow-history-meta{font-size:12px;color:#6b7567;line-height:1.45;margin-top:4px}.bow-pill{padding:5px 8px;border-radius:999px;font-size:10px;font-weight:950;white-space:nowrap}.bow-pending{background:#fff1d6;color:#8a6111}.bow-paid{background:#e5f5ed;color:#187650}.bow-rejected{background:#fde7e9;color:#a33038}.bow-import{margin-top:12px;border-top:1px solid #edf2ea;padding-top:12px}.bow-file{display:block;width:100%;font-size:13px}
      @media(max-width:560px){.bow-history-top{flex-direction:column}.bow-actions>*{flex:1 1 145px}}
    `;document.head.appendChild(s);
  }

  function addHistoryView(){
    const main=document.querySelector('main.content');if(!main||$('history'))return;
    const sec=document.createElement('section');sec.id='history';sec.className='view';sec.innerHTML=`<div class="card"><h3>Purchase History</h3><p class="note">Each buyer profile keeps its own requests and issued e-tickets on this phone.</p><div id="buyerHistoryList" class="bow-history"></div></div>`;
    main.appendChild(sec);
    const ticketsGroup=[...document.querySelectorAll('.group')].find(g=>g.querySelector('[data-route="tickets"]'));
    const sub=ticketsGroup?.querySelector('.subnav');
    if(sub&&!sub.querySelector('[data-route="history"]')){const a=document.createElement('a');a.dataset.route='history';a.href='#history';a.textContent='Purchase History';sub.appendChild(a)}
  }

  function renderHistory(){
    const box=$('buyerHistoryList');if(!box)return;const list=history();
    if(!list.length){box.innerHTML='<div class="note">No previous purchases yet.</div>';return}
    box.innerHTML=list.map(x=>{const st=(x.status||'pending').toLowerCase();return `<div class="bow-history-item"><div class="bow-history-top"><div><div class="bow-history-id">${esc(x.requestId)}</div><div class="bow-history-meta">${esc(new Date(x.createdAt).toLocaleString('en-PH'))}<br>${Number(x.qty||0)} ticket${Number(x.qty||0)===1?'':'s'} • ${peso(x.total)} • ${esc(x.method||'')}</div></div><span class="bow-pill bow-${st==='paid'?'paid':st==='rejected'?'rejected':'pending'}">${st==='paid'?'PAID / ISSUED':st==='rejected'?'REJECTED':'PENDING'}</span></div>${x.controlNo?`<div class="bow-history-meta"><b>Control No.:</b> ${esc(x.controlNo)}<br><b>E-Tickets:</b> ${esc(x.ticketNumbers?.join(', ')||x.ticketCount||0)}</div>`:''}${x.proofName?`<div class="bow-history-meta"><b>Proof:</b> ${esc(x.proofName)}</div>`:''}</div>`}).join('');
  }

  async function saveSelectedProofAfterSubmit(){
    const order=load(ORDER_KEY);if(!order?.requestId)return;
    const file=$('proof')?.files?.[0]||null;
    try{
      if(file){await putProof(order.requestId,file);order.proofName=file.name;order.proofSize=file.size;localStorage.setItem(ORDER_KEY,JSON.stringify(order));upsertHistory(order,{proofSaved:true});const meta=$('proofMeta');if(meta)meta.textContent=`${file.name} • ${Math.round(file.size/1024)} KB • Saved offline on this device`;}
      else upsertHistory(order);
    }catch(e){upsertHistory(order);alert(e.message||'Unable to save the payment proof offline.')}
  }

  async function viewProof(){
    const o=load(ORDER_KEY);if(!o?.requestId)return alert('No saved request yet.');const p=await getProof(o.requestId);if(!p?.blob)return alert('No actual payment proof is saved for this request on this phone.');
    const u=URL.createObjectURL(p.blob);window.open(u,'_blank');setTimeout(()=>URL.revokeObjectURL(u),60000);
  }

  async function requestPackage(){
    const o=load(ORDER_KEY);if(!o?.requestId)return alert('Submit a ticket request first.');
    const p=await getProof(o.requestId);let proof=null;
    if(p?.blob){proof={name:p.name,type:p.type,size:p.size,dataUrl:await blobToDataURL(p.blob)}}
    const profile=currentProfile();
    const pkg={format:'GT27-BUYER-REQUEST-PACKAGE',version:1,campaign:'GET TOGETHER 2027',exportedAt:new Date().toISOString(),profile:profile?{id:profile.id,name:profile.name,contact:profile.contact||'',email:profile.email||''}:null,order:o,requestCode:o.code||'',proof};
    const blob=new Blob([JSON.stringify(pkg)],{type:'application/json'}),name=`${o.requestId}.gt27-request.json`,file=new File([blob],name,{type:'application/json'});
    try{
      if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:'GET TOGETHER 2027 Buyer Request',text:`Buyer request ${o.requestId}${proof?' with payment proof':''}`,files:[file]});return}
    }catch(e){}
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1200);
    alert(`Offline request package saved${proof?' with the actual payment proof':''}. Send this file to the seller by Quick Share, Bluetooth, USB, Messenger, or another available method.`);
  }

  async function importSellerRelease(file){
    if(!file)return;try{
      const pkg=JSON.parse(await file.text());if(pkg?.format!=='GT27-SELLER-RELEASE'||!String(pkg.releaseCode||'').startsWith('ERTKT1.'))throw new Error('This is not a valid seller release file.');
      const input=$('releaseCode');if(!input)throw new Error('Ticket receiver is unavailable.');input.value=pkg.releaseCode;$('receiveTickets')?.click();setTimeout(()=>{syncHistoryFromCurrent();location.hash='tickets'},180);
    }catch(e){alert(e.message||'Unable to import the seller release file.')}
  }

  function decorateRequest(){
    const rd=$('requestData');if(!rd||$('buyerOfflineTransferCard'))return;
    const card=document.createElement('div');card.id='buyerOfflineTransferCard';card.className='bow-card';card.innerHTML=`<b>Offline Seller Transfer</b><div class="bow-small">Save/share one request package. If you attached a payment screenshot or receipt, the actual file is included so the seller can review it without Supabase.</div><div class="bow-actions"><button id="buyerExportRequestPackage" class="btn primary" type="button">SAVE / SHARE REQUEST PACKAGE</button><button id="buyerViewSavedProof" class="btn secondary" type="button">View Saved Proof</button></div>`;
    rd.appendChild(card);$('buyerExportRequestPackage').onclick=requestPackage;$('buyerViewSavedProof').onclick=viewProof;
  }
  function decorateTickets(){
    const sec=$('tickets')?.querySelector('.card');if(!sec||$('buyerSellerReleaseFile'))return;
    const box=document.createElement('div');box.className='bow-import';box.innerHTML=`<b style="color:#246b2d">Received a seller release file?</b><div class="bow-small">Import it and your exact e-tickets will be received automatically.</div><input class="bow-file" id="buyerSellerReleaseFile" type="file" accept=".json,.gt27,.txt,application/json">`;
    sec.insertBefore(box,$('ticketList')||null);$('buyerSellerReleaseFile').addEventListener('change',e=>importSellerRelease(e.target.files?.[0]));
  }
  function decorateProof(){
    const meta=$('proofMeta');if(meta&&!$('buyerProofOfflineNote')){const n=document.createElement('div');n.id='buyerProofOfflineNote';n.className='bow-small';n.textContent='The actual proof will be saved privately on this device and can be included in the offline seller request package.';meta.insertAdjacentElement('afterend',n)}
  }

  function bind(){
    const form=$('buyerForm');if(form&&!form.dataset.offlineWorkflowBound){form.dataset.offlineWorkflowBound='1';form.addEventListener('submit',()=>setTimeout(saveSelectedProofAfterSubmit,80));}
    const receive=$('receiveTickets');if(receive&&!receive.dataset.historyBound){receive.dataset.historyBound='1';receive.addEventListener('click',()=>setTimeout(syncHistoryFromCurrent,180));}
    window.addEventListener('hashchange',()=>{if(location.hash==='#history')renderHistory()});
  }
  function init(){addStyle();addHistoryView();decorateRequest();decorateTickets();decorateProof();bind();syncHistoryFromCurrent();renderHistory();setTimeout(()=>{decorateRequest();decorateTickets();decorateProof();bind()},500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();