(function(){
  const KEY='gt27_seller_detail_seen_v1';
  const SEARCH_VERSION='find-buyer-ticket-v1';
  const STATUS_VERSION='mark-paid-pending-v1';
  const REPORTS_VERSION='seller-simple-search-status-v1';

  function seen(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
  function save(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
  function style(){
    if(document.getElementById('sellerDetailHighlightStyle'))return;
    const s=document.createElement('style');
    s.id='sellerDetailHighlightStyle';
    s.textContent=`
      #simpleSellerTools.seller-detail-new{
        position:relative!important;
        border:2px solid #d7a91f!important;
        background:linear-gradient(135deg,#fffdf5,#fff8d9)!important;
        box-shadow:0 0 0 4px rgba(215,169,31,.12),0 12px 30px rgba(106,79,0,.10)!important;
      }
      .seller-detail-badge{
        display:inline-flex;align-items:center;justify-content:center;
        margin-left:8px;padding:4px 8px;border-radius:999px;
        background:#ee3a16;color:#fff;font:900 10px/1 Inter,system-ui,sans-serif;
        letter-spacing:.06em;vertical-align:middle;
      }
      .seller-status-new{
        position:relative!important;border:2px solid #d7a91f!important;
        box-shadow:0 0 0 3px rgba(215,169,31,.13)!important;
      }
      .seller-status-new:after{
        content:'NEW';display:inline-flex;margin-left:7px;padding:3px 6px;border-radius:999px;
        background:#ee3a16;color:#fff;font-size:9px;font-weight:950;line-height:1;letter-spacing:.05em;
      }
      #sellerStatusNewCallout{
        display:inline-flex;align-items:center;gap:7px;margin:8px 0 2px;padding:7px 10px;
        border:1px solid #e4ca66;border-radius:999px;background:#fff5c8;color:#6d5200;
        font-size:11px;font-weight:900;
      }
    `;
    document.head.appendChild(s);
  }
  function clearOldReportsHighlight(){
    try{
      const k='gt27_seller_seen_features_v1';
      const x=JSON.parse(localStorage.getItem(k)||'{}')||{};
      x.reports=REPORTS_VERSION;
      localStorage.setItem(k,JSON.stringify(x));
    }catch(e){}
    document.querySelectorAll('[data-view="reports"]').forEach(btn=>{
      btn.classList.remove('seller-new-feature');
      btn.querySelector('.seller-new-badge')?.remove();
    });
  }
  function markSearchSeen(){
    const x=seen();if(x.search===SEARCH_VERSION)return;
    x.search=SEARCH_VERSION;save(x);
    const box=document.getElementById('simpleSellerTools');
    box?.classList.remove('seller-detail-new');
    box?.querySelector('.seller-detail-badge')?.remove();
  }
  function markStatusSeen(){
    const x=seen();if(x.status===STATUS_VERSION)return;
    x.status=STATUS_VERSION;save(x);
    document.querySelectorAll('#simpleSellerTools [data-sale-id]').forEach(b=>b.classList.remove('seller-status-new'));
    document.getElementById('sellerStatusNewCallout')?.remove();
  }
  function apply(){
    style();clearOldReportsHighlight();
    const box=document.getElementById('simpleSellerTools');
    if(!box)return;
    const x=seen();
    const h=box.querySelector('h3');
    if(x.search!==SEARCH_VERSION){
      box.classList.add('seller-detail-new');
      if(h&&!h.querySelector('.seller-detail-badge')){
        const b=document.createElement('span');b.className='seller-detail-badge';b.textContent='NEW';h.appendChild(b);
      }
      const input=document.getElementById('sellerQuickSearch');
      if(input&&!input.dataset.newHighlightBound){
        input.dataset.newHighlightBound='1';
        input.addEventListener('focus',markSearchSeen,{once:true});
        input.addEventListener('input',markSearchSeen,{once:true});
      }
    }
    if(x.status!==STATUS_VERSION){
      let callout=document.getElementById('sellerStatusNewCallout');
      if(!callout){
        callout=document.createElement('div');callout.id='sellerStatusNewCallout';callout.textContent='NEW • Mark Paid / Mark Pending';
        const results=document.getElementById('sellerQuickResults');
        results?.parentNode?.insertBefore(callout,results);
      }
      document.querySelectorAll('#simpleSellerTools [data-sale-id]').forEach(btn=>{
        btn.classList.add('seller-status-new');
        if(!btn.dataset.statusNewBound){btn.dataset.statusNewBound='1';btn.addEventListener('click',markStatusSeen,{once:true})}
      });
    }
  }
  function init(){
    apply();setTimeout(apply,250);setTimeout(apply,800);
    const root=document.getElementById('reports')||document.body;
    const mo=new MutationObserver(()=>apply());
    mo.observe(root,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
