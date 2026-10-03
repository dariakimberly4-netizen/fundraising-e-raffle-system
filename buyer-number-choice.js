(function(){
  const ORDER_KEY='gt27_buyer_order_v2';
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const PREFIX='ERREQ1.';
  const MAX_NO=99999;

  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[m]));
  function load(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
  function save(key,v){try{localStorage.setItem(key,JSON.stringify(v))}catch(e){}}
  function enc(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function parseNumbers(raw){
    const parts=String(raw||'').split(/[\s,;]+/).map(x=>x.trim()).filter(Boolean);
    const nums=[];
    for(const p of parts){
      const m=p.match(/(\d{1,5})$/);if(!m)throw new Error('Use numbers only, separated by commas.');
      const n=Number(m[1]);if(!Number.isInteger(n)||n<1||n>MAX_NO)throw new Error('Choose raffle numbers from 1 to 99999.');
      if(nums.includes(n))throw new Error('Do not repeat the same raffle number.');
      nums.push(n);
    }
    return nums;
  }
  function format(n){return `GT27-${String(n).padStart(5,'0')}`}

  function addStyle(){
    if($('buyerNumberChoiceStyle'))return;
    const s=document.createElement('style');s.id='buyerNumberChoiceStyle';s.textContent=`
      .buyer-number-choice{margin-top:14px;padding:14px;border:2px solid #d7a91f;border-radius:16px;background:linear-gradient(135deg,#fffdf2,#fff8cf)}
      .buyer-number-choice b{color:#246b2d}.buyer-number-choice .hint{font-size:12px;color:#6b7567;line-height:1.45;margin-top:6px}
      .buyer-control-pill{display:inline-flex;padding:5px 9px;border-radius:999px;background:#eef7ea;border:1px solid #cfe2c9;color:#246b2d;font-weight:950;font-size:11px}
    `;document.head.appendChild(s);
  }

  function addChoiceField(){
    const form=$('buyerForm');if(!form||$('preferredNumbers'))return;
    const box=document.createElement('div');box.className='buyer-number-choice';
    box.innerHTML=`<label><b>Choose Your Raffle Number(s) — Optional</b><input id="preferredNumbers" inputmode="numeric" placeholder="Example: 7, 21, 88"></label><div class="hint">Enter up to your ticket quantity. Example: 7 becomes GT27-00007. Your selection is a request until the seller confirms the number is still available.</div>`;
    const summary=form.querySelector('.summary');summary?form.insertBefore(box,summary):form.appendChild(box);
    const o=load(ORDER_KEY);if(o?.preferredNumbers?.length)$('preferredNumbers').value=o.preferredNumbers.join(', ');
  }

  function savePreferenceAfterSubmit(nums){
    setTimeout(()=>{
      const o=load(ORDER_KEY);if(!o)return;
      o.preferredNumbers=nums;
      o.code=PREFIX+enc({...o,proofSize:undefined});
      save(ORDER_KEY,o);
      try{if(typeof renderOrder==='function')renderOrder()}catch(e){}
      decorateBuyer();
    },40);
  }

  function bindForm(){
    if(document.documentElement.dataset.buyerNumberChoiceBound)return;
    document.documentElement.dataset.buyerNumberChoiceBound='1';
    document.addEventListener('submit',e=>{
      if(e.target?.id!=='buyerForm')return;
      try{
        const nums=parseNumbers($('preferredNumbers')?.value||'');
        const qty=Math.max(1,Math.min(500,+$('qty')?.value||1));
        if(nums.length>qty)throw new Error(`You selected ${nums.length} numbers but are buying ${qty} ticket${qty===1?'':'s'}.`);
        savePreferenceAfterSubmit(nums);
      }catch(err){e.preventDefault();e.stopImmediatePropagation();alert(err.message||'Please check your chosen raffle numbers.');}
    },true);
  }

  function ensureRequestRows(){
    const data=$('requestData');if(!data)return;
    let pref=$('buyerPreferredRow');
    if(!pref){
      pref=document.createElement('div');pref.id='buyerPreferredRow';pref.className='kv';pref.innerHTML='<span>Preferred raffle no.</span><b id="buyerPreferredValue">Seller assigns</b>';
      const order=$('orderNo')?.closest('.kv');order?.insertAdjacentElement('afterend',pref);
    }
    let control=$('buyerControlRow');
    if(!control){
      control=document.createElement('div');control.id='buyerControlRow';control.className='kv';control.innerHTML='<span>Control No.</span><b id="buyerControlValue">Assigned after seller confirmation</b>';
      pref.insertAdjacentElement('afterend',control);
    }
  }

  function decorateRequest(){
    ensureRequestRows();
    const o=load(ORDER_KEY),pack=load(TICKET_KEY);
    const pv=$('buyerPreferredValue');if(pv)pv.textContent=o?.preferredNumbers?.length?o.preferredNumbers.map(format).join(', '):'Seller assigns';
    const cv=$('buyerControlValue');if(cv){cv.textContent=pack?.controlNo||'Assigned after seller confirmation';if(pack?.controlNo)cv.className='buyer-control-pill'}
  }

  function decoratePayment(){
    const box=$('buyerPaymentStatus');const pack=load(TICKET_KEY);if(!box||!pack?.controlNo)return;
    let row=$('buyerPaymentControlNo');if(!row){row=document.createElement('div');row.id='buyerPaymentControlNo';row.className='kv';row.innerHTML='<span>Control No.</span><b></b>';box.appendChild(row)}
    row.querySelector('b').textContent=pack.controlNo;
  }

  function decorateTickets(){
    const pack=load(TICKET_KEY);if(!pack?.controlNo)return;
    document.querySelectorAll('.buyer-ticket').forEach(card=>{
      if(card.querySelector('[data-buyer-control]'))return;
      const row=document.createElement('div');row.className='kv';row.dataset.buyerControl='1';row.innerHTML=`<span>Control No.</span><b>${esc(pack.controlNo)}</b>`;
      const note=card.querySelector('.note');note?.insertAdjacentElement('afterend',row);
    });
  }

  function decorateBuyer(){decorateRequest();decoratePayment();decorateTickets()}
  function init(){addStyle();addChoiceField();bindForm();decorateBuyer();setTimeout(decorateBuyer,300);setTimeout(decorateBuyer,900);new MutationObserver(decorateBuyer).observe(document.body,{childList:true,subtree:true});setInterval(decorateBuyer,1600)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();