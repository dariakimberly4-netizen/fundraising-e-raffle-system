(function(){
  const DATA_KEY='fundraising_eraffle_v1';
  const REQUEST_PREFIX='ERREQ1.';
  const RESERVE_KEY='gt27_ticket_reservations_v1';
  const SELLER_USER_KEY='gt27_seller_user_v1';
  const NEXT_PREFIX='gt27_next_ticket_range_v1_';
  const MAX_NO=99999;
  const RANGES={
    staff1:{label:'Staff 1',start:1,end:19999},
    gen:{label:'Gen',start:20000,end:39999},
    bot:{label:'Bot',start:40000,end:59999},
    kim:{label:'Kim',start:60000,end:99999}
  };
  let pending=null;
  let activeOwner='';
  let activeBuyer='';

  const $=id=>document.getElementById(id);
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}
  function currentUser(){return sessionStorage.getItem(SELLER_USER_KEY)||'kim'}
  function range(){return RANGES[currentUser()]||RANGES.kim}
  function format(n){return `GT27-${String(n).padStart(5,'0')}`}
  function parseNumbers(raw){
    const parts=String(raw||'').split(/[\s,;]+/).map(x=>x.trim()).filter(Boolean);
    const nums=[];
    for(const p of parts){
      const m=p.match(/(\d{1,5})$/);if(!m)throw new Error('Use numbers only, separated by commas.');
      const n=Number(m[1]);if(!Number.isInteger(n)||n<1||n>MAX_NO)throw new Error('Raffle numbers must be from 1 to 99999.');
      if(nums.includes(n))throw new Error('The same preferred number was entered more than once.');
      nums.push(n);
    }
    return nums;
  }
  function decode(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const bin=atob(s),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
  function parseRequest(raw){const v=String(raw||'').trim();if(!v.startsWith(REQUEST_PREFIX))return null;return JSON.parse(decode(v.slice(REQUEST_PREFIX.length)))}
  function ownerFor(raw){let h=2166136261;for(const ch of String(raw||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return 'REQ-'+(h>>>0).toString(36).toUpperCase()}
  function saveDb(){try{localStorage.setItem(DATA_KEY,JSON.stringify(db))}catch(e){}}
  function reservations(){try{return JSON.parse(localStorage.getItem(RESERVE_KEY)||'{}')||{}}catch(e){return{}}}
  function saveReservations(v){try{localStorage.setItem(RESERVE_KEY,JSON.stringify(v))}catch(e){}}
  function claimedSet(excludeSaleId){
    const set=new Set();
    try{(db.tickets||[]).forEach(t=>{if(String(t.saleId)!==String(excludeSaleId||''))set.add(String(t.number||'').toUpperCase())})}catch(e){}
    return set;
  }
  function statusFor(n,owner){
    const no=format(n),key=no.toUpperCase(),r=range();
    if(claimedSet('').has(key))return {type:'claimed',label:'CLAIMED',detail:'Already assigned to an e-ticket.'};
    const res=reservations()[key];
    if(res)return {type:'reserved',label:'RESERVED',detail:res.owner===owner?'Reserved for this buyer request.':`Reserved${res.buyer?' for '+res.buyer:''}.`,mine:res.owner===owner};
    if(n<r.start||n>r.end)return {type:'outside',label:'OTHER SELLER RANGE',detail:`${r.label} can issue ${format(r.start)}–${format(r.end)} while offline.`};
    return {type:'available',label:'AVAILABLE',detail:'Safe to use on this seller device.'};
  }

  function addStyle(){
    if($('sellerNumberChoiceStyle'))return;
    const s=document.createElement('style');s.id='sellerNumberChoiceStyle';s.textContent=`
      .seller-number-choice{margin-top:12px;padding:16px;border:2px solid #d7a91f;border-radius:18px;background:linear-gradient(135deg,#fffef4,#fff8cf)}
      .seller-number-choice b{color:#246b2d}.seller-number-choice .note{margin-top:5px;line-height:1.45}
      .snc-range{margin:10px 0;padding:10px 12px;border-radius:12px;background:#eef7ea;border:1px solid #cfe1c8;color:#246b2d;font-size:12px;font-weight:850;line-height:1.45}
      .snc-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.snc-actions button{min-height:42px}
      .snc-status{display:grid;gap:8px;margin-top:10px}.snc-row{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:10px 11px;border-radius:12px;background:#fff;border:1px solid #e5e8df}.snc-no{font-weight:950;color:#263524}.snc-detail{font-size:11px;color:#6b7567;margin-top:3px;line-height:1.35}.snc-pill{flex:0 0 auto;padding:6px 8px;border-radius:999px;font-size:10px;font-weight:950;letter-spacing:.04em}.snc-available{background:#e5f5ed;color:#187650}.snc-claimed{background:#fde7e9;color:#a33038}.snc-reserved{background:#fff1d6;color:#8a6111}.snc-outside{background:#eef1f4;color:#4e5964}
      .snc-legend{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px;font-size:10px;font-weight:900;color:#5d6659}.snc-legend span{padding:5px 7px;border-radius:999px;background:#fff;border:1px solid #e1e6dc}
      @media(max-width:600px){.snc-row{flex-direction:column}.snc-pill{align-self:flex-start}.snc-actions>*{flex:1 1 140px}}
    `;document.head.appendChild(s);
  }

  function addField(){
    const form=$('saleForm');if(!form||$('sellerPreferredNumbers'))return;
    const r=range();
    const box=document.createElement('div');box.className='seller-number-choice';
    box.innerHTML=`<label><b>Preferred Raffle Number(s) — Optional</b><input id="sellerPreferredNumbers" inputmode="numeric" placeholder="Example: 7, 21, 88" autocomplete="off"></label><div class="note">Enter the buyer's requested number(s). The seller app checks them before creating the sale.</div><div class="snc-range"><b>Offline safety range for ${r.label}:</b><br>${format(r.start)} to ${format(r.end)}<br><span style="font-weight:700">For duplicate protection across offline phones, use each seller account on only one seller device at a time.</span></div><div class="snc-actions"><button type="button" class="btn secondary" id="sellerCheckNumbersBtn">Check Availability</button><button type="button" class="btn secondary" id="sellerReleaseReservationsBtn" hidden>Release Reservation</button></div><div class="snc-legend"><span>🟢 AVAILABLE</span><span>🟡 RESERVED</span><span>🔴 CLAIMED</span></div><div id="sellerNumberStatus" class="snc-status" aria-live="polite"></div>`;
    const notes=$('notes')?.closest('label');notes?notes.insertAdjacentElement('afterend',box):form.appendChild(box);
    $('sellerPreferredNumbers').addEventListener('input',()=>renderStatuses(false));
    $('sellerCheckNumbersBtn').addEventListener('click',()=>renderStatuses(true));
    $('sellerReleaseReservationsBtn').addEventListener('click',releaseActiveReservations);
  }

  function renderStatuses(showEmpty){
    const box=$('sellerNumberStatus'),input=$('sellerPreferredNumbers');if(!box||!input)return;
    let nums=[];try{nums=parseNumbers(input.value)}catch(err){box.innerHTML=`<div class="snc-row"><div><div class="snc-no">Check the number format</div><div class="snc-detail">${err.message}</div></div><span class="snc-pill snc-claimed">FIX</span></div>`;return}
    if(!nums.length){box.innerHTML=showEmpty?'<div class="snc-row"><div><div class="snc-no">No preferred number entered</div><div class="snc-detail">The system can assign the next safe number from this seller’s offline range.</div></div><span class="snc-pill snc-available">OK</span></div>':'';return}
    box.innerHTML=nums.map(n=>{const st=statusFor(n,activeOwner);return `<div class="snc-row"><div><div class="snc-no">${format(n)}</div><div class="snc-detail">${st.detail}</div></div><span class="snc-pill snc-${st.type}">${st.label}</span></div>`}).join('');
  }

  function reserveNumbers(nums,owner,buyer){
    const all=reservations();const reserved=[];const blocked=[];
    nums.forEach(n=>{const no=format(n),key=no.toUpperCase(),st=statusFor(n,owner);if(st.type==='available'||(st.type==='reserved'&&st.mine)){all[key]={owner,buyer:buyer||'',reservedAt:new Date().toISOString(),seller:currentUser()};reserved.push(no)}else blocked.push({no,status:st})});
    saveReservations(all);return {reserved,blocked};
  }
  function releaseOwner(owner){if(!owner)return;const all=reservations();let changed=false;Object.keys(all).forEach(k=>{if(all[k]?.owner===owner){delete all[k];changed=true}});if(changed)saveReservations(all)}
  function releaseActiveReservations(){if(!activeOwner)return;releaseOwner(activeOwner);activeOwner='';activeBuyer='';const b=$('sellerReleaseReservationsBtn');if(b)b.hidden=true;renderStatuses(false);toastMsg('Buyer number reservation released on this device.');}

  function validateBeforeSale(e){
    if(e.target?.id!=='saleForm')return;
    try{
      const nums=parseNumbers($('sellerPreferredNumbers')?.value||'');
      const qty=Math.max(1,Math.min(500,+$('qty')?.value||1));
      if(nums.length>qty)throw new Error(`There are ${nums.length} preferred numbers but only ${qty} ticket${qty===1?'':'s'} in this sale.`);
      const r=range();
      const outside=nums.find(n=>n<r.start||n>r.end);if(outside)throw new Error(`${format(outside)} is outside ${r.label}'s offline number range. Use the seller account assigned to that range or choose another number.`);
      const owner=activeOwner||('SALE-'+Date.now()+'-'+Math.random().toString(36).slice(2,7));
      const buyer=activeBuyer||$('buyerName')?.value||$('name')?.value||'Buyer';
      for(const n of nums){const st=statusFor(n,owner);if(st.type==='claimed')throw new Error(`${format(n)} is already CLAIMED. Choose another number.`);if(st.type==='reserved'&&!st.mine)throw new Error(`${format(n)} is RESERVED for another buyer request.`)}
      const held=reserveNumbers(nums,owner,buyer);
      if(held.blocked.length)throw new Error(`${held.blocked[0].no} cannot be used right now.`);
      const before=new Set((db.sales||[]).map(s=>String(s.id)));
      pending={nums,before,owner};
      setTimeout(applyAfterSale,120);
    }catch(err){pending=null;e.preventDefault();e.stopImmediatePropagation();toastMsg(err.message||'Unable to use the selected raffle numbers.');renderStatuses(false)}
  }

  function nextFree(used,blocked){
    const r=range(),res=reservations();let n=Math.max(r.start,Number(localStorage.getItem(NEXT_PREFIX+currentUser())||r.start));
    if(n>r.end)n=r.start;
    const start=n;
    do{
      const no=format(n),key=no.toUpperCase();
      if(!used.has(key)&&!blocked.has(key)&&!res[key]){localStorage.setItem(NEXT_PREFIX+currentUser(),String(n<r.end?n+1:r.start));return no}
      n=n<r.end?n+1:r.start;
    }while(n!==start);
    return '';
  }

  function applyAfterSale(){
    if(!pending)return;
    const p=pending;pending=null;
    let sale=null;
    try{sale=(db.sales||[]).find(s=>!p.before.has(String(s.id)))}catch(e){}
    if(!sale){releaseOwner(p.owner);renderStatuses(false);return}
    const own=(db.tickets||[]).filter(t=>String(t.saleId)===String(sale.id));
    const used=claimedSet(sale.id);
    const chosen=p.nums.map(format);
    const blocked=new Set(chosen.map(x=>x.toUpperCase()));
    const assigned=new Set();
    own.forEach((t,i)=>{
      let no=i<chosen.length?chosen[i]:nextFree(used,new Set([...blocked,...assigned]));
      if(no){t.number=no;assigned.add(no.toUpperCase())}
    });
    if(own.some(t=>!t.number)){releaseOwner(p.owner);toastMsg('This seller’s offline number range is full. No ticket was safely assigned.');return}
    sale.preferredNumbers=chosen;
    sale.assignedNumbers=own.map(t=>t.number);
    sale.sellerNumberRange={seller:currentUser(),start:range().start,end:range().end};
    releaseOwner(p.owner);activeOwner='';activeBuyer='';
    const rel=$('sellerReleaseReservationsBtn');if(rel)rel.hidden=true;
    saveDb();
    try{if(typeof renderAll==='function')renderAll()}catch(e){}
    renderStatuses(false);
    toastMsg(chosen.length?`Confirmed: ${chosen.join(', ')}. All ticket numbers are protected from duplicates on this offline seller device.`:`Sale created with safe ticket number(s) from ${range().label}'s offline range.`);
  }

  function importBuyerPreference(){
    setTimeout(()=>{
      try{
        const raw=$('buyerRequestCode')?.value||'';const d=parseRequest(raw);
        if(!d||!$('sellerPreferredNumbers'))return;
        if(activeOwner)releaseOwner(activeOwner);
        activeOwner=ownerFor(raw);activeBuyer=d.name||d.buyerName||d.fullName||'Buyer';
        const nums=Array.isArray(d.preferredNumbers)?d.preferredNumbers.map(Number).filter(Number.isFinite):[];
        $('sellerPreferredNumbers').value=nums.join(', ');
        const held=reserveNumbers(nums,activeOwner,activeBuyer);
        const rel=$('sellerReleaseReservationsBtn');if(rel)rel.hidden=!held.reserved.length;
        renderStatuses(false);
        if(held.reserved.length)toastMsg(`Reserved for ${activeBuyer}: ${held.reserved.join(', ')}`);
        if(held.blocked.length)toastMsg(`${held.blocked[0].no} is ${held.blocked[0].status.label}. Please review the number status.`);
      }catch(e){toastMsg('The buyer request was imported, but its preferred number could not be reserved.')}
    },60);
  }

  function bind(){
    if(document.documentElement.dataset.sellerNumberChoiceBound)return;
    document.documentElement.dataset.sellerNumberChoiceBound='1';
    document.addEventListener('submit',validateBeforeSale,true);
    document.addEventListener('click',e=>{if(e.target.closest('#importBuyerRequestBtn'))importBuyerPreference()},true);
    window.addEventListener('storage',e=>{if(e.key===DATA_KEY||e.key===RESERVE_KEY)renderStatuses(false)});
  }

  function init(){addStyle();addField();bind();setTimeout(addField,300);setTimeout(addField,900);new MutationObserver(addField).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();