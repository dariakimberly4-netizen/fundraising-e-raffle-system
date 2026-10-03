(function(){
  const STYLE_ID='sellerForceHighlightStyleV1';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .seller-force-new{position:relative!important;border:3px solid #d7a91f!important;box-shadow:0 0 0 5px rgba(215,169,31,.24),0 10px 26px rgba(112,82,0,.20)!important;background:linear-gradient(135deg,#fffceb,#ffe99b)!important;color:#5f4700!important;overflow:visible!important;z-index:3!important}
      .seller-force-new .seller-force-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;margin-left:7px!important;padding:4px 7px!important;border-radius:999px!important;background:#ee3a16!important;color:#fff!important;font-size:9px!important;font-weight:950!important;line-height:1!important;letter-spacing:.06em!important;vertical-align:middle!important}
      button.seller-force-new{padding-right:12px!important;animation:sellerForcePulse 1.7s ease-in-out infinite!important}
      #sellerTodaySummary.seller-force-new{animation:sellerForceCardPulse 1.9s ease-in-out infinite!important}
      #nav button[data-view="tickets"].seller-force-new{background:linear-gradient(135deg,#fff1a8,#ffd95f)!important;color:#5f4700!important;border:3px solid #d7a91f!important}
      #nav button[data-view="tickets"].seller-force-new.active{background:#246b2d!important;color:#fff!important;border-color:#d7a91f!important}
      @keyframes sellerForcePulse{0%,100%{box-shadow:0 0 0 5px rgba(215,169,31,.24),0 10px 26px rgba(112,82,0,.20)}50%{box-shadow:0 0 0 9px rgba(215,169,31,.11),0 12px 30px rgba(112,82,0,.26)}}
      @keyframes sellerForceCardPulse{0%,100%{box-shadow:0 0 0 5px rgba(215,169,31,.24),0 12px 30px rgba(112,82,0,.18)}50%{box-shadow:0 0 0 9px rgba(215,169,31,.10),0 15px 36px rgba(112,82,0,.24)}}
      @media(prefers-reduced-motion:reduce){button.seller-force-new,#sellerTodaySummary.seller-force-new{animation:none!important}}
    `;
    document.head.appendChild(s);
  }
  function badge(el,label='NEW'){
    if(!el)return;
    el.classList.add('seller-force-new');
    if(!el.querySelector(':scope > .seller-force-badge')){
      const b=document.createElement('span');
      b.className='seller-force-badge';
      b.textContent=label;
      el.appendChild(b);
    }
  }
  function apply(){
    addStyle();
    const today=document.getElementById('sellerTodaySummary');
    if(today){
      today.classList.add('seller-force-new');
      const h=today.querySelector('h3');
      if(h)badge(h,'NEW');
    }
    document.querySelectorAll('[data-void-sale]').forEach(b=>badge(b,'NEW'));
    document.querySelectorAll('[data-resend-release]').forEach(b=>badge(b,'NEW'));
    document.querySelectorAll('#ticketList button[onclick*="voidTicket"]').forEach(b=>badge(b,'NEW'));
    const ticketNav=document.querySelector('#nav button[data-view="tickets"]');
    if(ticketNav)badge(ticketNav,'NEW');
  }
  function init(){
    apply();
    setTimeout(apply,250);setTimeout(apply,700);setTimeout(apply,1400);
    new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});
    setInterval(apply,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();