(function(){
  const STORAGE='gt27_seen_buyer_features_v1';
  const FEATURES=[
    {selector:'.sideNav [data-view="buy"]',key:'buy-tickets-v2'},
    {selector:'.sideNav [data-view="request"]',key:'my-request-v2'},
    {selector:'.sideNav [data-view="payment"]',key:'payment-guide-v2'}
  ];

  function getSeen(){
    try{return JSON.parse(localStorage.getItem(STORAGE)||'{}')||{}}catch(e){return {}}
  }
  function saveSeen(seen){
    try{localStorage.setItem(STORAGE,JSON.stringify(seen))}catch(e){}
  }
  function ensureStyle(){
    if(document.getElementById('gt27NewFeatureStyle'))return;
    const s=document.createElement('style');
    s.id='gt27NewFeatureStyle';
    s.textContent=`
      .gt27-new-feature{position:relative!important;border-color:#d7a91f!important;background:#fff8dc!important;box-shadow:0 0 0 2px rgba(215,169,31,.20),0 8px 22px rgba(215,169,31,.16)!important;animation:gt27NewPulse 2.2s ease-in-out infinite}
      .gt27-new-feature.active{background:#246b2d!important;color:#fff!important;border-color:#d7a91f!important}
      .gt27-new-badge{float:right;display:inline-flex;align-items:center;justify-content:center;margin-left:8px;padding:3px 7px;border-radius:999px;background:#ee3a16;color:#fff;font-size:9px;font-weight:950;letter-spacing:.08em;line-height:1.1;box-shadow:0 2px 7px rgba(238,58,22,.22)}
      .gt27-new-feature.active .gt27-new-badge{background:#d7a91f;color:#3f3500}
      @keyframes gt27NewPulse{0%,100%{box-shadow:0 0 0 2px rgba(215,169,31,.18),0 8px 22px rgba(215,169,31,.12)}50%{box-shadow:0 0 0 5px rgba(215,169,31,.09),0 10px 26px rgba(215,169,31,.20)}}
      @media (prefers-reduced-motion:reduce){.gt27-new-feature{animation:none!important}}
    `;
    document.head.appendChild(s);
  }
  function clearFeature(el,key){
    const seen=getSeen();
    seen[key]=Date.now();
    saveSeen(seen);
    el.classList.remove('gt27-new-feature');
    el.querySelector('.gt27-new-badge')?.remove();
  }
  function apply(){
    ensureStyle();
    const seen=getSeen();
    FEATURES.forEach(f=>{
      const el=document.querySelector(f.selector);
      if(!el||seen[f.key])return;
      el.classList.add('gt27-new-feature');
      if(!el.querySelector('.gt27-new-badge')){
        const badge=document.createElement('span');
        badge.className='gt27-new-badge';
        badge.textContent='NEW';
        el.appendChild(badge);
      }
      el.addEventListener('click',()=>clearFeature(el,f.key),{once:true});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
