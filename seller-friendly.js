(function(){
  'use strict';
  const GREEN='#246b2d', RED='#ee3a16', GOLD='#d7a91f';

  const STYLE=`
  .sf-status{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border-radius:999px;font-size:12px;font-weight:900;border:1px solid #dfe8d9;background:#f5f9f2;color:${GREEN}}
  .sf-status.offline{background:#fff4d7;color:#7a5b00;border-color:#ead48f}.sf-dot{width:8px;height:8px;border-radius:50%;background:#2f9e44}.sf-status.offline .sf-dot{background:#d79a00}
  .sf-quick{margin:14px 0 0;background:#fff;border:1px solid #dfe8d9;border-radius:18px;padding:16px;box-shadow:0 8px 24px rgba(36,107,45,.06)}
  .sf-quick h3{margin:0 0 5px!important;color:${GREEN}!important;font-family:Georgia,'Times New Roman',serif!important;font-size:20px!important}.sf-quick>p{margin:0 0 13px;color:#667164;font-size:13px;line-height:1.5}
  .sf-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.sf-step{border:1px solid #e3eadf;background:#fbfdf9;border-radius:14px;padding:12px;min-height:100px}.sf-step b{display:flex;align-items:center;gap:7px;color:${GREEN};font-size:13px}.sf-num{display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:${GREEN};color:#fff;font-size:12px;flex:0 0 25px}.sf-step span{display:block;margin-top:7px;color:#6b7567;font-size:12px;line-height:1.4}
  .sf-help{margin:0 0 14px;border:1px solid #dfe8d9;background:#f8fbf5;border-radius:15px;padding:13px 14px;color:#40523d;font-size:13px;line-height:1.55}.sf-help b{color:${GREEN}}
  #sell .card{border:2px solid #dfe8d9!important}#sell label{font-size:14px!important}#sell input,#sell select,#sell textarea{min-height:50px!important;font-size:16px!important}#sell textarea{min-height:92px!important}
  #sell .btn[type='submit']{min-height:52px!important;padding:13px 18px!important;font-size:15px!important;background:${GREEN}!important;color:#fff!important}#sell .btn[type='reset']{min-height:52px!important}
  #nav button{min-height:50px!important}.top-actions .btn{min-height:46px!important}
  .sf-login-help{margin:0 0 14px;padding:12px 13px;border-radius:14px;background:#f5f9f2;border:1px solid #dfe8d9;color:#40523d;font-size:13px;line-height:1.45;text-align:center}.sf-login-help b{color:${GREEN}}
  body.sf-login-page .account{min-height:82px!important;padding:14px!important}body.sf-login-page .account b{font-size:16px!important}body.sf-login-page #pin,body.sf-login-page #confirmPin{min-height:56px!important;font-size:20px!important}body.sf-login-page #submitBtn{min-height:56px!important;font-size:16px!important}
  @media(max-width:900px){.sf-steps{grid-template-columns:1fr 1fr}.sf-step{min-height:92px}}
  @media(max-width:520px){.sf-steps{grid-template-columns:1fr}.sf-step{min-height:0}.sf-quick{padding:14px}.sf-status{font-size:11px;padding:7px 9px}#sell .actions{display:grid!important;grid-template-columns:1fr!important}#sell .actions .btn{width:100%!important}}
  `;

  function addStyle(){if(document.getElementById('sellerFriendlyStyle'))return;const s=document.createElement('style');s.id='sellerFriendlyStyle';s.textContent=STYLE;document.head.appendChild(s)}
  function statusPill(){const el=document.createElement('span');el.className='sf-status';el.innerHTML='<span class="sf-dot"></span><span></span>';const update=()=>{const on=navigator.onLine;el.classList.toggle('offline',!on);el.querySelector('span:last-child').textContent=on?'Online • Offline-ready':'Offline Mode • Saved on this device'};update();window.addEventListener('online',update);window.addEventListener('offline',update);return el}

  function friendlyLogin(){
    if(!document.getElementById('loginForm'))return false;
    document.body.classList.add('sf-login-page');
    const intro=document.getElementById('intro');if(intro)intro.textContent='Choose your name, then enter your PIN. That’s all you need to open the Seller Portal.';
    const accounts=document.getElementById('accounts');
    if(accounts&&!document.getElementById('sfLoginHelp')){const h=document.createElement('div');h.id='sfLoginHelp';h.className='sf-login-help';h.innerHTML='<b>Simple login:</b> Tap your account → enter your PIN → tap Login.';accounts.insertAdjacentElement('beforebegin',h)}
    const pinLabel=document.getElementById('pinLabel');if(pinLabel&&pinLabel.firstChild)pinLabel.firstChild.textContent='PIN — 4 to 8 numbers';
    const submit=document.getElementById('submitBtn');if(submit&&submit.textContent.trim()==='Login')submit.textContent='OPEN SELLER PORTAL';
    const card=document.querySelector('.card');if(card&&!card.querySelector('.sf-status'))card.insertBefore(statusPill(),card.querySelector('.small'));
    return true;
  }

  function friendlyPortal(){
    if(!document.getElementById('dashboard'))return false;
    const topActions=document.querySelector('.top-actions');
    if(topActions&&!topActions.querySelector('.sf-status'))topActions.insertBefore(statusPill(),topActions.firstChild);
    const newSale=topActions&&Array.from(topActions.querySelectorAll('button')).find(b=>/Sell Tickets/i.test(b.textContent));if(newSale)newSale.textContent='+ NEW SALE';

    const navSell=document.querySelector('#nav button[data-view="sell"]');if(navSell)navSell.textContent='New Sale';
    const navTickets=document.querySelector('#nav button[data-view="tickets"]');if(navTickets)navTickets.textContent='E‑Tickets';

    const dash=document.getElementById('dashboard');
    if(dash&&!document.getElementById('sfQuickGuide')){const q=document.createElement('div');q.id='sfQuickGuide';q.className='sf-quick';q.innerHTML='<h3>Seller Quick Guide</h3><p>Use this simple flow for every buyer. The system will keep the ticket count exact.</p><div class="sf-steps"><div class="sf-step"><b><span class="sf-num">1</span>Buyer Request</b><span>Get the buyer details or import the buyer’s Request Code.</span></div><div class="sf-step"><b><span class="sf-num">2</span>Check Payment</b><span>Confirm payment and mark the sale Paid only when verified.</span></div><div class="sf-step"><b><span class="sf-num">3</span>Create Tickets</b><span>Create exactly the number of e‑tickets the buyer purchased.</span></div><div class="sf-step"><b><span class="sf-num">4</span>Release</b><span>Send the buyer one Release Code containing all of their e‑tickets.</span></div></div>';const hero=dash.querySelector('.hero');if(hero)hero.insertAdjacentElement('afterend',q);else dash.insertBefore(q,dash.firstChild)}

    const sell=document.getElementById('sell');
    if(sell&&!document.getElementById('sfSellHelp')){const h=document.createElement('div');h.id='sfSellHelp';h.className='sf-help';h.innerHTML='<b>New Sale:</b> Enter the buyer’s details, choose how many tickets they bought, confirm the payment status, then tap <b>CREATE SALE & E‑TICKETS</b>.';const card=sell.querySelector('.card');if(card)card.insertAdjacentElement('beforebegin',h)}
    const submit=sell&&sell.querySelector('button[type="submit"]');if(submit)submit.textContent='CREATE SALE & E‑TICKETS';
    const reset=sell&&sell.querySelector('button[type="reset"]');if(reset)reset.textContent='CLEAR FORM';
    const title=sell&&sell.querySelector('.section-title h2');if(title)title.textContent='New E‑Raffle Sale';
    const desc=sell&&sell.querySelector('.section-title p');if(desc)desc.textContent='One buyer can purchase one or many tickets in a single transaction.';

    const labels=sell?Array.from(sell.querySelectorAll('label')):[];
    labels.forEach(l=>{const t=l.childNodes[0];if(!t||t.nodeType!==3)return;const x=t.textContent.trim();if(/^Buyer name$/i.test(x))t.textContent='Buyer name — Required ';else if(/^Quantity$/i.test(x))t.textContent='Number of tickets — Required ';else if(/^Price per ticket$/i.test(x))t.textContent='Price per ticket — Required ';else if(/^Payment status$/i.test(x))t.textContent='Payment status — Required ';else if(/^Mobile/i.test(x))t.textContent='Mobile / contact — Optional ';else if(/^Email$/i.test(x))t.textContent='Email — Optional ';else if(/^Reference/i.test(x))t.textContent='Payment reference — Optional ';else if(/^Notes$/i.test(x))t.textContent='Notes — Optional '});
    return true;
  }

  function init(){addStyle();if(friendlyLogin())return;friendlyPortal()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{init();setTimeout(init,350);setTimeout(init,1000)},{once:true});else{init();setTimeout(init,350);setTimeout(init,1000)}
})();
