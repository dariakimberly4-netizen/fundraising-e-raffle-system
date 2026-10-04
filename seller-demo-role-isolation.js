(function(){
  const KEY='gt27_demo_tx_v2';
  const $=id=>document.getElementById(id);
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function init(){
    document.documentElement.classList.add('seller-only-demo');
    const style=document.createElement('style');
    style.id='sellerOnlyDemoStyle';
    style.textContent='.seller-only-demo a[href*="buyer-demo.html"]{display:none!important}';
    document.head.appendChild(style);

    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='Seller workspace: review submitted requests, verify payment, and issue the exact number of e-tickets.';

    const empty=$('emptyCard');
    if(empty){
      const h=empty.querySelector('h2');
      const p=empty.querySelector('p');
      if(h)h.textContent='No Pending Buyer Request';
      if(p)p.textContent='Waiting for a submitted buyer request. Refresh this seller page when a new request arrives.';
      empty.querySelectorAll('a[href*="buyer-demo.html"]').forEach(a=>a.remove());
    }

    const done=$('doneCard');
    if(done){
      const notice=done.querySelector('.notice');
      if(notice)notice.textContent='E-tickets have been issued successfully. The buyer can see them from the buyer portal.';
      done.querySelectorAll('a[href*="buyer-demo.html"]').forEach(a=>a.remove());
    }

    const reject=$('rejectBtn');
    if(reject){
      reject.onclick=function(){
        const reason=prompt('Reason for returning the payment:','Payment proof or amount needs review.');
        if(reason===null)return;
        const d=read();if(!d)return alert('No buyer request found.');
        d.status='payment_issue';d.returnReason=reason||'Payment needs review.';d.returnedAt=new Date().toISOString();save(d);
        const payment=$('paymentCard');if(payment)payment.classList.add('hidden');
        const card=document.createElement('section');card.className='card';card.id='sellerReturnStatus';
        card.innerHTML='<h2 style="margin:0;color:var(--green);font-family:Georgia,serif">Payment Returned for Review</h2><div class="notice warn" style="margin-top:12px">The buyer request was returned for payment review. You can stay in the Seller Demo; the buyer will see the updated status in Buyer Follow-Up.</div>';
        document.querySelector('main')?.appendChild(card);
        setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'start'}),40);
      };
    }

    document.querySelectorAll('a[href*="buyer-demo.html"]').forEach(a=>a.remove());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
