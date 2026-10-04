(function(){
  const TX_KEY='gt27_demo_tx_v2';
  const HISTORY_KEY='gt27_demo_buyer_history_v1';
  const $=id=>document.getElementById(id);
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}};
  function statusLabel(d){
    if(!d)return 'NO ACTIVE REQUEST';
    if(d.status==='submitted')return 'NEW REQUEST';
    if(d.status==='payment_issue')return 'RETURNED';
    if(d.status==='payment_verified')return 'READY TO ISSUE';
    if(d.status==='issued')return 'COMPLETED';
    return String(d.status||'PENDING').toUpperCase();
  }
  function renderQueue(){
    let card=$('sellerQueueCard');
    if(!card){
      card=document.createElement('section');card.className='card';card.id='sellerQueueCard';
      card.innerHTML='<h2 style="margin:0;color:var(--green);font-family:Georgia,serif">Seller Request Queue</h2><p class="small">Track new requests, payment review, ready-to-issue orders, and completed purchases.</p><div id="queueCounts" class="summary"></div><div id="queueList"></div>';
      const main=document.querySelector('main');const hero=document.querySelector('.hero');if(main&&hero)main.insertBefore(card,hero.nextSibling);else main?.prepend(card);
    }
    const d=read(TX_KEY,null),h=read(HISTORY_KEY,[]);
    const active=d&&d.status!=='issued'?1:0;
    const newReq=d?.status==='submitted'?1:0;
    const ready=d?.status==='payment_verified'?1:0;
    const returned=d?.status==='payment_issue'?1:0;
    const complete=h.length+(d?.status==='issued'?1:0);
    $('queueCounts').innerHTML='<div class="kv"><span>New Requests</span><b>'+newReq+'</b></div><div class="kv"><span>Ready to Issue</span><b>'+ready+'</b></div><div class="kv"><span>Returned</span><b>'+returned+'</b></div><div class="kv"><span>Completed</span><b>'+complete+'</b></div>';
    const list=$('queueList');
    if(!list)return;
    const rows=[];
    if(d){rows.push('<div class="summary"><div class="kv"><span>Request</span><b>'+(d.requestNo||'—')+'</b></div><div class="kv"><span>Buyer</span><b>'+(d.name||'—')+'</b></div><div class="kv"><span>Tickets</span><b>'+(d.qty||0)+'</b></div><div class="kv"><span>Status</span><b>'+statusLabel(d)+'</b></div></div>')}
    h.slice(0,8).forEach(o=>rows.push('<div class="summary"><div class="kv"><span>Request</span><b>'+(o.requestNo||'—')+'</b></div><div class="kv"><span>Tickets</span><b>'+(o.qty||0)+'</b></div><div class="kv"><span>Status</span><b>COMPLETED</b></div></div>'));
    list.innerHTML=rows.join('')||'<div class="notice warn">No requests yet.</div>';
  }
  function init(){renderQueue();window.addEventListener('focus',renderQueue);window.addEventListener('storage',renderQueue)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
