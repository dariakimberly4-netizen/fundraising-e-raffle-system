(function(){
  const FLOW_KEY='gt27_demo_flow_v1';
  const $=id=>document.getElementById(id);
  const readFlow=()=>{try{return JSON.parse(localStorage.getItem(FLOW_KEY)||'null')}catch(e){return null}};
  const writeFlow=v=>localStorage.setItem(FLOW_KEY,JSON.stringify(v));
  const esc=v=>String(v||'').replace(/[&<>"']/g,'').trim();

  function applyBuyerFlow(){
    const flow=readFlow();
    if(!flow)return;
    if($('buyer')){$('buyer').value=flow.name||'';$('buyer').readOnly=true;}
    if($('contact')){$('contact').value=flow.contact||'';$('contact').readOnly=true;}
    if($('referred')){$('referred').value=flow.referred||'';$('referred').readOnly=true;}
    if($('method')){$('method').value=flow.method||'';$('method').disabled=true;}
    if($('qty')){$('qty').value=flow.qty||1;$('qty').readOnly=true;}
    if($('reference')){$('reference').value=flow.reference||'';$('reference').readOnly=true;}
    const requestNote=$('requestCard')?.querySelector('.small');
    if(requestNote)requestNote.textContent='Buyer-submitted details are locked. Seller checks payment only.';
    const total=$('total');if(total)total.textContent='₱'+Number((flow.qty||1)*100).toLocaleString('en-PH');
  }

  function init(){
    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='Seller handles only Steps 4–5. Buyer details are already confirmed and appear here automatically for payment checking and ticket issuance.';
    if($('s1'))$('s1').innerHTML='<b>4</b>CHECK PAYMENT';
    if($('s2'))$('s2').innerHTML='<b>5</b>ISSUE E‑TICKETS';
    if($('s3'))$('s3').style.display='none';if($('s4'))$('s4').style.display='none';
    const steps=document.querySelector('.steps');if(steps)steps.style.gridTemplateColumns='repeat(2,1fr)';
    const requestTitle=$('requestCard')?.querySelector('h2');if(requestTitle)requestTitle.textContent='4. Check Buyer Payment';
    const reviewBtn=$('reviewBtn');if(reviewBtn)reviewBtn.textContent='OPEN PAYMENT CHECK';
    const payTitle=$('paymentCard')?.querySelector('h2');if(payTitle)payTitle.textContent='4. Check Payment';
    const payNote=$('paymentCard')?.querySelector('.small');if(payNote)payNote.textContent='Review the buyer payment proof and transaction details. Buyer information cannot be edited here.';
    const approveBtn=$('approveBtn');if(approveBtn)approveBtn.textContent='PAYMENT VERIFIED — CONTINUE';
    const approvalCard=$('approvalCard');
    if(approvalCard){const h=approvalCard.querySelector('h2');const notice=approvalCard.querySelector('.notice');if(h)h.textContent='5. Issue E‑Tickets';if(notice){notice.className='notice ok';notice.textContent='Payment verified. Issue exactly the number of tickets requested by the buyer.';}}
    const issueBtn=$('issueBtn');if(issueBtn)issueBtn.textContent='ISSUE E‑TICKETS';
    const issuedTitle=$('issuedCard')?.querySelector('h2');if(issuedTitle)issuedTitle.textContent='5. E‑Tickets Issued';

    applyBuyerFlow();

    if(approveBtn){
      const original=approveBtn.onclick;
      approveBtn.onclick=function(e){
        if(original)original.call(this,e);
        const flow=readFlow();if(flow){flow.status='payment_verified';flow.paymentVerifiedAt=new Date().toISOString();writeFlow(flow);}
        setTimeout(()=>{if($('s1'))$('s1').classList.add('active');if($('s2'))$('s2').classList.add('active')},0);
      };
    }
    if(issueBtn){
      const original=issueBtn.onclick;
      issueBtn.onclick=function(e){
        if(original)original.call(this,e);
        const flow=readFlow()||{};
        const count=Math.max(1,Number(flow.qty||$('qty')?.value||1));
        flow.qty=count;flow.name=flow.name||esc($('buyer')?.value);flow.controlNo='GT27-CN-DEMO01';
        flow.tickets=Array.from({length:count},(_,i)=>({no:'GT27-'+String(20001+i).padStart(5,'0'),code:'DEMO-'+String(i+1).padStart(3,'0')+'-SELLER'}));
        flow.status='issued';flow.issuedAt=new Date().toISOString();flow.received=false;writeFlow(flow);
        setTimeout(()=>{
          const card=$('issuedCard');
          if(card&&!card.querySelector('#returnBuyerDemo')){
            const a=document.createElement('a');a.id='returnBuyerDemo';a.href='./buyer-demo.html';a.className='btn primary full';a.style.marginTop='12px';a.textContent='RETURN TO BUYER — VIEW E‑TICKETS';card.appendChild(a);
          }
        },50);
      };
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
