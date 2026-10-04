(function(){
  const $=id=>document.getElementById(id);
  function init(){
    if(!document.getElementById('buyerSimpleFlowStyle')){
      const style=document.createElement('style');
      style.id='buyerSimpleFlowStyle';
      style.textContent=`
        .buyer-simple-flow .hero{padding:28px 18px!important;background:linear-gradient(180deg,#fffdf6 0%,#f7fbf4 100%)!important}
        .buyer-simple-flow .hero .steps{grid-template-columns:repeat(4,1fr)!important;margin-top:18px!important}
        .buyer-simple-flow .hero .step.seller{display:none!important}
        .buyer-simple-flow .hero .eyebrow{margin-top:14px!important}
        .buyer-simple-flow .hero h1{font-size:40px!important;margin:10px 0 6px!important}
        .buyer-simple-flow .hero .buyerIntroHeadline{font-family:Georgia,"Times New Roman",serif;color:var(--green);font-size:24px;font-weight:900;line-height:1.12;margin:10px 0 7px}
        .buyer-simple-flow .hero .buyerIntroCopy{max-width:560px;margin:0 auto;color:#41543d;line-height:1.58;font-size:14px}
        .buyer-simple-flow .hero .buyerIntroSupport{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-top:14px;padding:8px 12px;border-radius:999px;background:#fff4cb;border:1px solid #ead58b;color:#735600;font-size:11px;font-weight:900}
        .buyer-simple-flow a[href*="seller-demo"]{display:none!important}
        .buyer-simple-flow #purchaseHistoryCard{display:none!important}
        .buyer-simple-flow #historyBtn{display:none!important}
        .buyer-simple-flow .simpleFollowStep{display:flex!important}
        .buyer-simple-flow #followUpCard{border:2px solid var(--green)!important;box-shadow:0 12px 28px rgba(36,107,45,.12)!important}
        .buyer-simple-flow #followUpCard h2{font-size:26px!important}
        .buyer-simple-flow #heroFollowUpBtn{background:#eef5e9!important;border:2px solid var(--green)!important;color:var(--green)!important}
        .buyer-simple-flow .paymentDestination{margin:12px 0 14px;padding:15px;border:2px solid var(--green);border-radius:16px;background:#eef7ea;text-align:center;color:#223022}
        .buyer-simple-flow .paymentDestination .payLead{font-size:13px;font-weight:800;color:#40523d}
        .buyer-simple-flow .paymentDestination .payNumber{margin-top:5px;font-size:24px;font-weight:1000;color:var(--green);letter-spacing:.02em}
        .buyer-simple-flow .paymentDestination .payName{margin-top:3px;font-size:15px;font-weight:950;color:var(--red)}
        .buyer-simple-flow .paymentDestination .payNote{margin-top:8px;font-size:11px;color:#687466;line-height:1.45}
        @media(max-width:640px){.buyer-simple-flow .hero{padding:24px 16px!important}.buyer-simple-flow .hero h1{font-size:34px!important}.buyer-simple-flow .hero .buyerIntroHeadline{font-size:21px}.buyer-simple-flow .hero .steps{grid-template-columns:1fr!important}.buyer-simple-flow .hero .step{display:flex!important}.buyer-simple-flow .hero .step.seller{display:none!important}.buyer-simple-flow .paymentDestination .payNumber{font-size:22px}}
      `;
      document.head.appendChild(style);
    }
    document.documentElement.classList.add('buyer-simple-flow');

    const hero=document.querySelector('.hero');
    if(hero){
      hero.classList.add('hidden');
      const start=$('startBtn');
      if(start)start.textContent='NEW BUY';
    }
    const buy=$('buyCard');
    if(buy){
      buy.classList.remove('hidden');
      const h=buy.querySelector('h2');
      if(h)h.textContent='Buyer Information';
    }

    const pay=$('payCard');
    if(pay && !$('paymentDestination')){
      const box=document.createElement('div');
      box.id='paymentDestination';
      box.className='paymentDestination';
      box.innerHTML='<div class="payLead">Please send your payment through:</div><div class="payNumber">09190916041</div><div class="payName">Kimberly Daria</div><div class="payNote">After sending your payment, enter the transaction/reference number below and upload your payment proof.</div>';
      const heading=pay.querySelector('h2');
      if(heading)heading.insertAdjacentElement('afterend',box); else pay.prepend(box);
    }

    const submitted=$('submittedCard');
    if(submitted){
      const h=submitted.querySelector('h2');
      if(h)h.textContent='Request Submitted';
      const n=submitted.querySelector('.notice');
      if(n)n.textContent='Your request was sent. Use Follow Up to check whether payment is verified and whether your e-tickets are ready.';
      submitted.querySelectorAll('a[href*="seller-demo"]').forEach(a=>a.remove());
      if(!$('submittedFollowUpBtn')){
        const b=document.createElement('button');
        b.id='submittedFollowUpBtn';b.type='button';b.className='btn green full';b.style.marginTop='12px';b.textContent='FOLLOW UP MY REQUEST';
        b.onclick=function(){const f=$('followUpCard');if(f){f.classList.remove('hidden');f.scrollIntoView({behavior:'smooth',block:'start'});$('followUpRefresh')?.click();}};
        submitted.appendChild(b);
      }
    }

    const follow=$('followUpCard');
    if(follow){
      const h=follow.querySelector('h2');if(h)h.textContent='4. Follow Up My Request';
      const p=follow.querySelector('p');if(p)p.textContent='Check your latest status here. You do not need to open the seller side.';
    }

    const ready=$('readyCard');
    if(ready){
      const h=ready.querySelector('h2');if(h)h.textContent='My E-Tickets';
      const n=ready.querySelector('.notice');if(n)n.textContent='Your payment was verified and your e-tickets are ready.';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
  window.addEventListener('pageshow',init);
})();