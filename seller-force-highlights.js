(function(){
  const AUTH_KEY='gt27_seller_auth_v1';
  if(sessionStorage.getItem(AUTH_KEY)!=='1'){
    location.replace('./seller-login.html');
    return;
  }

  const STYLE_ID='sellerForceHighlightStyleV3';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .seller-force-new{position:relative!important;border:4px solid #d7a91f!important;outline:4px solid rgba(238,58,22,.18)!important;outline-offset:2px!important;box-shadow:0 0 0 8px rgba(215,169,31,.25),0 14px 34px rgba(112,82,0,.24)!important;background:linear-gradient(135deg,#fff9b8,#ffd85a)!important;color:#4f3b00!important;overflow:visible!important;z-index:8!important}
      .seller-force-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;margin-left:8px!important;padding:6px 9px!important;border-radius:999px!important;background:#ee3a16!important;color:#fff!important;font-size:10px!important;font-weight:950!important;line-height:1!important;letter-spacing:.07em!important;vertical-align:middle!important;box-shadow:0 5px 12px rgba(238,58,22,.28)!important}
      button.seller-force-new{animation:sellerForcePulse 1.15s ease-in-out infinite!important;font-weight:950!important}
      #sellerTodaySummary.seller-force-new,#sellerDuplicateNotice.seller-force-new{animation:sellerForceCardPulse 1.35s ease-in-out infinite!important}
      #sellerTodaySummary.seller-force-new:before,#sellerDuplicateNotice.seller-force-new:before{content:'NEW FEATURE';position:absolute!important;top:10px!important;right:10px!important;z-index:20!important;background:#ee3a16!important;color:#fff!important;border-radius:999px!important;padding:7px 10px!important;font-size:9px!important;font-weight:950!important;letter-spacing:.08em!important;line-height:1!important}
      #nav button.seller-force-new{background:linear-gradient(135deg,#fff1a8,#ffd24b)!important;color:#4f3b00!important;border:4px solid #d7a91f!important;box-shadow:0 0 0 6px rgba(215,169,31,.22)!important}
      #nav button.seller-force-new.active{background:#246b2d!important;color:#fff!important;border-color:#d7a91f!important}
      #sellerLogoutBtn{background:#fff0f1!important;color:#a33038!important;border:1px solid #f1c7cb!important}
      #sellerForceTopBanner{margin:0 0 16px!important;padding:14px 15px!important;border:4px solid #d7a91f!important;border-radius:16px!important;background:linear-gradient(135deg,#fff8b8,#ffd659)!important;color:#4f3b00!important;font-weight:950!important;box-shadow:0 0 0 6px rgba(215,169,31,.20),0 12px 28px rgba(112,82,0,.18)!important;display:block!important}
      #sellerForceTopBanner .sfhb{display:inline-flex!important;margin-right:8px!important;padding:6px 9px!important;border-radius:999px!important;background:#ee3a16!important;color:#fff!important;font-size:10px!important;font-weight:950!important;letter-spacing:.07em!important}
      #sellerForceTopBanner small{display:block!important;margin-top:7px!important;color:#66521b!important;font-weight:800!important;line-height:1.4!important}
      @keyframes sellerForcePulse{0%,100%{transform:scale(1);box-shadow:0 0 0 8px rgba(215,169,31,.25),0 14px 34px rgba(112,82,0,.24)}50%{transform:scale(1.025);box-shadow:0 0 0 12px rgba(238,58,22,.12),0 16px 38px rgba(112,82,0,.30)}}
      @keyframes sellerForceCardPulse{0%,100%{box-shadow:0 0 0 8px rgba(215,169,31,.25),0 14px 34px rgba(112,82,0,.22)}50%{box-shadow:0 0 0 13px rgba(238,58,22,.10),0 18px 42px rgba(112,82,0,.28)}}
      @media(prefers-reduced-motion:reduce){button.seller-force-new,#sellerTodaySummary.seller-force-new,#sellerDuplicateNotice.seller-force-new{animation:none!important}}
      @media(max-width:760px){.seller-force-new{outline-width:3px!important}#sellerForceTopBanner{font-size:13px!important}}
    `;
    document.head.appendChild(s);
  }
  function hasDirectBadge(el){return Array.from(el.children||[]).some(c=>c.classList&&c.classList.contains('seller-force-badge'))}
  function badge(el,label='NEW'){
    if(!el)return;
    el.classList.add('seller-force-new');
    if(!hasDirectBadge(el)){
      const b=document.createElement('span');
      b.className='seller-force-badge';b.textContent=label;el.appendChild(b);
    }
  }
  function addLogout(){
    const nav=document.getElementById('nav');if(!nav||document.getElementById('sellerLogoutBtn'))return;
    const b=document.createElement('button');b.type='button';b.id='sellerLogoutBtn';b.textContent='Seller Logout';
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();sessionStorage.removeItem(AUTH_KEY);location.replace('./seller-login.html')});
    nav.appendChild(b);
  }
  function banner(){
    const dashboard=document.getElementById('dashboard');if(!dashboard)return;
    let b=document.getElementById('sellerForceTopBanner');
    if(!b){
      b=document.createElement('div');b.id='sellerForceTopBanner';
      b.innerHTML='<span class="sfhb">NEW</span> Seller tools added<small>Winner Claim Tracking • Date-Range Report • Quick Backup • Sale Notes • Restore Voided Sale • Draw Lock • Seller Receipt • View Buyer Tickets • Duplicate Payment Warning • Today’s Summary • Pending Counter • Seller Activity Log • End-of-Day Report • Void Sale • Void Ticket • Resend Release Code</small>';
      const hero=dashboard.querySelector('.hero');if(hero)dashboard.insertBefore(b,hero);else dashboard.insertBefore(b,dashboard.firstChild);
    }
  }
  function apply(){
    addStyle();addLogout();banner();
    const today=document.getElementById('sellerTodaySummary');if(today)today.classList.add('seller-force-new');
    const duplicate=document.getElementById('sellerDuplicateNotice');if(duplicate)duplicate.classList.add('seller-force-new');
    document.querySelectorAll('[data-void-sale]').forEach(b=>badge(b,'NEW'));
    document.querySelectorAll('[data-resend-release]').forEach(b=>badge(b,'NEW'));
    document.querySelectorAll('[data-seller-receipt]').forEach(b=>badge(b,'NEW'));
    document.querySelectorAll('[data-view-buyer-tickets]').forEach(b=>badge(b,'NEW'));
    document.querySelectorAll('#ticketList button[onclick*="voidTicket"]').forEach(b=>badge(b,'NEW'));
    badge(document.querySelector('#nav button[data-view="dashboard"]'),'NEW');
    badge(document.querySelector('#nav button[data-view="sell"]'),'NEW');
    badge(document.querySelector('#nav button[data-view="tickets"]'),'NEW');
    badge(document.querySelector('#nav button[data-view="draw"]'),'NEW');
    badge(document.querySelector('#nav button[data-view="reports"]'),'NEW');
  }
  function loadScript(id,src){
    if(document.getElementById(id))return;
    const s=document.createElement('script');s.id=id;s.src=src+'?v=1&t='+Date.now();document.head.appendChild(s);
  }
  function loadSellerTools(){
    loadScript('sellerOpsToolsLoader','./seller-ops-tools.js');
    loadScript('sellerFinalToolsLoader','./seller-final-tools.js');
  }
  function init(){
    loadSellerTools();apply();setTimeout(apply,200);setTimeout(apply,600);setTimeout(apply,1200);
    new MutationObserver(apply).observe(document.body,{childList:true,subtree:true});
    setInterval(apply,1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();