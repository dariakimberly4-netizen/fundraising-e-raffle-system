(function(){
  const REQUEST_PREFIX='ERREQ1.';
  const QR_LIB='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  const CAMPAIGN={
    title:'GET TOGETHER 2027',
    org:"Parkinson's Disease Warriors Philippines",
    drawDate:'2027-01-16',
    time:'9:00 AM–1:00 PM',
    venue:'St. Luke’s Medical Center – Quezon City',
    theme:'New Hope: Moving Forward Beyond Parkinson’s.',
    purpose:"Fundraising in support of GET TOGETHER 2027 — New Hope: Moving Forward Beyond Parkinson’s."
  };

  const SELLER_NEW_FEATURES={
    sell:'seller-sell-v1',
    tickets:'seller-etickets-qr-v1',
    verify:'seller-verify-v1'
  };
  const SELLER_SEEN_KEY='gt27_seller_seen_features_v1';

  function toastSafe(msg){
    try{ if(typeof toast==='function') toast(msg); else alert(msg); }catch(e){ alert(msg); }
  }

  function getSellerSeen(){
    try{return JSON.parse(localStorage.getItem(SELLER_SEEN_KEY)||'{}')||{}}catch(e){return{}}
  }
  function setSellerSeen(seen){
    try{localStorage.setItem(SELLER_SEEN_KEY,JSON.stringify(seen))}catch(e){}
  }
  function addSellerHighlightStyle(){
    if(document.getElementById('sellerNewFeatureStyle')) return;
    const s=document.createElement('style');
    s.id='sellerNewFeatureStyle';
    s.textContent=`
      #nav button.seller-new-feature,
      .sidebar button.seller-new-feature{
        position:relative!important;
        border:1px solid #e5c85a!important;
        background:linear-gradient(135deg,#fff9dc,#fff2ae)!important;
        color:#6e5200!important;
        box-shadow:0 0 0 3px rgba(215,169,31,.13),0 6px 16px rgba(130,92,0,.10)!important;
        animation:sellerNewPulse 2.2s ease-in-out infinite;
      }
      #nav button.seller-new-feature.active,
      .sidebar button.seller-new-feature.active{
        background:linear-gradient(135deg,#246b2d,#3f8732)!important;
        color:#fff!important;
        border-color:#d7a91f!important;
      }
      .seller-new-badge{
        display:inline-flex;align-items:center;justify-content:center;
        margin-left:7px;padding:3px 7px;border-radius:999px;
        background:#ee3a16;color:#fff;font-size:9px;font-weight:950;
        line-height:1;letter-spacing:.05em;vertical-align:middle;
      }
      @keyframes sellerNewPulse{0%,100%{transform:translateY(0)}50%{transform:translateY(-1px)}}
      @media (prefers-reduced-motion:reduce){#nav button.seller-new-feature,.sidebar button.seller-new-feature{animation:none!important}}
    `;
    document.head.appendChild(s);
  }
  function clearSellerFeature(view){
    const version=SELLER_NEW_FEATURES[view];
    if(!version) return;
    const seen=getSellerSeen();
    if(seen[view]===version) return;
    seen[view]=version;setSellerSeen(seen);
    document.querySelectorAll(`[data-view="${view}"]`).forEach(btn=>{
      btn.classList.remove('seller-new-feature');
      btn.querySelector('.seller-new-badge')?.remove();
    });
  }
  function applySellerNewHighlights(){
    addSellerHighlightStyle();
    const seen=getSellerSeen();
    Object.entries(SELLER_NEW_FEATURES).forEach(([view,version])=>{
      if(seen[view]===version) return;
      document.querySelectorAll(`[data-view="${view}"]`).forEach(btn=>{
        btn.classList.add('seller-new-feature');
        if(!btn.querySelector('.seller-new-badge')){
          const badge=document.createElement('span');badge.className='seller-new-badge';badge.textContent='NEW';btn.appendChild(badge);
        }
        if(!btn.dataset.sellerHighlightBound){
          btn.dataset.sellerHighlightBound='1';
          btn.addEventListener('click',()=>clearSellerFeature(view),{once:true});
        }
      });
    });
    const topSell=[...document.querySelectorAll('.top-actions button')].find(b=>/sell tickets/i.test(b.textContent||''));
    if(topSell && seen.sell!==SELLER_NEW_FEATURES.sell){
      topSell.classList.add('seller-new-feature');
      if(!topSell.querySelector('.seller-new-badge')){
        const badge=document.createElement('span');badge.className='seller-new-badge';badge.textContent='NEW';topSell.appendChild(badge);
      }
      if(!topSell.dataset.sellerHighlightBound){topSell.dataset.sellerHighlightBound='1';topSell.addEventListener('click',()=>clearSellerFeature('sell'),{once:true})}
    }
  }

  function applyCampaignBranding(){
    try{
      document.title='GET TOGETHER 2027 — Fundraising E‑Raffle';
      if(typeof db!=='undefined' && db && db.settings){
        db.settings.title=CAMPAIGN.title;
        db.settings.org=CAMPAIGN.org;
        db.settings.drawDate=CAMPAIGN.drawDate;
        db.settings.purpose=CAMPAIGN.purpose;
        localStorage.setItem('fundraising_eraffle_v1',JSON.stringify(db));
      }
      if(typeof ticketNo==='function'){
        ticketNo=function(n){return `GT27-${String(n).padStart(5,'0')}`};
      }
      const footer=document.querySelector('.footer');
      if(footer) footer.textContent='GET TOGETHER 2027 • Fundraising E‑Raffle System';
      if(typeof loadSettings==='function') loadSettings();
      if(typeof renderAll==='function') renderAll();
      applyEventHero();
    }catch(e){}
  }

  function applyEventHero(){
    const hero=document.querySelector('#dashboard .hero');
    if(!hero) return;
    const p=hero.querySelector('p');
    if(!p) return;
    p.innerHTML=`
      <span style="display:block;font-weight:800;margin-bottom:5px">January 16, 2027</span>
      <span style="display:block;margin-bottom:5px">9:00 AM–1:00 PM</span>
      <span style="display:block;margin-bottom:8px">St. Luke’s Medical Center – Quezon City</span>
      <span style="display:block"><strong>Theme:</strong> “New Hope: Moving Forward Beyond Parkinson’s.”</span>`;
  }

  function b64urlDecode(s){
    try{
      s=s.replace(/-/g,'+').replace(/_/g,'/');
      while(s.length%4)s+='=';
      const bin=atob(s);
      const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }catch(e){ return ''; }
  }
  function parseRequestCode(raw){
    const value=(raw||'').trim();
    if(!value.startsWith(REQUEST_PREFIX)) throw new Error('Invalid buyer request code.');
    const text=b64urlDecode(value.slice(REQUEST_PREFIX.length));
    if(!text) throw new Error('Unable to read buyer request code.');
    const data=JSON.parse(text);
    if(!data || !data.buyerName || !data.qty) throw new Error('Incomplete buyer request.');
    return data;
  }
  function addBuyerImport(){
    const sell=document.getElementById('sell');
    if(!sell || document.getElementById('buyerRequestImporter')) return;
    const mainCard=sell.querySelector('.card');
    if(!mainCard) return;
    const box=document.createElement('div');
    box.id='buyerRequestImporter';
    box.className='card';
    box.style.marginBottom='14px';
    box.innerHTML=`
      <h3 style="margin:0 0 6px">Buyer Request</h3>
      <p class="note" style="margin:0 0 12px">Supporters can prepare their GET TOGETHER 2027 raffle request on the public buyer page. Paste the request code here to prefill the sale form.</p>
      <div class="searchline">
        <input id="buyerRequestCode" placeholder="Paste ERREQ1 request code">
        <button class="btn primary" type="button" id="importBuyerRequestBtn">Import Request</button>
      </div>
      <div class="actions" style="margin-top:10px">
        <a class="btn secondary" href="./buy.html" target="_blank" rel="noopener" style="text-decoration:none;display:inline-flex;align-items:center">Open Public Buyer Page</a>
        <button class="btn secondary" type="button" id="copyBuyerPageLink">Copy Buyer Page Link</button>
      </div>`;
    mainCard.parentNode.insertBefore(box,mainCard);
    document.getElementById('importBuyerRequestBtn').onclick=function(){
      try{
        const d=parseRequestCode(document.getElementById('buyerRequestCode').value);
        const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};
        set('buyerName',d.buyerName);set('buyerContact',d.contact);set('buyerEmail',d.email);set('qty',d.qty);
        set('paymentStatus','pending');set('paymentMethod',d.method||'Other');set('paymentRef',d.ref||'');
        set('notes',[d.notes,'Imported from GET TOGETHER 2027 public buyer request '+(d.requestId||'')].filter(Boolean).join(' • '));
        if(typeof calcSale==='function') calcSale();
        toastSafe('Buyer request imported. Review payment, then create the sale.');
        document.getElementById('buyerName')?.scrollIntoView({behavior:'smooth',block:'center'});
      }catch(e){ toastSafe(e.message||'Invalid buyer request code.'); }
    };
    document.getElementById('copyBuyerPageLink').onclick=async function(){
      const url=new URL('./buy.html',location.href).href;
      try{await navigator.clipboard.writeText(url);toastSafe('Buyer page link copied.')}catch(e){prompt('Copy buyer page link:',url)}
    };
  }

  function loadQrLib(){
    if(window.QRCode) return Promise.resolve();
    if(window.__raffleQrPromise) return window.__raffleQrPromise;
    window.__raffleQrPromise=new Promise((resolve,reject)=>{
      const s=document.createElement('script');s.src=QR_LIB;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    });
    return window.__raffleQrPromise;
  }
  function verifyUrl(t){
    const u=new URL('./verify.html',location.href);
    u.searchParams.set('code',t.code||'');
    u.searchParams.set('ticket',t.number||'');
    return u.href;
  }
  function qrMarkup(t){
    const u=encodeURIComponent(verifyUrl(t));
    return `<div class="ticket-qr" data-qr="${u}" style="margin-top:14px;padding:12px;border:1px solid #e7dfed;border-radius:14px;background:#fff;display:flex;align-items:center;gap:12px"><div class="ticket-qr-code" style="width:112px;height:112px;flex:0 0 112px"></div><div><b>Scan to verify</b><div class="note" style="margin-top:4px">Ticket ${t.number||''}</div><div class="note">Verification ${t.code||''}</div></div></div>`;
  }
  async function renderQrs(){
    const slots=[...document.querySelectorAll('.ticket-qr[data-qr]')].filter(x=>!x.dataset.done);
    if(!slots.length) return;
    try{await loadQrLib();}catch(e){return;}
    slots.forEach(slot=>{
      const holder=slot.querySelector('.ticket-qr-code');
      if(!holder) return;
      holder.innerHTML='';
      try{
        new QRCode(holder,{text:decodeURIComponent(slot.dataset.qr),width:112,height:112,colorDark:'#201728',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
        slot.dataset.done='1';
      }catch(e){}
    });
  }
  function wrapTicketFunctions(){
    if(typeof window.ticketHTML==='function' && !window.ticketHTML.__qrWrapped){
      const original=window.ticketHTML;
      const wrapped=function(t,withActions=true){
        let html=original(t,withActions);
        if(!html.includes('ticket-qr')){
          const idx=html.lastIndexOf('</div>');
          if(idx>-1) html=html.slice(0,idx)+qrMarkup(t)+html.slice(idx);
        }
        return html;
      };
      wrapped.__qrWrapped=true;
      window.ticketHTML=wrapped;
    }
    if(typeof window.renderTickets==='function' && !window.renderTickets.__qrWrapped){
      const original=window.renderTickets;
      const wrapped=function(){const r=original.apply(this,arguments);setTimeout(renderQrs,0);return r;};
      wrapped.__qrWrapped=true;window.renderTickets=wrapped;
    }
    if(typeof window.openTicket==='function' && !window.openTicket.__qrWrapped){
      const original=window.openTicket;
      const wrapped=function(){const r=original.apply(this,arguments);setTimeout(renderQrs,0);return r;};
      wrapped.__qrWrapped=true;window.openTicket=wrapped;
    }
    setTimeout(()=>{try{if(typeof renderTickets==='function')renderTickets();}catch(e){};renderQrs();},50);
  }
  function handleVerifyQuery(){
    const p=new URLSearchParams(location.search);const code=p.get('verify');
    if(!code) return;
    try{if(typeof showView==='function')showView('verify');}catch(e){}
    const input=document.getElementById('verifyInput');if(input)input.value=code;
    setTimeout(()=>{try{if(typeof verifyTicket==='function')verifyTicket();}catch(e){}},100);
  }

  function init(){
    applyCampaignBranding();addBuyerImport();wrapTicketFunctions();handleVerifyQuery();applyEventHero();
    applySellerNewHighlights();
    setTimeout(applySellerNewHighlights,180);
    setTimeout(applySellerNewHighlights,700);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
