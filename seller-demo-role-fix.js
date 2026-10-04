(function(){
  function init(){
    const $=id=>document.getElementById(id);
    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='This matches the Buyer Demo. The buyer approves their own information before submitting. The seller only opens the request, checks payment, and issues the exact number of e‑tickets.';
    if($('s1'))$('s1').innerHTML='<b>1</b>OPEN REQUEST';
    if($('s2'))$('s2').innerHTML='<b>2</b>CHECK PAYMENT';
    if($('s3'))$('s3').innerHTML='<b>3</b>ISSUE E‑TICKETS';
    if($('s4'))$('s4').style.display='none';
    const steps=document.querySelector('.steps');
    if(steps)steps.style.gridTemplateColumns='repeat(3,1fr)';
    const requestTitle=$('requestCard')?.querySelector('h2');
    if(requestTitle)requestTitle.textContent='1. Open Buyer Request';
    const requestNote=$('requestCard')?.querySelector('.small');
    if(requestNote)requestNote.textContent='Enter the buyer-approved details exactly as submitted in the Buyer Demo.';
    const reviewBtn=$('reviewBtn');
    if(reviewBtn)reviewBtn.textContent='CHECK PAYMENT';
    const payTitle=$('paymentCard')?.querySelector('h2');
    if(payTitle)payTitle.textContent='2. Check Payment';
    const payNote=$('paymentCard')?.querySelector('.small');
    if(payNote)payNote.textContent='Review the payment proof. The seller does not approve the buyer information; the buyer already confirmed it.';
    const approveBtn=$('approveBtn');
    if(approveBtn)approveBtn.textContent='PAYMENT CHECKED';
    const approvalCard=$('approvalCard');
    if(approvalCard){
      const h=approvalCard.querySelector('h2');
      const notice=approvalCard.querySelector('.notice');
      const status=[...approvalCard.querySelectorAll('.kv')].find(x=>x.querySelector('span')?.textContent.trim()==='Status');
      if(h)h.textContent='3. Ready to Issue E‑Tickets';
      if(notice){notice.className='notice ok';notice.textContent='Payment has been checked. Issue the exact number of e‑tickets requested by the buyer.'}
      if(status?.querySelector('b'))status.querySelector('b').textContent='PAYMENT CHECKED';
    }
    const issueBtn=$('issueBtn');
    if(issueBtn)issueBtn.textContent='ISSUE E‑TICKETS';
    const issuedTitle=$('issuedCard')?.querySelector('h2');
    if(issuedTitle)issuedTitle.textContent='E‑Tickets Issued';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
