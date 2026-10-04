(function(){
  const STYLE_ID='gt27SellerSimpleFlowStyle';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .ssf-card{margin-top:14px;border:2px solid #d7a91f!important;background:linear-gradient(135deg,#fffef8,#fffaf0)!important;box-shadow:0 10px 28px rgba(36,107,45,.08)!important}
      .ssf-title{font-family:Georgia,"Times New Roman",serif;color:#246b2d;font-size:22px;font-weight:900;margin:0 0 5px}
      .ssf-sub{font-size:13px;color:#677264;line-height:1.5;margin:0 0 12px}
      .ssf-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
      .ssf-step{border:1px solid #dfe8d9;border-radius:15px;background:#fff;padding:13px;min-height:112px;display:flex;flex-direction:column;justify-content:space-between}
      .ssf-num{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#246b2d;color:#fff;font-weight:950;margin-bottom:8px}
      .ssf-step b{color:#263524;font-size:14px}.ssf-step span{display:block;color:#6b7567;font-size:12px;line-height:1.45;margin-top:4px}
      .ssf-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.ssf-actions .btn{min-height:48px;flex:1 1 180px}
      @media(max-width:720px){.ssf-steps{grid-template-columns:1fr}.ssf-step{min-height:0}.ssf-actions{flex-direction:column}.ssf-actions .btn{width:100%;flex:none}}
    `;
    document.head.appendChild(s);
  }
  function go(view){
    try{if(typeof showView==='function'){showView(view);return}}catch(e){}
    const btn=document.querySelector(`.nav button[data-view="${view}"],.nav button[data-route="${view}"],[data-view="${view}"],[data-route="${view}"]`);
    if(btn)btn.click();
  }
  function build(){
    if(document.getElementById('sellerSimpleFlowCard'))return;
    const dash=document.getElementById('dashboard')||document.querySelector('.view.active')||document.querySelector('main');
    if(!dash)return;
    const card=document.createElement('div');
    card.id='sellerSimpleFlowCard';
    card.className='card ssf-card';
    card.innerHTML=`<h3 class="ssf-title">Simple Seller Workflow</h3><p class="ssf-sub">Only three steps for buyer requests: receive the request, check the payment proof, then approve and issue the exact e-tickets.</p><div class="ssf-steps"><div class="ssf-step"><div><div class="ssf-num">1</div><b>Open Buyer Request</b><span>Import the buyer request package or open the request waiting for review.</span></div></div><div class="ssf-step"><div><div class="ssf-num">2</div><b>Check Payment</b><span>Open the payment proof and confirm the buyer's payment details.</span></div></div><div class="ssf-step"><div><div class="ssf-num">3</div><b>Approve & Issue</b><span>Tap APPROVE & ISSUE TICKETS. The system creates the paid sale and exact e-tickets automatically.</span></div></div></div><div class="ssf-actions"><button type="button" class="btn primary" id="ssfOpenRequests">OPEN BUYER REQUESTS</button><button type="button" class="btn secondary" id="ssfVerify">VERIFY TICKET</button></div>`;
    const hero=dash.querySelector('.hero');
    if(hero)hero.insertAdjacentElement('afterend',card);else dash.prepend(card);
    document.getElementById('ssfOpenRequests')?.addEventListener('click',()=>go('reports'));
    document.getElementById('ssfVerify')?.addEventListener('click',()=>go('verify'));
  }
  function rename(){
    document.querySelectorAll('[data-view="reports"],[data-route="reports"]').forEach(el=>{if(/reports/i.test(el.textContent||''))el.textContent='Buyer Requests'});
    const c=document.getElementById('sellerOfflineRequestCard');
    if(c){const h=c.querySelector('h3');if(h)h.textContent='Buyer Requests & Payment Proofs';const p=c.querySelector('p.note');if(p)p.textContent='Import the buyer request, check the payment proof, then tap APPROVE & ISSUE TICKETS.';}
  }
  function init(){addStyle();build();rename();setTimeout(()=>{build();rename()},700);new MutationObserver(()=>rename()).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
