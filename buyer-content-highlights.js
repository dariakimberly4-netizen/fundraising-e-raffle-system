(function(){
  const STYLE_ID='buyerContentHighlightStyle';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .buyer-content-new{position:relative!important;border:1px solid #e5c85a!important;background:linear-gradient(180deg,#fffdf2,#fff)!important;box-shadow:0 0 0 3px rgba(215,169,31,.10),0 10px 24px rgba(130,92,0,.08)!important}
      .buyer-content-new h3{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important}
      .buyer-inline-new{display:inline-flex!important;align-items:center!important;justify-content:center!important;padding:3px 7px!important;border-radius:999px!important;background:#ee3a16!important;color:#fff!important;font-size:9px!important;font-weight:950!important;line-height:1!important;letter-spacing:.05em!important}
      .buyer-action-new{position:relative!important;box-shadow:0 0 0 3px rgba(215,169,31,.18)!important;border:1px solid #d7a91f!important}
      .buyer-action-new:after{content:'NEW';position:absolute;right:-7px;top:-8px;background:#ee3a16;color:#fff;border-radius:999px;padding:3px 6px;font-size:8px;font-weight:950;line-height:1}
    `;
    document.head.appendChild(s);
  }
  function decorateSection(id){
    const section=document.getElementById(id);if(!section)return;
    const card=section.querySelector('.card');if(card&&!card.classList.contains('buyer-content-new')){
      card.classList.add('buyer-content-new');
      const h=card.querySelector('h3');
      if(h&&!h.querySelector('.buyer-inline-new')){const b=document.createElement('span');b.className='buyer-inline-new';b.textContent='NEW';h.appendChild(b)}
    }
  }
  function decorateActions(){
    ['buyerImportRelease','buyerContactOrganizer'].forEach(id=>document.getElementById(id)?.classList.add('buyer-action-new'));
    document.querySelectorAll('[data-share-ticket],[data-save-ticket]').forEach(el=>el.classList.add('buyer-action-new'));
  }
  function apply(){
    addStyle();
    ['tickets','paymentdetails','contact','rules'].forEach(decorateSection);
    decorateActions();
  }
  function init(){
    apply();
    const obs=new MutationObserver(()=>apply());
    obs.observe(document.body,{childList:true,subtree:true});
    setTimeout(apply,150);setTimeout(apply,600);setTimeout(apply,1400);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
