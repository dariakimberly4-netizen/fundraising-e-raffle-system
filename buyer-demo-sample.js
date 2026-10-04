(function(){
  const $=id=>document.getElementById(id);
  function isolateBuyer(){
    document.documentElement.classList.add('buyer-only-demo');
    if(!$('buyerOnlyDemoStyle')){
      const style=document.createElement('style');style.id='buyerOnlyDemoStyle';
      style.textContent='.buyer-only-demo .hero .steps{grid-template-columns:repeat(3,1fr)!important}.buyer-only-demo .hero .step.seller{display:none!important}.buyer-only-demo a[href*="seller-demo.html"]{display:none!important}@media(max-width:640px){.buyer-only-demo .hero .steps{grid-template-columns:1fr!important}}';
      document.head.appendChild(style);
    }
    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='Buy raffle tickets, submit payment, follow up your request, and view your issued e-tickets here.';
    const submitted=$('submittedCard');
    if(submitted){
      const h=submitted.querySelector('h2');const notice=submitted.querySelector('.notice');
      if(h)h.textContent='Request Submitted';
      if(notice)notice.textContent='Your request has been submitted. Use Buyer Follow-Up to check your payment and e-ticket status.';
      const status=[...submitted.querySelectorAll('.kv')].find(x=>x.querySelector('span')?.textContent.trim()==='Status');
      if(status?.querySelector('b'))status.querySelector('b').textContent='SUBMITTED — CHECK FOLLOW-UP';
    }
    const ready=$('readyCard');
    if(ready){const notice=ready.querySelector('.notice');if(notice)notice.textContent='Your e-tickets are ready. Open and keep each ticket for the raffle.';}
    document.querySelectorAll('a[href*="seller-demo.html"]').forEach(a=>a.remove());
  }
  function init(){
    const buy=$('buyCard');
    if(buy&&!$('loadSampleBuyer')){
      const box=document.createElement('div');
      box.className='notice ok';
      box.style.margin='12px 0';
      box.innerHTML='<b>Sample Buyer</b><br>Use Maria Santos to quickly test the buyer purchase flow.<button id="loadSampleBuyer" class="btn secondary full" type="button" style="margin-top:10px">USE SAMPLE BUYER — MARIA SANTOS</button>';
      const firstForm=buy.querySelector('.grid');
      if(firstForm)buy.insertBefore(box,firstForm);else buy.appendChild(box);
      $('loadSampleBuyer').onclick=function(){
        const values={name:'Maria Santos',contact:'0917 000 2027',email:'maria.santos@example.com',referred:'PD Warriors Demo',source:'Demo'};
        Object.entries(values).forEach(([id,val])=>{const el=$(id);if(el)el.value=val;});
        const method=$('method');if(method)method.value='GCash';
        this.textContent='SAMPLE BUYER LOADED';
        setTimeout(()=>$('name')?.focus(),80);
      };
    }
    isolateBuyer();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('pageshow',isolateBuyer);
})();