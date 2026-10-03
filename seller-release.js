(function(){
  const PREFIX='ERTKT1.';
  function enc(obj){const bytes=new TextEncoder().encode(JSON.stringify(obj));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function toastMsg(msg){try{if(typeof toast==='function')toast(msg);else alert(msg)}catch(e){alert(msg)}}
  function getSale(id){try{return db.sales.find(s=>s.id===id)}catch(e){return null}}
  function getTickets(id){try{return db.tickets.filter(t=>t.saleId===id&&!t.voided&&t.status==='paid')}catch(e){return[]}}
  function expectedQty(sale,tickets){const q=Number(sale?.qty??sale?.quantity??sale?.ticketQty);return Number.isFinite(q)&&q>0?Math.round(q):tickets.length}
  function codeForSale(sale,tickets){return PREFIX+enc({v:3,campaign:'GET TOGETHER 2027',saleId:sale.id,controlNo:sale.controlNo||'',buyerName:sale.buyerName,issuedAt:new Date().toISOString(),drawDate:'2027-01-16',ticketCount:tickets.length,tickets:tickets.map(t=>({number:t.number,code:t.code,buyerName:t.buyerName,price:t.price}))})}
  async function copyRelease(id){const sale=getSale(id);if(!sale)return;if(sale.status!=='paid'){toastMsg('Mark the sale Paid first.');return}const tickets=getTickets(sale.id);if(!tickets.length){toastMsg('No paid tickets found for this sale.');return}const expected=expectedQty(sale,tickets);if(tickets.length!==expected){toastMsg(`Cannot release yet. Buyer paid for ${expected} ticket${expected===1?'':'s'}, but ${tickets.length} paid ticket${tickets.length===1?' is':'s are'} available. Issue the exact number first.`);return}const nums=tickets.map(t=>String(t.number||'').trim()),codes=tickets.map(t=>String(t.code||'').trim());if(nums.some(x=>!x)||new Set(nums).size!==nums.length||codes.some(x=>!x)||new Set(codes).size!==codes.length){toastMsg('Cannot release: every e-ticket must have its own Ticket No. and Verification Code.');return}const code=codeForSale(sale,tickets);try{await navigator.clipboard.writeText(code);toastMsg(`${tickets.length} buyer e-ticket${tickets.length===1?'':'s'} ready. Release Code copied.`)}catch(e){prompt(`Copy Buyer Ticket Release Code (${tickets.length} ticket${tickets.length===1?'':'s'}):`,code)}}
  function decorate(){
    const root=document.getElementById('simpleSellerTools');if(!root)return;
    root.querySelectorAll('.seller-tool-result').forEach(row=>{
      if(row.querySelector('.seller-release-code'))return;
      const statusBtn=row.querySelector('[data-sale-id]');if(!statusBtn)return;
      const sale=getSale(statusBtn.dataset.saleId);if(!sale||sale.status!=='paid')return;
      const actions=row.querySelector('.seller-tool-actions');if(!actions)return;
      const b=document.createElement('button');b.type='button';b.className='btn gold seller-release-code';b.textContent='Copy Buyer Ticket Release Code';b.dataset.saleId=sale.id;b.onclick=()=>copyRelease(sale.id);actions.appendChild(b);
    });
  }
  function init(){decorate();const target=document.getElementById('reports')||document.body;new MutationObserver(decorate).observe(target,{childList:true,subtree:true});setInterval(decorate,1200)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,300),{once:true});else setTimeout(init,300);
})();