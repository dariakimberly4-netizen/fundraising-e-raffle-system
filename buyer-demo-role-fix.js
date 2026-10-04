(function(){
  function init(){
    const $=id=>document.getElementById(id);
    const s1=$('s1'),s2=$('s2'),s3=$('s3'),s4=$('s4'),s5=$('s5');
    if(s1)s1.innerHTML='<b>1</b>BUY';
    if(s2)s2.innerHTML='<b>2</b>PAY';
    if(s3)s3.innerHTML='<b>3</b>REVIEW & APPROVE';
    if(s4)s4.innerHTML='<b>4</b>SUBMITTED';
    if(s5)s5.innerHTML='<b>5</b>GET E‑TICKETS';

    const submitCard=$('submitCard');
    if(submitCard){
      const h=submitCard.querySelector('h2');
      const notice=submitCard.querySelector('.notice');
      const status=[...submitCard.querySelectorAll('.kv')].find(x=>x.querySelector('span')?.textContent.trim()==='Status');
      if(h)h.textContent='3. Review & Approve Your Information';
      if(notice){notice.className='notice pending';notice.textContent='Please review the information below. The buyer is the one who confirms and approves these details before they are sent to the seller.'}
      if(status?.querySelector('b'))status.querySelector('b').textContent='WAITING FOR BUYER APPROVAL';
    }
    const approve=$('simulateApproval');
    if(approve)approve.textContent='I APPROVE — SUBMIT TO SELLER';

    const approvalCard=$('approvalCard');
    if(approvalCard){
      const h=approvalCard.querySelector('h2');
      const notice=approvalCard.querySelector('.notice');
      if(h)h.textContent='4. Request Submitted';
      if(notice){notice.className='notice ok';notice.textContent='Your approved information has been submitted. The seller will only check the payment and issue the e‑tickets.'}
    }
    const show=$('showTickets');
    if(show)show.textContent='SIMULATE SELLER ISSUING E‑TICKETS';

    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='You type the buyer information, review it, and approve it yourself before submitting. The seller only checks payment and issues the e‑tickets.';
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
