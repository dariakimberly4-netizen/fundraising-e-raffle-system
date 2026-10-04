(function(){
  const KEY='gt27_demo_tx_v2';
  const HISTORY_KEY='gt27_demo_buyer_history_v1';
  const $=id=>document.getElementById(id);
  const fmt=n=>'GT27-'+String(n).padStart(5,'0');
  function readKey(k,f){try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}}
  function read(){return readKey(KEY,null)}
  function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function usedNumbers(){const s=new Set();readKey(HISTORY_KEY,[]).forEach(o=>(o.tickets||[]).forEach(t=>{if(t.ticketNo)s.add(t.ticketNo)}));return s}
  function ticketHtml(t,buyer){return `<article class="ticket"><div class="ticketTop"></div><div class="ticketHead"><img src="./assets/pd-warriors-logo.jpg" alt="PD Warriors logo"><div><div class="small" style="font-weight:950;color:var(--green);text-transform:uppercase">Parkinson's Disease Warriors Philippines</div><div class="ticketTitle">GET TOGETHER 2027</div></div></div><div class="ticketNo">${t.ticketNo}</div><div class="ticketInfo"><div><span>Buyer</span><b>${buyer}</b></div><div><span>Control No.</span><b>${t.controlNo}</b></div><div><span>Verification Code</span><b>${t.verificationCode}</b></div><div><span>Status</span><b style="color:var(--green)">PAID / VALID — DEMO</b></div></div></article>`}
  function init(){
    const d=read();
    const summary=$('buyerSummary');
    if(d&&summary&&Array.isArray(d.preferredNumbers)){
      const used=usedNumbers();
      const row=document.createElement('div');row.className='kv';
      row.innerHTML='<span>Preferred number(s)</span><b>'+(d.preferredNumbers.length?d.preferredNumbers.map(n=>fmt(n)+(used.has(fmt(n))?' — TAKEN':' — AVAILABLE')).join(', '):'No preference')+'</b>';
      summary.appendChild(row);
    }
    const issue=$('issueBtn');
    if(!issue)return;
    issue.onclick=function(){
      const tx=read();
      if(!tx)return alert('No buyer request found.');
      const count=Math.max(1,Number(tx.qty)||1);
      const control=tx.controlNo||'GT27-CN-DEMO01';
      const used=usedNumbers();
      const preferred=Array.isArray(tx.preferredNumbers)?tx.preferredNumbers.filter(n=>Number.isInteger(n)&&n>=1&&n<=99999).slice(0,count):[];
      const conflicts=preferred.filter(n=>used.has(fmt(n)));
      if(conflicts.length)return alert('Cannot issue yet. These preferred raffle numbers are already taken: '+conflicts.map(fmt).join(', ')+'. Ask the buyer to choose another available number.');
      const chosen=[];const chosenSet=new Set();
      preferred.forEach(n=>{chosen.push(n);chosenSet.add(n)});
      let candidate=1;
      while(chosen.length<count){
        while(candidate<=99999&&(used.has(fmt(candidate))||chosenSet.has(candidate)))candidate++;
        if(candidate>99999)return alert('No raffle numbers available.');
        chosen.push(candidate);chosenSet.add(candidate);candidate++;
      }
      tx.tickets=chosen.map((n,i)=>({ticketNo:fmt(n),controlNo:control,verificationCode:'DEMO-'+String(i+1).padStart(3,'0')+'-'+Math.random().toString(36).slice(2,6).toUpperCase()}));
      tx.status='issued';tx.issuedAt=new Date().toISOString();save(tx);
      const payment=$('paymentCard'),issueCard=$('issueCard'),done=$('doneCard');
      if(payment)payment.classList.add('hidden');if(issueCard)issueCard.classList.add('hidden');if(done)done.classList.remove('hidden');
      if($('step4'))$('step4').classList.add('on');if($('step5'))$('step5').classList.add('on');
      if($('ticketList'))$('ticketList').innerHTML=tx.tickets.map(t=>ticketHtml(t,tx.name)).join('');
      setTimeout(()=>done?.scrollIntoView({behavior:'smooth',block:'start'}),40);
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();