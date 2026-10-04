(function(){
  const TX_KEY='gt27_demo_tx_v2';
  const HISTORY_KEY='gt27_demo_buyer_history_v1';
  const $=id=>document.getElementById(id);
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  function statusLabel(d){
    if(!d)return 'NO ACTIVE REQUEST';
    if(d.status==='submitted')return 'NEW REQUEST';
    if(d.status==='payment_issue')return 'RETURNED';
    if(d.status==='payment_verified')return 'READY TO ISSUE';
    if(d.status==='issued')return 'COMPLETED';
    return String(d.status||'PENDING').toUpperCase();
  }
  function isolateSeller(){
    document.documentElement.classList.add('seller-only-demo');
    if(!$('sellerOnlyDemoStyle')){const s=document.createElement('style');s.id='sellerOnlyDemoStyle';s.textContent='.seller-only-demo a[href*="buyer-demo.html"]{display:none!important}';document.head.appendChild(s);}
    const hero=document.querySelector('.hero p');if(hero)hero.textContent='Seller workspace: review submitted requests, verify payment, and issue the exact number of e-tickets.';
    const empty=$('emptyCard');if(empty){const h=empty.querySelector('h2'),p=empty.querySelector('p');if(h)h.textContent='No Pending Buyer Request';if(p)p.textContent='Waiting for a submitted buyer request. Refresh this seller page when a new request arrives.';empty.querySelectorAll('a[href*="buyer-demo.html"]').forEach(a=>a.remove());}
    const done=$('doneCard');if(done){const notice=done.querySelector('.notice');if(notice)notice.textContent='E-tickets have been issued successfully. The buyer can see them from the buyer portal.';done.querySelectorAll('a[href*="buyer-demo.html"]').forEach(a=>a.remove());}
    document.querySelectorAll('a[href*="buyer-demo.html"]').forEach(a=>a.remove());
    const reject=$('rejectBtn');
    if(reject&&!reject.dataset.sellerOnlyBound){reject.dataset.sellerOnlyBound='1';reject.onclick=function(){const reason=prompt('Reason for returning the payment:','Payment proof or amount needs review.');if(reason===null)return;const d=read(TX_KEY,null);if(!d)return alert('No buyer request found.');d.status='payment_issue';d.returnReason=reason||'Payment needs review.';d.returnedAt=new Date().toISOString();save(TX_KEY,d);$('paymentCard')?.classList.add('hidden');let card=$('sellerReturnStatus');if(!card){card=document.createElement('section');card.className='card';card.id='sellerReturnStatus';card.innerHTML='<h2 style="margin:0;color:var(--green);font-family:Georgia,serif">Payment Returned for Review</h2><div class="notice warn" style="margin-top:12px">The request was returned for payment review. Stay in the Seller Demo; the buyer will see the updated status in their follow-up view.</div>';document.querySelector('main')?.appendChild(card);}card.scrollIntoView({behavior:'smooth',block:'start'});renderQueue();};}
  }
  function renderQueue(){
    let card=$('sellerQueueCard');
    if(!card){
      card=document.createElement('section');card.className='card';card.id='sellerQueueCard';
      card.innerHTML='<h2 style="margin:0;color:var(--green);font-family:Georgia,serif">Seller Request Queue</h2><p class="small">Track new requests, payment review, ready-to-issue orders, and completed purchases.</p><div id="queueCounts" class="summary"></div><div id="queueList"></div>';
      const main=document.querySelector('main');const hero=document.querySelector('.hero');if(main&&hero)main.insertBefore(card,hero.nextSibling);else main?.prepend(card);
    }
    const d=read(TX_KEY,null),h=read(HISTORY_KEY,[]);
    const newReq=d?.status==='submitted'?1:0;
    const ready=d?.status==='payment_verified'?1:0;
    const returned=d?.status==='payment_issue'?1:0;
    const complete=h.length+(d?.status==='issued'?1:0);
    $('queueCounts').innerHTML='<div class="kv"><span>New Requests</span><b>'+newReq+'</b></div><div class="kv"><span>Ready to Issue</span><b>'+ready+'</b></div><div class="kv"><span>Returned</span><b>'+returned+'</b></div><div class="kv"><span>Completed</span><b>'+complete+'</b></div>';
    const list=$('queueList');if(!list)return;const rows=[];
    if(d){rows.push('<div class="summary"><div class="kv"><span>Request</span><b>'+(d.requestNo||'—')+'</b></div><div class="kv"><span>Buyer</span><b>'+(d.name||'—')+'</b></div><div class="kv"><span>Tickets</span><b>'+(d.qty||0)+'</b></div><div class="kv"><span>Status</span><b>'+statusLabel(d)+'</b></div></div>')}
    h.slice(0,8).forEach(o=>rows.push('<div class="summary"><div class="kv"><span>Request</span><b>'+(o.requestNo||'—')+'</b></div><div class="kv"><span>Tickets</span><b>'+(o.qty||0)+'</b></div><div class="kv"><span>Status</span><b>COMPLETED</b></div></div>'));
    list.innerHTML=rows.join('')||'<div class="notice warn">No requests yet.</div>';
  }
  function init(){isolateSeller();renderQueue();window.addEventListener('focus',()=>{isolateSeller();renderQueue()});window.addEventListener('storage',()=>{isolateSeller();renderQueue()})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('pageshow',isolateSeller);
})();