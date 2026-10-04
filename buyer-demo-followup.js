(function(){
  const KEY='gt27_demo_tx_v2';
  const $=id=>document.getElementById(id);
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function money(n){return '₱'+Number(n||0).toLocaleString('en-PH')}
  function state(d){
    if(!d)return {label:'NO REQUEST YET',kind:'warn',text:'Complete Steps 1–3 first, then come back here to follow up.'};
    if(d.status==='payment_issue')return {label:'PAYMENT NEEDS ATTENTION',kind:'warn',text:d.returnReason||'The seller returned your payment for review.'};
    if(d.status==='payment_verified')return {label:'PAYMENT VERIFIED',kind:'ok',text:'The seller checked your payment. Your e‑tickets are being prepared.'};
    if(d.status==='issued')return {label:d.receivedAt?'RECEIVED':'E‑TICKETS READY',kind:'ok',text:d.receivedAt?'You already opened your issued e‑tickets.':'The seller issued your e‑tickets. Tap VIEW MY E‑TICKETS.'};
    return {label:'WAITING FOR SELLER',kind:'warn',text:'Your request was submitted. The seller still needs to check payment and issue your e‑tickets.'};
  }
  function makeCard(){
    let card=$('followUpCard');
    if(card)return card;
    card=document.createElement('section');
    card.className='card';
    card.id='followUpCard';
    card.innerHTML='<h2 style="margin:0;color:var(--green);font-family:Georgia,serif">Buyer Follow-Up</h2><p class="small">Use this after submitting your request to see the latest seller status.</p><div id="followUpStatus" class="notice warn"></div><div id="followUpSummary" class="summary"></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn secondary" id="followUpRefresh" style="flex:1">CHECK STATUS</button><button class="btn primary hidden" id="followUpTickets" style="flex:1">VIEW MY E‑TICKETS</button></div>';
    const main=document.querySelector('main');
    const submitted=$('submittedCard');
    if(main&&submitted)main.insertBefore(card,submitted.nextSibling);else main?.appendChild(card);
    $('followUpRefresh')?.addEventListener('click',render);
    $('followUpTickets')?.addEventListener('click',()=>{
      const d=read();if(!d||d.status!=='issued')return;
      d.receivedAt=d.receivedAt||new Date().toISOString();save(d);render();
      const ready=$('readyCard');
      if(ready){ready.classList.remove('hidden');ready.scrollIntoView({behavior:'smooth',block:'start'});}
    });
    return card;
  }
  function render(){
    makeCard();
    const d=read(),s=state(d),status=$('followUpStatus'),sum=$('followUpSummary'),view=$('followUpTickets');
    if(status){status.className='notice '+s.kind;status.innerHTML='<b>'+s.label+'</b><br>'+s.text;}
    if(sum){
      sum.innerHTML=d?'<div class="kv"><span>Request No.</span><b>'+(d.requestNo||'—')+'</b></div><div class="kv"><span>Buyer</span><b>'+(d.name||'—')+'</b></div><div class="kv"><span>Tickets</span><b>'+(d.qty||0)+'</b></div><div class="kv"><span>Total</span><b>'+money(d.total||((d.qty||0)*100))+'</b></div><div class="kv"><span>Status</span><b>'+s.label+'</b></div>':'<div class="kv"><span>Status</span><b>NO REQUEST</b></div>';
    }
    if(view)view.classList.toggle('hidden',!d||d.status!=='issued');
  }
  function addQuickFollowUp(){
    const hero=document.querySelector('.hero');if(!hero||$('heroFollowUpBtn'))return;
    const b=document.createElement('button');b.id='heroFollowUpBtn';b.className='btn secondary full';b.style.marginTop='8px';b.textContent='FOLLOW UP MY REQUEST';b.onclick=()=>{render();$('followUpCard')?.scrollIntoView({behavior:'smooth',block:'start'});};
    const start=$('startBtn');if(start)start.insertAdjacentElement('afterend',b);else hero.appendChild(b);
  }
  function init(){makeCard();addQuickFollowUp();render();window.addEventListener('focus',render);window.addEventListener('storage',render);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
