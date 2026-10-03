(function(){
  const KEY='gt27_buyer_visible_new_v1';
  const FEATURES={tickets:{label:'My E-Tickets',version:'v1'},paymentdetails:{label:'Payment Details & Status',version:'v1'},contact:{label:'Contact Organizer',version:'v1'},rules:{label:'Raffle Rules',version:'v1'}};
  function getSeen(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
  function saveSeen(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch(e){}}
  function target(view){return document.querySelector(`[data-native-view="${view}"]`)||document.querySelector(`.sideNav [data-view="${view}"]`)}
  function addStyle(){
    if(document.getElementById('buyerVisibleNewStyle'))return;
    const s=document.createElement('style');s.id='buyerVisibleNewStyle';s.textContent=`
      .buyer-visible-new{position:relative!important;border:2px solid #d7a91f!important;background:linear-gradient(135deg,#fffbe8,#fff1ad)!important;color:#6e5200!important;box-shadow:0 0 0 4px rgba(215,169,31,.18),0 8px 20px rgba(110,82,0,.12)!important}
      .buyer-visible-badge{display:inline-flex;align-items:center;justify-content:center;margin-left:8px;padding:4px 8px;border-radius:999px;background:#ee3a16;color:#fff;font-size:9px;font-weight:950;line-height:1;letter-spacing:.06em}
      .buyer-section-new{position:relative!important;border:2px solid #d7a91f!important;background:linear-gradient(180deg,#fffdf2,#fff 72%)!important;box-shadow:0 0 0 5px rgba(215,169,31,.14),0 12px 30px rgba(110,82,0,.10)!important}
    `;document.head.appendChild(s);
  }
  function markMenu(view){const el=target(view);if(!el)return;el.classList.add('buyer-visible-new');if(!el.querySelector('.buyer-visible-badge')){const b=document.createElement('span');b.className='buyer-visible-badge';b.textContent='NEW';el.appendChild(b)}}
  function showSectionHighlight(view){const sec=document.getElementById(view);const card=sec?.querySelector('.card');if(card)card.classList.add('buyer-section-new')}
  function clearMenu(view){const el=target(view);if(!el)return;el.classList.remove('buyer-visible-new');el.querySelector('.buyer-visible-badge')?.remove()}
  function bind(){
    addStyle();const seen=getSeen();
    Object.entries(FEATURES).forEach(([view,f])=>{
      if(seen[view]===f.version)return;
      markMenu(view);
      const el=target(view);if(!el||el.dataset.visibleNewBound)return;
      el.dataset.visibleNewBound='1';
      el.addEventListener('click',()=>{showSectionHighlight(view);const latest=getSeen();latest[view]=f.version;saveSeen(latest);clearMenu(view)});
    });
  }
  function init(){bind();setTimeout(bind,250);setTimeout(bind,800)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();