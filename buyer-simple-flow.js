(function(){
  const ORDER_KEY='gt27_buyer_order_v2';
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const $=id=>document.getElementById(id);
  const load=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}};

  function addStyle(){
    if($('gt27SimpleFlowStyle'))return;
    const s=document.createElement('style');
    s.id='gt27SimpleFlowStyle';
    s.textContent=`
      .simpleFlow{margin:14px 0 0;padding:14px;border:1px solid #dce8d6;border-radius:16px;background:#f8fbf5;text-align:left}
      .simpleFlowTitle{font-size:13px;font-weight:950;color:#246b2d;margin-bottom:10px;text-align:center}
      .simpleSteps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}
      .simpleStep{min-width:0;border:1px solid #e0e9db;border-radius:12px;background:#fff;padding:9px 7px;text-align:center;font-size:11px;font-weight:900;color:#40523d;line-height:1.25}
      .simpleStep b{display:grid;place-items:center;width:25px;height:25px;margin:0 auto 5px;border-radius:50%;background:#246b2d;color:#fff;font-size:12px}
      .simpleNext{margin-top:12px;padding:13px;border:1px solid #dfe8d9;border-radius:15px;background:#fff}
      .simpleNext h3{margin:0 0 5px!important;color:#246b2d!important;font-size:18px!important}.simpleNext p{margin:0;color:#697466;font-size:13px;line-height:1.5}
      .simplePrimary{width:100%;min-height:54px;margin-top:11px!important;background:#ee3a16!important;color:#fff!important;border:0!important;border-radius:14px!important;font-weight:950!important;font-size:15px!important}
      .simpleReceive{border:2px solid #d7a91f;border-radius:16px;padding:14px;background:#fffdf5;margin:12px 0}.simpleReceive b{color:#246b2d}.simpleReceive p{margin:5px 0 10px;color:#697466;font-size:13px;line-height:1.45}
      .simpleHidden{display:none!important}
      @media(max-width:640px){.simpleSteps{grid-template-columns:1fr}.simpleStep{display:grid;grid-template-columns:30px 1fr;align-items:center;text-align:left;padding:8px 10px}.simpleStep b{margin:0}.simpleFlow{padding:12px}}
    `;
    document.head.appendChild(s);
  }

  function addIntroSteps(){
    const hero=$('introduction');
    if(!hero||$('gt27SimpleFlow'))return;
    const wrap=document.createElement('div');
    wrap.id='gt27SimpleFlow';wrap.className='simpleFlow';
    wrap.innerHTML='<div class="simpleFlowTitle">5 EASY STEPS</div><div class="simpleSteps"><div class="simpleStep"><b>1</b>Buy</div><div class="simpleStep"><b>2</b>Pay</div><div class="simpleStep"><b>3</b>Submit</div><div class="simpleStep"><b>4</b>Approval</div><div class="simpleStep"><b>5</b>Get E‑Tickets</div></div>';
    const btn=hero.querySelector('.buyAction');
    if(btn)hero.insertBefore(wrap,btn);else hero.appendChild(wrap);
  }

  function simplifyRequest(){
    const rd=$('requestData');if(!rd)return;
    ['requestCode','copyRequest','shareRequest','exportRequest'].forEach(id=>$(id)?.classList.add('simpleHidden'));
    const transfer=$('buyerOfflineTransferCard');
    if(transfer){
      const b=transfer.querySelector('b');if(b)b.textContent='Send Your Request';
      const small=transfer.querySelector('.bow-small');if(small)small.textContent='Tap once to send your ticket request and payment proof to the raffle organizer.';
      const send=$('buyerExportRequestPackage');if(send){send.textContent='SEND REQUEST TO ORGANIZER';send.classList.add('simplePrimary')}
      $('buyerViewSavedProof')?.classList.add('simpleHidden');
    }
    if(!$('simpleBuyerNext')){
      const n=document.createElement('div');n.id='simpleBuyerNext';n.className='simpleNext';
      n.innerHTML='<h3>What happens next?</h3><p>The organizer checks your payment. Once approved, your official e‑tickets will be sent back to you.</p>';
      rd.appendChild(n);
    }
  }

  function simplifyTickets(){
    const sec=$('tickets');if(!sec)return;
    const label=$('releaseCode')?.closest('label');if(label)label.classList.add('simpleHidden');
    $('receiveTickets')?.closest('.actions')?.classList.add('simpleHidden');
    const oldFile=$('releaseFile')?.closest('div');if(oldFile)oldFile.classList.add('simpleHidden');
    const box=$('buyerSellerReleaseFile');
    if(box){
      const parent=box.parentElement;
      if(parent){
        parent.classList.add('simpleReceive');
        const b=parent.querySelector('b');if(b)b.textContent='Receive Your Approved E‑Tickets';
        const small=parent.querySelector('.bow-small');if(small)small.textContent='When the organizer sends your e‑ticket file, tap below and open it. Your tickets will appear automatically.';
        box.setAttribute('aria-label','Open e-ticket file');
      }
    }
  }

  function addBuyGuidance(){
    const buy=$('buy');if(!buy||$('simpleBuyHelp'))return;
    const p=buy.querySelector('.note');
    const h=document.createElement('div');h.id='simpleBuyHelp';h.className='simpleNext';
    h.innerHTML='<h3>Just fill in, pay, and submit.</h3><p>Your name, contact number, ticket quantity, referral, payment details, and payment proof are all you need.</p>';
    if(p)p.insertAdjacentElement('afterend',h);else buy.prepend(h);
  }

  function refreshState(){
    const o=load(ORDER_KEY),p=load(TICKET_KEY);
    const requestStatus=$('requestStatus');
    if(requestStatus&&o&&!p?.tickets?.length)requestStatus.textContent='WAITING FOR APPROVAL';
    if(requestStatus&&p?.tickets?.length)requestStatus.textContent='APPROVED — E‑TICKETS READY';
  }

  function apply(){addStyle();addIntroSteps();addBuyGuidance();simplifyRequest();simplifyTickets();refreshState()}
  function init(){
    apply();setTimeout(apply,300);setTimeout(apply,900);
    new MutationObserver(()=>requestAnimationFrame(apply)).observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
