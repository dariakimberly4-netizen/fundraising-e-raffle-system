(function(){
  function init(){
    const $=id=>document.getElementById(id);
    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='Seller handles only Steps 4–5. The buyer has already completed and approved Steps 1–3 before this request reaches you.';

    if($('s1'))$('s1').innerHTML='<b>4</b>CHECK PAYMENT';
    if($('s2'))$('s2').innerHTML='<b>5</b>ISSUE E‑TICKETS';
    if($('s3'))$('s3').style.display='none';
    if($('s4'))$('s4').style.display='none';
    const steps=document.querySelector('.steps');
    if(steps)steps.style.gridTemplateColumns='repeat(2,1fr)';

    const requestTitle=$('requestCard')?.querySelector('h2');
    if(requestTitle)requestTitle.textContent='4. Check Buyer Payment';
    const requestNote=$('requestCard')?.querySelector('.small');
    if(requestNote)requestNote.textContent='The buyer has already reviewed and approved these details. Open the request and proceed to payment checking.';
    const reviewBtn=$('reviewBtn');
    if(reviewBtn)reviewBtn.textContent='OPEN PAYMENT CHECK';

    const payTitle=$('paymentCard')?.querySelector('h2');
    if(payTitle)payTitle.textContent='4. Check Payment';
    const payNote=$('paymentCard')?.querySelector('.small');
    if(payNote)payNote.textContent='Review the payment proof. Do not change or approve the buyer information here.';
    const approveBtn=$('approveBtn');
    if(approveBtn)approveBtn.textContent='PAYMENT VERIFIED — CONTINUE';

    const approvalCard=$('approvalCard');
    if(approvalCard){
      const h=approvalCard.querySelector('h2');
      const notice=approvalCard.querySelector('.notice');
      const status=[...approvalCard.querySelectorAll('.kv')].find(x=>x.querySelector('span')?.textContent.trim()==='Status');
      if(h)h.textContent='5. Issue E‑Tickets';
      if(notice){notice.className='notice ok';notice.textContent='Payment has been verified. Issue the exact number of e‑tickets requested by the buyer.'}
      if(status?.querySelector('b'))status.querySelector('b').textContent='PAYMENT VERIFIED';
    }
    const issueBtn=$('issueBtn');
    if(issueBtn)issueBtn.textContent='ISSUE E‑TICKETS';
    const issuedTitle=$('issuedCard')?.querySelector('h2');
    if(issuedTitle)issuedTitle.textContent='5. E‑Tickets Issued';

    // Keep the visible progress correct even though the original demo uses four internal states.
    if(reviewBtn){
      const original=reviewBtn.onclick;
      reviewBtn.onclick=function(e){if(original)original.call(this,e);setTimeout(()=>{if($('s1'))$('s1').classList.add('active');if($('s2'))$('s2').classList.remove('active')},0)};
    }
    if(approveBtn){
      const original=approveBtn.onclick;
      approveBtn.onclick=function(e){if(original)original.call(this,e);setTimeout(()=>{if($('s1'))$('s1').classList.add('active');if($('s2'))$('s2').classList.add('active')},0)};
    }
    if(issueBtn){
      const original=issueBtn.onclick;
      issueBtn.onclick=function(e){if(original)original.call(this,e);setTimeout(()=>{if($('s1'))$('s1').classList.add('active');if($('s2'))$('s2').classList.add('active')},0)};
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
