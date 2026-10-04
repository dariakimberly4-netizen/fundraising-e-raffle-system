(function(){
  const FLOW_KEY='gt27_demo_flow_v1';
  const $=id=>document.getElementById(id);
  const readFlow=()=>{try{return JSON.parse(localStorage.getItem(FLOW_KEY)||'null')}catch(e){return null}};
  const writeFlow=v=>localStorage.setItem(FLOW_KEY,JSON.stringify(v));
  const clean=v=>String(v||'').trim();
  const money=n=>'₱'+Number(n||0).toLocaleString('en-PH');

  function statusLabel(flow){
    if(!flow)return ['NO REQUEST YET','pending','Start with Steps 1–3 to create a buyer request.'];
    if(flow.status==='issued')return ['E‑TICKETS READY','ok','Your seller has issued '+flow.qty+' e‑ticket'+(flow.qty===1?'':'s')+'.'];
    if(flow.status==='payment_returned')return ['PAYMENT NEEDS FOLLOW‑UP','pending',flow.note||'The seller returned the payment for follow-up.'];
    if(flow.status==='payment_verified')return ['PAYMENT VERIFIED','ok','Payment was verified. The seller is preparing your e‑tickets.'];
    return ['WAITING FOR SELLER','pending','Your request was submitted. The seller still needs to check payment and issue the e‑tickets.'];
  }

  function renderFollowUp(){
    let card=$('buyerFollowUpCard');
    if(!card){
      card=document.createElement('section');
      card.id='buyerFollowUpCard';
      card.className='card';
      card.innerHTML='<h2 style="margin:0;color:var(--green);font-family:Georgia,serif">Buyer Follow-Up</h2><p class="small">Check what happened after you submitted your raffle request.</p><div id="buyerFollowUpStatus" class="notice pending"></div><div id="buyerFollowUpSummary" class="summary"></div><button id="buyerRefreshStatus" class="btn secondary full" style="margin-top:10px">CHECK STATUS AGAIN</button><button id="buyerViewIssued" class="btn primary full hidden" style="margin-top:10px">VIEW MY E‑TICKETS</button><div id="buyerIssuedTickets"></div>';
      const main=document.querySelector('main');
      const back=main?.querySelector('.back');
      if(main) main.insertBefore(card,back||null);
      $('buyerRefreshStatus')?.addEventListener('click',()=>renderFollowUp());
      $('buyerViewIssued')?.addEventListener('click',()=>{const box=$('buyerIssuedTickets');if(box){box.classList.remove('hidden');box.scrollIntoView({behavior:'smooth',block:'start'});markReceived();}});
    }
    const flow=readFlow();
    const [label,kind,msg]=statusLabel(flow);
    const st=$('buyerFollowUpStatus');
    if(st){st.className='notice '+kind;st.innerHTML='<b>'+label+'</b><br>'+msg;}
    const sum=$('buyerFollowUpSummary');
    if(sum){
      if(!flow)sum.innerHTML='<div class="kv"><span>Status</span><b>NO REQUEST</b></div>';
      else sum.innerHTML='<div class="kv"><span>Request No.</span><b>'+(flow.requestNo||'—')+'</b></div><div class="kv"><span>Buyer</span><b>'+(flow.name||'—')+'</b></div><div class="kv"><span>Tickets</span><b>'+flow.qty+'</b></div><div class="kv"><span>Total</span><b>'+money((flow.qty||0)*100)+'</b></div><div class="kv"><span>Seller Status</span><b>'+label+'</b></div>';
    }
    const view=$('buyerViewIssued');
    if(view)view.classList.toggle('hidden',!flow||flow.status!=='issued');
    renderIssuedTickets(flow);
  }

  function renderIssuedTickets(flow){
    const box=$('buyerIssuedTickets');
    if(!box)return;
    if(!flow||flow.status!=='issued'){box.innerHTML='';return;}
    box.classList.add('hidden');
    const tickets=Array.isArray(flow.tickets)?flow.tickets:[];
    box.innerHTML='<div class="notice ok" style="margin-top:12px"><b>YOUR '+flow.qty+' E‑TICKET'+(flow.qty===1?' IS':'S ARE')+' READY</b><br>Open each ticket below and keep it safe.</div>'+tickets.map((t,i)=>'<article class="ticket"><div class="ticketTop"></div><div class="ticketHead"><img src="./assets/pd-warriors-logo.jpg" alt="PD Warriors logo"><div><div style="font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--green);font-weight:950">Parkinson\'s Disease Warriors Philippines</div><div class="ticketTitle">GET TOGETHER 2027</div><div class="ticketSub">Official Demo E‑Raffle Ticket</div></div></div><div class="ticketBody"><div class="ticketNo">'+t.no+'</div><div class="ticketInfo"><div><span>Buyer</span><b>'+flow.name+'</b></div><div><span>Control No.</span><b>'+flow.controlNo+'</b></div><div><span>Verification Code</span><b>'+t.code+'</b></div><div><span>Status</span><b style="color:var(--green)">'+(flow.received?'RECEIVED':'ISSUED')+'</b></div></div><div class="small" style="margin-top:10px">Ticket '+(i+1)+' of '+tickets.length+'.</div></div></article>').join('');
  }

  function markReceived(){
    const flow=readFlow();
    if(!flow||flow.status!=='issued')return;
    flow.received=true;flow.receivedAt=new Date().toISOString();writeFlow(flow);
    renderIssuedTickets(flow);
  }

  function init(){
    const s1=$('s1'),s2=$('s2'),s3=$('s3'),s4=$('s4'),s5=$('s5');
    if(s1)s1.innerHTML='<b>1</b>BUY';
    if(s2)s2.innerHTML='<b>2</b>PAY';
    if(s3)s3.innerHTML='<b>3</b>REVIEW & SUBMIT';
    if(s4)s4.innerHTML='<b>4</b>SELLER: CHECK PAYMENT';
    if(s5)s5.innerHTML='<b>5</b>SELLER: ISSUE E‑TICKETS';
    const hero=document.querySelector('.hero p');
    if(hero)hero.textContent='Buyer handles Steps 1–3. After submitting, use Buyer Follow-Up to see whether payment was checked and whether your e‑tickets are ready.';

    const submitCard=$('submitCard');
    if(submitCard){
      const h=submitCard.querySelector('h2');
      const notice=submitCard.querySelector('.notice');
      if(h)h.textContent='3. Review & Submit';
      if(notice){notice.className='notice pending';notice.textContent='Review your information carefully, then confirm and submit it to the seller.';}
    }

    const approve=$('simulateApproval');
    if(approve){
      approve.textContent='CONFIRM & SUBMIT TO SELLER';
      approve.onclick=function(){
        const qty=Number($('submittedQty')?.textContent||$('qtyText')?.textContent||1)||1;
        const proof=$('proof')?.files?.[0];
        const flow={
          requestNo:clean($('requestNo')?.textContent)||('DEMO-REQ-'+Math.floor(1000+Math.random()*9000)),
          name:clean($('name')?.value),contact:clean($('contact')?.value),email:clean($('email')?.value),referred:clean($('referred')?.value),source:clean($('source')?.value),method:clean($('method')?.value),qty:qty,proofName:proof?proof.name:'Payment proof selected',status:'submitted',submittedAt:new Date().toISOString(),received:false
        };
        writeFlow(flow);
        const approvalCard=$('approvalCard');
        if(approvalCard){
          const h=approvalCard.querySelector('h2');const notice=approvalCard.querySelector('.notice');
          if(h)h.textContent='Submitted to Seller';
          if(notice){notice.className='notice ok';notice.textContent='Your request was submitted. Use Buyer Follow-Up anytime to check whether your e‑tickets are ready.';}
          const show=$('showTickets');if(show){show.textContent='CONTINUE TO SELLER DEMO';show.onclick=()=>location.href='./seller-demo.html';}
          approvalCard.classList.remove('hidden');setTimeout(()=>approvalCard.scrollIntoView({behavior:'smooth',block:'start'}),50);
        }
        renderFollowUp();
      };
    }
    const ticketsCard=$('ticketsCard');if(ticketsCard)ticketsCard.classList.add('hidden');
    renderFollowUp();
    window.addEventListener('storage',renderFollowUp);
    window.addEventListener('focus',renderFollowUp);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
