(function(){
  const KEY='gt27_seller_overview_emphasis_seen_v1';
  const V={recent:'recent-sales-v3',pending:'pending-payments-v3'};
  function seen(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
  function save(x){try{localStorage.setItem(KEY,JSON.stringify(x))}catch(e){}}
  function addStyle(){
    if(document.getElementById('sellerOverviewEmphasisStyle'))return;
    const s=document.createElement('style');s.id='sellerOverviewEmphasisStyle';s.textContent=`
      #sellerNewOverviewBanner{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:14px 0 10px;padding:13px 14px;border:2px solid #d7a91f;border-radius:16px;background:#fff2a8;box-shadow:0 0 0 4px rgba(215,169,31,.18),0 10px 26px rgba(110,79,0,.14);color:#5f4600;font-weight:900;animation:sellerBannerPulse 1.4s ease-in-out infinite}
      #sellerNewOverviewBanner b{color:#ee3a16;letter-spacing:.05em}
      #sellerNewOverviewBanner button{border:0;border-radius:999px;padding:9px 12px;background:#246b2d;color:#fff;font-weight:900;white-space:nowrap}
      #sellerSalesOverview .seller-force-new{position:relative!important;border:4px solid #d7a91f!important;background:linear-gradient(135deg,#fffbe3,#fff2b4)!important;box-shadow:0 0 0 6px rgba(215,169,31,.22),0 14px 34px rgba(91,65,0,.18)!important;animation:sellerCardPulse 1.35s ease-in-out infinite}
      #sellerSalesOverview .seller-force-new:before{content:'NEW';position:absolute;top:-12px;right:14px;z-index:4;background:#ee3a16;color:#fff;border:3px solid #fff;border-radius:999px;padding:6px 10px;font-size:11px;font-weight:950;letter-spacing:.08em;box-shadow:0 5px 14px rgba(238,58,22,.28)}
      #sellerSalesOverview .seller-force-new h3{color:#7d5d00!important;padding-right:58px!important}
      #sellerSalesOverview .seller-new-note{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:9px 0 2px;padding:9px 10px;border-radius:12px;background:#fff;color:#6c5200;border:1px solid #e7cc67;font-size:11px;font-weight:900}
      #sellerSalesOverview .seller-new-note button{border:0;border-radius:999px;background:#ee3a16;color:#fff;padding:7px 9px;font-size:10px;font-weight:950}
      @keyframes sellerCardPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.008)}}
      @keyframes sellerBannerPulse{0%,100%{box-shadow:0 0 0 4px rgba(215,169,31,.18),0 10px 26px rgba(110,79,0,.14)}50%{box-shadow:0 0 0 8px rgba(215,169,31,.10),0 12px 30px rgba(110,79,0,.18)}}
      @media(max-width:760px){#sellerNewOverviewBanner{align-items:flex-start;flex-direction:column}#sellerNewOverviewBanner button{width:100%}}
      @media(prefers-reduced-motion:reduce){#sellerNewOverviewBanner,#sellerSalesOverview .seller-force-new{animation:none!important}}
    `;document.head.appendChild(s);
  }
  function dismiss(kind){
    const x=seen();x[kind]=V[kind];save(x);apply();
  }
  function decorate(card,kind,label){
    if(!card)return;
    const x=seen();const isNew=x[kind]!==V[kind];
    card.classList.toggle('seller-force-new',isNew);
    let note=card.querySelector('.seller-new-note');
    if(isNew){
      if(!note){
        note=document.createElement('div');note.className='seller-new-note';
        note.innerHTML=`<span>NEW SELLER FEATURE • ${label}</span><button type="button">GOT IT</button>`;
        const p=card.querySelector('.note');p?.after(note);
        note.querySelector('button').onclick=e=>{e.stopPropagation();dismiss(kind)};
      }
    }else note?.remove();
  }
  function apply(){
    addStyle();
    const wrap=document.getElementById('sellerSalesOverview');
    if(!wrap)return false;
    const x=seen();
    decorate(document.getElementById('sellerRecentSalesCard'),'recent','Recent Sales');
    decorate(document.getElementById('sellerPendingPaymentsCard'),'pending','Pending Payments');
    const anyNew=x.recent!==V.recent||x.pending!==V.pending;
    let banner=document.getElementById('sellerNewOverviewBanner');
    if(anyNew){
      if(!banner){
        banner=document.createElement('div');banner.id='sellerNewOverviewBanner';
        banner.innerHTML='<div><b>NEW SELLER FEATURES</b><div style="margin-top:3px;font-size:12px">Recent Sales + Pending Payments are now on your Dashboard.</div></div><button type="button">SHOW ME</button>';
        wrap.parentNode.insertBefore(banner,wrap);
        banner.querySelector('button').onclick=()=>wrap.scrollIntoView({behavior:'smooth',block:'center'});
      }
    }else banner?.remove();
    return true;
  }
  function init(){
    let tries=0;const timer=setInterval(()=>{tries++;if(apply()||tries>30)clearInterval(timer)},150);
    setTimeout(apply,900);setTimeout(apply,1800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
