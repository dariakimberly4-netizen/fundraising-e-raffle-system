(function(){
  const KEY='gt27_buyer_visible_new_v1';
  const FEATURES={
    tickets:{label:'My E-Tickets',version:'v1'},
    paymentdetails:{label:'Payment Details & Status',version:'v1'},
    contact:{label:'Contact Organizer',version:'v1'},
    rules:{label:'Raffle Rules',version:'v1'}
  };
  function getSeen(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
  function saveSeen(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch(e){}}
  function addStyle(){
    if(document.getElementById('buyerVisibleNewStyle'))return;
    const s=document.createElement('style');s.id='buyerVisibleNewStyle';s.textContent=`
      .buyer-visible-new{position:relative!important;border:2px solid #d7a91f!important;background:linear-gradient(135deg,#fffbe8,#fff1ad)!important;color:#6e5200!important;box-shadow:0 0 0 4px rgba(215,169,31,.18),0 8px 20px rgba(110,82,0,.12)!important;animation:buyerVisiblePulse 1.8s ease-in-out infinite}
      .buyer-visible-new.active{background:linear-gradient(135deg,#246b2d,#3f8732)!important;color:#fff!important;border-color:#d7a91f!important}
      .buyer-visible-badge{display:inline-flex;align-items:center;justify-content:center;margin-left:8px;padding:4px 8px;border-radius:999px;background:#ee3a16;color:#fff;font-size:9px;font-weight:950;line-height:1;letter-spacing:.06em}
      .buyer-section-new{position:relative!important;border:2px solid #d7a91f!important;background:linear-gradient(180deg,#fffdf2,#fff 72%)!important;box-shadow:0 0 0 5px rgba(215,169,31,.14),0 12px 30px rgba(110,82,0,.10)!important}
      .buyer-section-new:before{content:'NEW FEATURE';display:inline-flex;margin-bottom:10px;padding:5px 9px;border-radius:999px;background:#ee3a16;color:#fff;font-size:10px;font-weight:950;letter-spacing:.08em}
      @keyframes buyerVisiblePulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
      @media(prefers-reduced-motion:reduce){.buyer-visible-new{animation:none!important}}
    `;document.head.appendChild(s);
  }
  function markMenu(view){
    const btn=document.querySelector(`.sideNav [data-view="${view}"]`);if(!btn)return;
    btn.classList.add('buyer-visible-new');
    if(!btn.querySelector('.buyer-visible-badge')){const b=document.createElement('span');b.className='buyer-visible-badge';b.textContent='NEW';btn.appendChild(b)}
  }
  function showSectionHighlight(view){
    const sec=document.getElementById(view);const card=sec?.querySelector('.card');if(card)card.classList.add('buyer-section-new');
  }
  function clearMenu(view){
    const btn=document.querySelector(`.sideNav [data-view="${view}"]`);if(!btn)return;
    btn.classList.remove('buyer-visible-new');btn.querySelector('.buyer-visible-badge')?.remove();
  }
  function loadBuyerNumberChoice(){
    if(document.getElementById('buyerNumberChoiceLoader'))return;
    const s=document.createElement('script');s.id='buyerNumberChoiceLoader';s.src='./buyer-number-choice.js?v=1&t='+Date.now();document.head.appendChild(s);
  }
  function loadBuyerMenuStructure(){
    if(document.getElementById('buyerMenuStructureLoader'))return;
    const s=document.createElement('script');s.id='buyerMenuStructureLoader';s.src='./buyer-menu-structure.js?v=1&t='+Date.now();document.head.appendChild(s);
  }
  function loadBuyerMenuFix(){
    if(document.getElementById('buyerMenuFixLoader'))return;
    const s=document.createElement('script');s.id='buyerMenuFixLoader';s.src='./buyer-menu-fix.js?v=2&t='+Date.now();document.head.appendChild(s);
  }
  function init(){
    loadBuyerMenuStructure();
    loadBuyerMenuFix();
    loadBuyerNumberChoice();
    addStyle();const seen=getSeen();
    Object.entries(FEATURES).forEach(([view,f])=>{
      if(seen[view]===f.version)return;
      markMenu(view);
      const btn=document.querySelector(`.sideNav [data-view="${view}"]`);if(!btn||btn.dataset.visibleNewBound)return;
      btn.dataset.visibleNewBound='1';
      btn.addEventListener('click',()=>{
        showSectionHighlight(view);
        const latest=getSeen();latest[view]=f.version;saveSeen(latest);
        clearMenu(view);
      });
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{setTimeout(init,80)},{once:true});else setTimeout(init,80);
})();
