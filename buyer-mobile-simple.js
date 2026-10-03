(function(){
  const STYLE_ID='gt27BuyerMobileSimpleStyle';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .buyerSimpleNav{display:none}
      .buyerSingleBuy{display:none}
      @media(max-width:780px){
        html,body{overflow-y:auto!important;overflow-x:hidden!important;height:auto!important;min-height:100%!important;max-height:none!important;touch-action:pan-y!important;-webkit-overflow-scrolling:touch!important}
        .app{height:auto!important;min-height:100svh!important;max-height:none!important;overflow:visible!important;touch-action:pan-y!important}
        .shell,main.content{display:block!important;overflow:visible!important;height:auto!important;max-height:none!important}
        #menuBtn,.nativeBuyerMenu,#sidebar,#overlay,.buyerFixedNav{display:none!important}
        .topbar{position:sticky!important;top:0!important;z-index:1000!important}
        .buyerSimpleNav{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;position:sticky;top:76px;z-index:990;padding:9px 10px;background:#fff;border-bottom:1px solid #dfe8d9;pointer-events:auto!important}
        .buyerSimpleNav button{min-height:42px;border:1px solid #dfe8d9;border-radius:12px;background:#f4f8f1;color:#246b2d;font-size:12px;font-weight:900;padding:8px 6px;pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer}
        main.content .view{display:block!important;scroll-margin-top:196px;margin-bottom:18px!important}
        main.content .view:not(:first-child){border-top:1px solid #edf2ea;padding-top:8px}
        .nativeIntroCard,.buyerScrollIntro,.buyer-intro-cta{display:none!important}
        .buyerSingleBuy{display:flex!important;justify-content:center;margin:16px 0 4px}
        .buyerSingleBuy button{min-height:50px;border:0;border-radius:14px;background:#ee3a16;color:#fff;font-weight:950;font-size:15px;padding:13px 20px;pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer}
        #introduction .actions a[href="#buy"],#introduction .actions button[data-route="buy"],#introduction a.introBuyNow{display:none!important}
      }
      @media(max-width:390px){.buyerSimpleNav{grid-template-columns:repeat(2,minmax(0,1fr))}.buyerSimpleNav button{font-size:11px}}
    `;
    document.head.appendChild(s);
  }

  function scrollToSection(id){
    const target=document.getElementById(id);
    if(!target)return;
    target.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function buildNav(){
    if(document.getElementById('buyerSimpleNav'))return;
    const header=document.querySelector('.topbar');
    if(!header)return;
    const nav=document.createElement('nav');
    nav.id='buyerSimpleNav';
    nav.className='buyerSimpleNav';
    nav.setAttribute('aria-label','Buyer sections');
    nav.innerHTML=`
      <button type="button" data-go="introduction">Introduction</button>
      <button type="button" data-go="request">My Request</button>
      <button type="button" data-go="tickets">My E-Tickets</button>
      <button type="button" data-go="paymentdetails">Payment</button>
      <button type="button" data-go="draw">Raffle Info</button>
      <button type="button" data-go="howitworks">Help</button>`;
    header.insertAdjacentElement('afterend',nav);
    nav.addEventListener('click',e=>{
      const b=e.target.closest('button[data-go]');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      scrollToSection(b.dataset.go);
    },true);
  }

  function singleBuyButton(){
    const hero=document.querySelector('#introduction .hero');
    if(!hero||document.getElementById('buyerSingleBuy'))return;
    const wrap=document.createElement('div');
    wrap.id='buyerSingleBuy';
    wrap.className='buyerSingleBuy';
    wrap.innerHTML='<button type="button">BUY RAFFLE TICKET</button>';
    hero.appendChild(wrap);
    wrap.querySelector('button').addEventListener('click',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      scrollToSection('buy');
    },true);
  }

  function init(){
    addStyle();
    buildNav();
    singleBuyButton();
    document.querySelectorAll('.view').forEach(v=>{if(matchMedia('(max-width:780px)').matches)v.style.removeProperty('display')});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
