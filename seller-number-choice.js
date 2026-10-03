(function(){
  const DATA_KEY='fundraising_eraffle_v1';
  const REQUEST_PREFIX='ERREQ1.';
  const MAX_NO=99999;
  let pending=null;

  const $=id=>document.getElementById(id);
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}
  function format(n){return `GT27-${String(n).padStart(5,'0')}`}
  function parseNumbers(raw){
    const parts=String(raw||'').split(/[\s,;]+/).map(x=>x.trim()).filter(Boolean);
    const nums=[];
    for(const p of parts){
      const m=p.match(/(\d{1,5})$/);if(!m)throw new Error('Use numbers only, separated by commas.');
      const n=Number(m[1]);if(!Number.isInteger(n)||n<1||n>MAX_NO)throw new Error('Raffle numbers must be from 1 to 99999.');
      if(nums.includes(n))throw new Error('Duplicate preferred raffle number entered.');
      nums.push(n);
    }
    return nums;
  }
  function decode(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const bin=atob(s),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
  function parseRequest(raw){const v=String(raw||'').trim();if(!v.startsWith(REQUEST_PREFIX))return null;return JSON.parse(decode(v.slice(REQUEST_PREFIX.length)))}
  function saveDb(){try{localStorage.setItem(DATA_KEY,JSON.stringify(db))}catch(e){}}

  function addStyle(){
    if($('sellerNumberChoiceStyle'))return;
    const s=document.createElement('style');s.id='sellerNumberChoiceStyle';s.textContent=`
      .seller-number-choice{margin-top:12px;padding:13px;border:2px solid #d7a91f;border-radius:15px;background:linear-gradient(135deg,#fffef4,#fff8cf)}
      .seller-number-choice b{color:#246b2d}.seller-number-choice .note{margin-top:5px}
    `;document.head.appendChild(s);
  }

  function addField(){
    const form=$('saleForm');if(!form||$('sellerPreferredNumbers'))return;
    const box=document.createElement('div');box.className='seller-number-choice';
    box.innerHTML=`<label><b>Buyer Preferred Raffle Number(s) — Optional</b><input id="sellerPreferredNumbers" inputmode="numeric" placeholder="Example: 7, 21, 88"></label><div class="note">Numbers requested by the buyer are checked before the sale is created. Unavailable numbers are not reused.</div>`;
    const notes=$('notes')?.closest('label');notes?notes.insertAdjacentElement('afterend',box):form.appendChild(box);
  }

  function usedTicketNumbers(excludeSaleId){
    const set=new Set();
    try{(db.tickets||[]).forEach(t=>{if(String(t.saleId)!==String(excludeSaleId||''))set.add(String(t.number||'').toUpperCase())})}catch(e){}
    return set;
  }

  function validateBeforeSale(e){
    if(e.target?.id!=='saleForm')return;
    try{
      const nums=parseNumbers($('sellerPreferredNumbers')?.value||'');
      const qty=Math.max(1,Math.min(500,+$('qty')?.value||1));
      if(nums.length>qty)throw new Error(`There are ${nums.length} preferred numbers but only ${qty} ticket${qty===1?'':'s'} in this sale.`);
      const used=usedTicketNumbers('');
      const clash=nums.map(format).find(n=>used.has(n.toUpperCase()));
      if(clash)throw new Error(`${clash} is already assigned. Ask the buyer to choose another number.`);
      const before=new Set((db.sales||[]).map(s=>String(s.id)));
      pending={nums,before};
      setTimeout(applyAfterSale,90);
    }catch(err){pending=null;e.preventDefault();e.stopImmediatePropagation();toastMsg(err.message||'Unable to use the selected raffle numbers.');}
  }

  function nextFree(used,blocked){
    let n=Math.max(1,Number(db.nextTicket||1));
    while(n<=MAX_NO){const no=format(n);if(!used.has(no.toUpperCase())&&!blocked.has(no.toUpperCase())){db.nextTicket=n+1;return no}n++}
    return '';
  }

  function applyAfterSale(){
    if(!pending)return;
    const p=pending;pending=null;
    let sale=null;
    try{sale=(db.sales||[]).find(s=>!p.before.has(String(s.id)))}catch(e){}
    if(!sale)return;
    const own=(db.tickets||[]).filter(t=>String(t.saleId)===String(sale.id));
    const used=usedTicketNumbers(sale.id);
    const chosen=p.nums.map(format);
    const blocked=new Set(chosen.map(x=>x.toUpperCase()));
    const assigned=new Set();
    own.forEach((t,i)=>{
      let no='';
      if(i<chosen.length)no=chosen[i];
      else{
        const current=String(t.number||'');const key=current.toUpperCase();
        if(current&&!used.has(key)&&!blocked.has(key)&&!assigned.has(key))no=current;
        else no=nextFree(used,new Set([...blocked,...assigned]));
      }
      if(no){t.number=no;assigned.add(no.toUpperCase())}
    });
    sale.preferredNumbers=chosen;
    sale.assignedNumbers=own.map(t=>t.number);
    saveDb();
    try{if(typeof renderAll==='function')renderAll()}catch(e){}
    if(chosen.length)toastMsg(`Preferred raffle number${chosen.length===1?'':'s'} confirmed: ${chosen.join(', ')}`);
  }

  function importBuyerPreference(){
    setTimeout(()=>{
      try{
        const d=parseRequest($('buyerRequestCode')?.value||'');
        if(!d||!$('sellerPreferredNumbers'))return;
        const nums=Array.isArray(d.preferredNumbers)?d.preferredNumbers:[];
        $('sellerPreferredNumbers').value=nums.join(', ');
        if(nums.length)toastMsg(`Buyer requested: ${nums.map(format).join(', ')}`);
      }catch(e){}
    },40);
  }

  function bind(){
    if(document.documentElement.dataset.sellerNumberChoiceBound)return;
    document.documentElement.dataset.sellerNumberChoiceBound='1';
    document.addEventListener('submit',validateBeforeSale,true);
    document.addEventListener('click',e=>{if(e.target.closest('#importBuyerRequestBtn'))importBuyerPreference()},true);
  }

  function init(){addStyle();addField();bind();setTimeout(addField,300);setTimeout(addField,900);new MutationObserver(addField).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();