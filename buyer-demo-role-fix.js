(function(){
  function init(){
    const $=id=>document.getElementById(id);
    const s1=$('s1'),s2=$('s2'),s3=$('s3'),s4=$('s4'),s5=$('s5');
    if(s1)s1.innerHTML='<b>1</b>BUY';
    if(s2)s2.innerHTML='<b>2</b>PAY';
    if(s3)s3.innerHTML='<b>3</b>REVIEW & SUBMIT';
    if(s4)s4.innerHTML='<b>4</b>SELLER: CHECK PAYMENT';
    if(s5)s5.innerHTML='<b>5</b>SELLER: ISSUE E‑TICKETS';

    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='Buyer handles Steps 1–3: enter details, pay, review, approve, and submit. The seller handles Steps 4–5: check payment and issue the e‑tickets.';

    const submitCard=$('submitCard');
    if(submitCard){
      const h=submitCard.querySelector('h2');
      const notice=submitCard.querySelector('.notice');
      const status=[...submitCard.querySelectorAll('.kv')].find(x=>x.querySelector('span')?.textContent.trim()==='Status');
      if(h)h.textContent='3. Review & Submit';
      if(notice){notice.className='notice pending';notice.textContent='Review your information carefully. The buyer confirms these details before sending the request to the seller.'}
      if(status?.querySelector('b'))status.querySelector('b').textContent='WAITING FOR BUYER CONFIRMATION';
    }

    const approve=$('simulateApproval');
    if(approve){
      approve.textContent='I APPROVE — SUBMIT TO SELLER';
      approve.onclick=function(){
        const approvalCard=$('approvalCard');
        if(approvalCard){
          const h=approvalCard.querySelector('h2');
          const notice=approvalCard.querySelector('.notice');
          if(h)h.textContent='Submitted to Seller';
          if(notice){notice.className='notice ok';notice.textContent='Your request is complete. The seller will now do Step 4: check the payment, then Step 5: issue your e‑tickets.'}
          const show=$('showTickets');
          if(show){show.textContent='CONTINUE TO SELLER DEMO';show.onclick=()=>location.href='./seller-demo.html';}
          approvalCard.classList.remove('hidden');
          setTimeout(()=>approvalCard.scrollIntoView({behavior:'smooth',block:'start'}),50);
        }
        if(s1)s1.classList.add('active');if(s2)s2.classList.add('active');if(s3)s3.classList.add('active');
        if(s4)s4.classList.remove('active');if(s5)s5.classList.remove('active');
      };
    }

    const ticketsCard=$('ticketsCard');
    if(ticketsCard)ticketsCard.classList.add('hidden');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
