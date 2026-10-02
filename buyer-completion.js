(function(){
  const RELEASE_PREFIX='ERTKT1.';
  const ORDER_KEY='gt27_buyer_order_v2';
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const SEEN_KEY='gt27_buyer_completion_seen_v1';
  const FEATURES={tickets:'buyer-etickets-v1',paymentdetails:'buyer-payment-details-v1',contact:'buyer-contact-v1',rules:'buyer-rules-v1'};
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[m]));
  const peso=n=>'₱'+Number(n||0).toLocaleString('en-PH',{maximumFractionDigits:2});

  function style(){
    if($('buyerCompletionStyle'))return;
    const s=document.createElement('style');s.id='buyerCompletionStyle';s.textContent=`
      .buyer-new-feature{position:relative!important;border-color:#e5c85a!important;background:linear-gradient(135deg,#fff9dc,#fff2ae)!important;color:#6e5200!important;box-shadow:0 0 0 3px rgba(215,169,31,.12)!important}
      .buyer-new-feature.active{background:var(--green)!important;color:#fff!important;border-color:var(--gold)!important}
      .buyer-new-badge{display:inline-flex;margin-left:7px;padding:3px 7px;border-radius:999px;background:var(--red);color:#fff;font-size:9px;font-weight:950;line-height:1}
      .buyer-ticket{border:1px solid var(--line);border-left:5px solid var(--green);border-radius:17px;padding:15px;background:#fff;margin-top:10px}
      .buyer-ticket-no{font-size:22px;font-weight:950;color:var(--red);letter-spacing:.03em}
      .buyer-ticket-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:850;color:var(--green);word-break:break-all}
      .buyer-safe-note{background:#fff8dd;border:1px solid #edd57d;border-radius:15px;padding:13px;color:#6f5812;margin-top:10px;font-size:13px;line-height:1.5}
    `;document.head.appendChild(s);
  }
  function navButton(view,label,beforeSelector){
    const nav=document.querySelector('.sideNav');if(!nav||nav.querySelector(`[data-view="${view}"]`))return;
    const b=document.createElement('button');b.type='button';b.dataset.view=view;b.textContent=label;
    const before=beforeSelector?nav.querySelector(beforeSelector):null;
    before?nav.insertBefore(b,before):nav.appendChild(b);
    b.addEventListener('click',()=>show(view));
  }
  function view(id,html){
    const main=document.querySelector('main.content');if(!main||$(id))return;
    const footer=main.querySelector('.footer');const sec=document.createElement('section');sec.id=id;sec.className='view';sec.innerHTML=html;
    footer?main.insertBefore(sec,footer):main.appendChild(sec);
  }
  function show(id){
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
    document.querySelectorAll('.sideNav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
    $('sidebar')?.classList.remove('open');$('overlay')?.classList.remove('show');
    markSeen(id);if(id==='tickets')renderTickets();if(id==='paymentdetails')renderPaymentStatus();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function seen(){try{return JSON.parse(localStorage.getItem(SEEN_KEY)||'{}')||{}}catch(e){return{}}}
  function markSeen(view){const v=FEATURES[view];if(!v)return;const x=seen();x[view]=v;localStorage.setItem(SEEN_KEY,JSON.stringify(x));document.querySelectorAll(`[data-view="${view}"]`).forEach(b=>{b.classList.remove('buyer-new-feature');b.querySelector('.buyer-new-badge')?.remove()})}
  function highlights(){const x=seen();Object.entries(FEATURES).forEach(([k,v])=>{if(x[k]===v)return;document.querySelectorAll(`[data-view="${k}"]`).forEach(b=>{b.classList.add('buyer-new-feature');if(!b.querySelector('.buyer-new-badge')){const n=document.createElement('span');n.className='buyer-new-badge';n.textContent='NEW';b.appendChild(n)}})})}
  function decode(s){s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';const bin=atob(s),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));return new TextDecoder().decode(bytes)}
  function loadOrder(){try{return JSON.parse(localStorage.getItem(ORDER_KEY))}catch(e){return null}}
  function loadTickets(){try{return JSON.parse(localStorage.getItem(TICKET_KEY)||'null')}catch(e){return null}}
  function saveTickets(x){localStorage.setItem(TICKET_KEY,JSON.stringify(x))}
  function syncVerifyStore(pack){
    try{
      const KEY='fundraising_eraffle_v1';
      let db=JSON.parse(localStorage.getItem(KEY)||'null')||{settings:{title:'GET TOGETHER 2027',org:"Parkinson's Disease Warriors Philippines",price:100,target:500,drawDate:'2027-01-16',permit:'',purpose:'Fundraising in support of GET TOGETHER 2027'},sales:[],tickets:[],winners:[],nextTicket:1};
      if(!Array.isArray(db.tickets))db.tickets=[];
      pack.tickets.forEach(t=>{
        const existing=db.tickets.find(x=>x.number===t.number||x.code===t.code);
        const item={id:'buyer-'+(t.number||t.code),saleId:pack.saleId||'buyer-release',number:t.number,code:t.code,buyerName:t.buyerName||pack.buyerName||'',contact:'',email:'',price:Number(t.price||0),status:'paid',createdAt:pack.issuedAt||new Date().toISOString(),voided:false};
        if(existing)Object.assign(existing,item);else db.tickets.push(item);
      });
      db.settings=db.settings||{};db.settings.title='GET TOGETHER 2027';db.settings.org="Parkinson's Disease Warriors Philippines";db.settings.drawDate='2027-01-16';
      localStorage.setItem(KEY,JSON.stringify(db));
    }catch(e){}
  }

  function renderPaymentStatus(){
    const box=$('buyerPaymentStatus');if(!box)return;const o=loadOrder();const pack=loadTickets();
    if(pack&&pack.tickets?.length){box.innerHTML=`<span class="status verified">PAID / TICKETS ISSUED</span><p class="note">${pack.tickets.length} official e-ticket${pack.tickets.length>1?'s':''} saved on this phone.</p>`;return}
    if(!o){box.innerHTML='<span class="status pending">NO REQUEST YET</span><p class="note">Submit a ticket request first.</p>';return}
    const status=(o.status||'pending').toLowerCase();box.innerHTML=`<span class="status ${status==='verified'?'verified':status==='rejected'?'rejected':'pending'}">${status==='verified'?'PAID / VERIFIED':status==='rejected'?'REJECTED':'PENDING VERIFICATION'}</span><p class="note">Order ${esc(o.requestId||'')} • ${o.qty||0} ticket${Number(o.qty)!==1?'s':''} • ${peso((o.qty||0)*(o.price||0))}</p>`;
  }
  function ticketHtml(t){return `<div class="buyer-ticket"><div class="buyer-ticket-no">${esc(t.number)}</div><div class="note">GET TOGETHER 2027 • January 16, 2027</div><div class="kv"><span>Ticket holder</span><b>${esc(t.buyerName||'')}</b></div><div class="kv"><span>Ticket value</span><b>${peso(t.price)}</b></div><div class="kv"><span>Verification code</span><b class="buyer-ticket-code">${esc(t.code)}</b></div><div class="actions"><button class="btn primary" type="button" data-share-ticket="${esc(t.number)}">Share Ticket</button><button class="btn secondary" type="button" data-save-ticket="${esc(t.number)}">Save Ticket</button><a class="btn gold" href="./verify.html?code=${encodeURIComponent(t.code||'')}&ticket=${encodeURIComponent(t.number||'')}">Verify</a></div></div>`}
  function renderTickets(){
    const box=$('buyerTicketList');if(!box)return;const pack=loadTickets();
    if(!pack||!pack.tickets?.length){box.innerHTML='<div class="note">No official e-tickets saved on this phone yet. After the seller marks your payment Paid, ask for the Ticket Release Code and paste it below.</div>';return}
    box.innerHTML=pack.tickets.map(ticketHtml).join('');
    box.querySelectorAll('[data-share-ticket]').forEach(b=>b.onclick=()=>shareTicket(b.dataset.shareTicket));
    box.querySelectorAll('[data-save-ticket]').forEach(b=>b.onclick=()=>saveTicket(b.dataset.saveTicket));
  }
  function findTicket(no){return loadTickets()?.tickets?.find(t=>t.number===no)}
  async function shareTicket(no){const t=findTicket(no);if(!t)return;const text=`GET TOGETHER 2027 E-Raffle Ticket\nTicket: ${t.number}\nHolder: ${t.buyerName}\nVerification: ${t.code}\nDraw: January 16, 2027`;try{if(navigator.share)await navigator.share({title:'GET TOGETHER 2027 E-Raffle Ticket',text});else{await navigator.clipboard.writeText(text);alert('Ticket copied.')}}catch(e){}}
  function saveTicket(no){const t=findTicket(no);if(!t)return;const html=`<!doctype html><meta charset="utf-8"><title>${esc(t.number)}</title><body style="font-family:Arial;padding:32px"><h1>GET TOGETHER 2027</h1><h2>${esc(t.number)}</h2><p><b>Holder:</b> ${esc(t.buyerName)}</p><p><b>Verification:</b> ${esc(t.code)}</p><p><b>Draw:</b> January 16, 2027</p><p>Parkinson's Disease Warriors Philippines</p></body>`;const blob=new Blob([html],{type:'text/html'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${t.number}.html`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
  function importRelease(){
    const raw=($('buyerReleaseCode')?.value||'').trim();const msg=$('buyerReleaseMsg');
    try{if(!raw.startsWith(RELEASE_PREFIX))throw new Error('Invalid Ticket Release Code.');const data=JSON.parse(decode(raw.slice(RELEASE_PREFIX.length)));if(!data||!Array.isArray(data.tickets)||!data.tickets.length)throw new Error('No tickets found in this release code.');saveTickets(data);syncVerifyStore(data);const o=loadOrder();if(o){o.status='verified';localStorage.setItem(ORDER_KEY,JSON.stringify(o))}if(msg)msg.innerHTML='<span class="status verified">TICKETS RECEIVED</span>';renderTickets();renderPaymentStatus();markSeen('tickets')}catch(e){if(msg)msg.innerHTML=`<span class="status rejected">${esc(e.message||'Invalid code')}</span>`}}
  async function contactOrganizer(){const o=loadOrder();const text=o?`GET TOGETHER 2027 ticket request\nOrder: ${o.requestId}\nBuyer: ${o.buyerName}\nTickets: ${o.qty}\nTotal: ${peso(o.qty*o.price)}\nStatus: ${(o.status||'pending').toUpperCase()}`:'GET TOGETHER 2027 fundraising e-raffle inquiry';try{if(navigator.share)await navigator.share({title:'Contact GET TOGETHER 2027 Organizer',text});else{await navigator.clipboard.writeText(text);alert('Your inquiry details were copied. Send them through the organizer’s official contact channel.')}}catch(e){}}

  function build(){
    style();
    navButton('tickets','My E-Tickets','.verifyLink');
    navButton('paymentdetails','Payment Details','[data-view="payment"]');
    navButton('contact','Contact Organizer','[data-view="draw"]');
    navButton('rules','Raffle Rules','[data-view="event"]');
    view('tickets',`<div class="card"><h3>My E‑Tickets</h3><p class="note">Official tickets appear here after payment is approved and the seller gives you a Ticket Release Code.</p><label>Ticket Release Code<input id="buyerReleaseCode" placeholder="Paste ERTKT1 release code"></label><div class="actions"><button id="buyerImportRelease" class="btn primary" type="button">Receive My E‑Tickets</button></div><div id="buyerReleaseMsg" style="margin-top:10px"></div><div id="buyerTicketList" style="margin-top:12px"></div></div>`);
    view('paymentdetails',`<div class="card"><h3>Payment Details & Status</h3><div id="buyerPaymentStatus"></div><div class="buyer-safe-note"><b>Payment account details:</b> Use only the GCash, Maya, bank, or cash instructions provided by the official GET TOGETHER 2027 organizer. This page does not invent or display an unconfirmed account number.</div><div class="actions"><button class="btn primary" type="button" data-go="payment">Open Payment Guide</button><button class="btn secondary" type="button" data-go="request">My Request</button></div></div>`);
    view('contact',`<div class="card"><h3>Contact Organizer</h3><p class="note">Share your saved order details through the organizer’s official Messenger, SMS, email, or other confirmed contact channel.</p><div class="actions"><button id="buyerContactOrganizer" class="btn primary" type="button">Share My Order Details</button></div></div>`);
    view('rules',`<div class="card"><h3>Simple Raffle Rules</h3><div class="step"><div class="stepNo">1</div><div><b>Each paid ticket is one raffle entry.</b><div class="note">Buying several tickets gives the buyer several separate raffle entries.</div></div></div><div class="step"><div class="stepNo">2</div><div><b>Only paid and active tickets are eligible.</b><div class="note">Pending, rejected, or void tickets are excluded.</div></div></div><div class="step"><div class="stepNo">3</div><div><b>Keep your ticket number and verification code.</b><div class="note">Use Verify Ticket to check an issued ticket.</div></div></div><div class="step"><div class="stepNo">4</div><div><b>Draw date: January 16, 2027.</b><div class="note">GET TOGETHER 2027 • St. Luke’s Medical Center – Quezon City.</div></div></div></div>`);
    document.querySelectorAll('[data-go]').forEach(b=>{if(!b.dataset.completionBound){b.dataset.completionBound='1';b.addEventListener('click',()=>show(b.dataset.go))}});
    $('buyerImportRelease')?.addEventListener('click',importRelease);$('buyerContactOrganizer')?.addEventListener('click',contactOrganizer);
    highlights();renderPaymentStatus();renderTickets();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();