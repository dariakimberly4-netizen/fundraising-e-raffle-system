(function(){
  const $=id=>document.getElementById(id);
  function init(){
    if(document.getElementById('buyerSimpleFlowStyle'))return;
    const style=document.createElement('style');
    style.id='buyerSimpleFlowStyle';
    style.textContent=`
      .buyer-simple-flow .hero .steps{grid-template-columns:repeat(4,1fr)!important}
      .buyer-simple-flow .hero .step.seller{display:none!important}
      .buyer-simple-flow a[href*="seller-demo"]{display:none!important}
      .buyer-simple-flow #purchaseHistoryCard{display:none!important}
      .buyer-simple-flow #historyBtn{display:none!important}
      .buyer-simple-flow .simpleFollowStep{display:flex!important}
      .buyer-simple-flow #followUpCard{border:2px solid var(--green)!important;box-shadow:0 12px 28px rgba(36,107,45,.12)!important}
      .buyer-simple-flow #followUpCard h2{font-size:26px!important}
      .buyer-simple-flow #heroFollowUpBtn{background:#eef5e9!important;border:2px solid var(--green)!important;color:var(--green)!important}
      @media(max-width:640px){.buyer-simple-flow .hero .steps{grid-template-columns:1fr!important}.buyer-simple-flow .hero .step{display:flex!important}.buyer-simple-flow .hero .step.seller{display:none!important}}
    `;
    document.head.appendChild(style);
    document.documentElement.classList.add('buyer-simple-flow');

    const hero=document.querySelector('.hero');
    if(hero){
      const p=hero.querySelector('p');
      if(p)p.textContent='Simple buyer flow: buy your raffle ticket, pay, review and submit, then follow up until your e-tickets are ready.';
      const steps=hero.querySelector('.steps');
      if(steps && !steps.querySelector('.simpleFollowStep')){
        const s=document.createElement('div');
        s.className='step simpleFollowStep';
        s.innerHTML='<b>4</b>FOLLOW UP';
        steps.appendChild(s);
      }
      const start=$('startBtn');
      if(start)start.textContent='BUY RAFFLE TICKET';
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