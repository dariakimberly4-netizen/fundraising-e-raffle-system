(function(){
  const STYLE_ID='gt27BuyerScrollFixV1';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .app{overflow-y:auto!important;-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important;overscroll-behavior-y:contain!important}
      .buyerFixedNav{display:none}
      @media(max-width:780px){
        #menuBtn,.nativeBuyerMenu,#sidebar,#overlay{display:none!important}
        .app{height:100svh;max-height:100svh;min-height:100svh}
        .topbar{position:sticky!important;top:0!important;z-index:1000!important;flex:0 0 auto!important}
        .buyerFixedNav{display:flex;position:sticky;top:76px;z-index:990;gap:8px;width:100%;overflow-x:auto;overflow-y:hidden;padding:9px 10px;background:#fff;border-bottom:1px solid #dfe8d9;-webkit-overflow-scrolling:touch;scrollbar-width:none;flex:0 0 auto}
        .buyerFixedNav::-webkit-scrollbar{display:none}
        .buyerFixedNav a{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:9px 13px;border:1px solid #dfe8d9;border-radius:999px;background:#f4f8f1;color:#246b2d;text-decoration:none;font-size:13px;font-weight:900;touch-action:manipulation;pointer-events:auto!important}
        .shell{display:block!important;min-height:auto!important;overflow:visible!important}
        main.content{display:block!important;overflow:visible!important;padding-top:14px!important}
        main.content .view{display:block!important;scroll-margin-top:138px;margin-bottom:18px!important}
        main.content:has(.view:target) .view{display:block!important}
        main.content .view:target{display:block!important}
        main.content .view:not(:first-child){border-top:1px solid #edf2ea;padding-top:8px}
      }
    `;
    document.head.appendChild(s);
  }

  function nav(){
    if(document.getElementById('buyerFixedNav'))return;
    const header=document.querySelector('.topbar');
    if(!header)return;
    const n=document.createElement('nav');
    n.id='buyerFixedNav';
    n.className='buyerFixedNav';
    n.setAttribute('aria-label','Buyer sections');
    n.innerHTML=`
      <a href="#introduction" data-scroll-section="introduction">Introduction</a>
      <a href="#buy" data-scroll-section="buy">Buy Tickets</a>
      <a href="#request" data-scroll-section="request">My Request</a>
      <a href="#tickets" data-scroll-section="tickets">My E-Tickets</a>
      <a href="#paymentdetails" data-scroll-section="paymentdetails">Payment</a>
      <a href="#draw" data-scroll-section="draw">Raffle Info</a>
      <a href="#howitworks" data-scroll-section="howitworks">Help</a>`;
    header.insertAdjacentElement('afterend',n);

    n.addEventListener('click',e=>{
      const a=e.target.closest('[data-scroll-section]');
      if(!a)return;
      e.preventDefault();
      e.stopPropagation();
      const id=a.dataset.scrollSection;
      const target=document.getElementById(id);
      if(!target)return;
      if(id==='tickets'&&typeof window.renderTickets==='function')try{window.renderTickets()}catch(_){}
      target.scrollIntoView({behavior:'smooth',block:'start'});
      try{history.replaceState(null,'','#'+id)}catch(_){}
    });
  }

  function intro(){
    const hero=document.querySelector('#introduction .hero');
    if(!hero||hero.querySelector('.buyerScrollIntro'))return;
    const box=document.createElement('div');
    box.className='buyerScrollIntro';
    box.style.cssText='margin-top:14px;padding:15px 16px;border:1px solid #dce9d6;border-radius:16px;background:#f7fbf4;color:#355336;line-height:1.6;text-align:center';
    box.innerHTML='<b style="color:#246b2d">Welcome to the GET TOGETHER 2027 Fundraising E-Raffle.</b><br>This fundraising raffle is open to supporters, even if you are not attending the event. Choose your tickets, enter your details and payment information, then submit your request. After confirmation, you will receive the exact number of official e-tickets you purchased.';
    const existing=hero.querySelector('.nativeIntroCard');
    if(existing)existing.style.display='none';
    const title=hero.querySelector('h2');
    title?title.insertAdjacentElement('afterend',box):hero.prepend(box);
  }

  function init(){
    addStyle();
    nav();
    intro();
    const app=document.querySelector('.app');
    if(app){
      app.style.webkitOverflowScrolling='touch';
      app.style.touchAction='pan-y';
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
