(function(){
  const $=id=>document.getElementById(id);
  function init(){
    document.documentElement.classList.add('buyer-only-demo');
    const style=document.createElement('style');
    style.id='buyerOnlyDemoStyle';
    style.textContent='.buyer-only-demo .hero .steps{grid-template-columns:repeat(3,1fr)!important}.buyer-only-demo .hero .step.seller{display:none!important}.buyer-only-demo a[href*="seller-demo.html"]{display:none!important}@media(max-width:640px){.buyer-only-demo .hero .steps{grid-template-columns:1fr!important}}';
    document.head.appendChild(style);

    const brand=document.querySelector('.brand');
    if(brand&&brand.firstChild)brand.firstChild.textContent='Buyer Demo';
    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='Buy raffle tickets, submit payment, follow up your request, and view your issued e-tickets here.';

    const submitted=$('submittedCard');
    if(submitted){
      const h=submitted.querySelector('h2');
      const notice=submitted.querySelector('.notice');
      if(h)h.textContent='Request Submitted';
      if(notice)notice.textContent='Your request has been submitted. Use Buyer Follow-Up to check the status of your payment and e-tickets.';
      const status=[...submitted.querySelectorAll('.kv')].find(x=>x.querySelector('span')?.textContent.trim()==='Status');
      if(status?.querySelector('b'))status.querySelector('b').textContent='SUBMITTED — CHECK FOLLOW-UP';
    }

    const ready=$('readyCard');
    if(ready){
      const notice=ready.querySelector('.notice');
      if(notice)notice.textContent='Your e-tickets are ready. Open and keep each ticket for the raffle.';
    }

    document.querySelectorAll('a[href*="seller-demo.html"]').forEach(a=>a.remove());
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
