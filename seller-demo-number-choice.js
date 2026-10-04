(function(){
  const KEY='gt27_demo_tx_v2';
  const $=id=>document.getElementById(id);
  const fmt=n=>'GT27-'+String(n).padStart(5,'0');
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
  function save(v){localStorage.setItem(KEY,JSON.stringify(v))}
  function ticketHtml(t,buyer){return `<article class="ticket"><div class="ticketTop"></div><div class="ticketHead"><img src="./assets/pd-warriors-logo.jpg" alt="PD Warriors logo"><div><div class="small" style="font-weight:950;color:var(--green);text-transform:uppercase">Parkinson's Disease Warriors Philippines</div><div class="ticketTitle">GET TOGETHER 2027</div></div></div><div class="ticketNo">${t.ticketNo}</div><div class="ticketInfo"><div><span>Buyer</span><b>${buyer}</b></div><div><span>Control No.</span><b>${t.controlNo}</b></div><div><span>Verification Code</span><b>${t.verificationCode}</b></div><div><span>Status</span><b style="color:var(--green)">PAID / VALID — DEMO</b></div></div></article>`}
  function init(){
    const d=read();
    const summary=$('buyerSummary');
    if(d&&summary&&Array.isArray(d.preferredNumbers)){
      const row=document.createElement('div');row.className='kv';
      row.innerHTML='<span>Preferred number(s)</span><b>'+(d.preferredNumbers.length?d.preferredNumbers.map(fmt).join(', '):'No preference')+'</b>';
      summary.appendChild(row);
    }
    const issue=$('issueBtn');
    if(!issue)return;
    issue.onclick=function(){
      const tx=read();
      if(!tx)return alert('No buyer request found.');
      const count=Math.max(1,Number(tx.qty)||1);
      const control=tx.controlNo||'GT27-CN-DEMO01';
      const preferred=Array.isArray(tx.preferredNumbers)?tx.preferredNumbers.filter(n=>Number.isInteger(n)&&n>=1&&n<=99999).slice(0,count):[];
      const used=new Set(preferred);
      const chosen=[...preferred];
      let candidate=20001;
      while(chosen.length<count){while(used.has(candidate))candidate++;chosen.push(candidate);used.add(candidate);candidate++}
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