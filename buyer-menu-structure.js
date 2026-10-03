(function(){
  const STYLE_ID='buyerMenuStructureStyleV2';
  const VIEW_TO_GROUP={
    home:'home',buy:'buy',request:'tickets',tickets:'tickets',
    payment:'payment',paymentdetails:'payment',
    draw:'raffle',rules:'raffle',event:'raffle',
    contact:'help',howitworks:'help',faq:'help'
  };
  function $(id){return document.getElementById(id)}
  function addStyle(){
    if($(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .buyer-main-nav{display:grid;gap:9px;position:relative;z-index:165;pointer-events:auto!important}
      .buyer-main-item{display:grid;gap:6px;pointer-events:auto!important}
      .buyer-main-btn{width:100%!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;border:1px solid var(--line)!important;background:#f3f8ef!important;color:var(--green)!important;border-radius:14px!important;padding:13px 14px!important;text-align:left!important;font-weight:900!important;cursor:pointer!important;touch-action:manipulation!important;pointer-events:auto!important;position:relative!important;z-index:166!important}
      .buyer-main-btn.active,.buyer-main-item.open>.buyer-main-btn{background:var(--green)!important;color:#fff!important;border-color:var(--green)!important}
      .buyer-chevron{font-size:15px;line-height:1;transition:transform .18s ease;pointer-events:none}
      .buyer-main-item.open .buyer-chevron{transform:rotate(180deg)}
      .buyer-subnav{display:none;gap:6px;padding:2px 0 2px 11px;border-left:3px solid #d7a91f;margin-left:10px;position:relative;z-index:166;pointer-events:auto!important}
      .buyer-main-item.open .buyer-subnav{display:grid}
      .buyer-subnav button,.buyer-subnav a{width:100%!important;border:1px solid #e4eadf!important;background:#fff!important;color:#40523d!important;border-radius:11px!important;padding:11px 12px!important;text-align:left!important;text-decoration:none!important;font-weight:800!important;font-size:13px!important;cursor:pointer!important;touch-action:manipulation!important;pointer-events:auto!important;position:relative!important;z-index:167!important}
      .buyer-subnav button.active{background:#eef7ea!important;color:var(--green)!important;border-color:#bcd5b5!important}
      .buyer-subnav a.verify-sub{background:#fff7df!important;color:#745700!important;border-color:#efdda0!important}
      .buyer-help-card .step{padding:14px 0}
      @media(max-width:780px){.buyer-main-btn{min-height:52px!important}.buyer-subnav button,.buyer-subnav a{min-height:48px!important;display:flex!important;align-items:center!important}}
      @media(prefers-reduced-motion:reduce){.buyer-chevron{transition:none}}
    `;document.head.appendChild(s);
  }
  function ensureHelpViews(){
    const main=document.querySelector('main.content');if(!main)return;
    const footer=main.querySelector('.footer');
    if(!$('howitworks')){
      const sec=document.createElement('section');sec.id='howitworks';sec.className='view';sec.innerHTML=`<div class="card buyer-help-card"><h3>How It Works</h3><div class="step"><div class="stepNo">1</div><div><b>Choose your tickets</b><div class="note">Select your quantity and, if you want, request preferred raffle number(s).</div></div></div><div class="step"><div class="stepNo">2</div><div><b>Submit your details</b><div class="note">Enter your buyer information, payment method, reference, and proof when available.</div></div></div><div class="step"><div class="stepNo">3</div><div><b>Wait for seller confirmation</b><div class="note">The seller checks payment and confirms preferred raffle numbers if still available.</div></div></div><div class="step"><div class="stepNo">4</div><div><b>Receive your E‑Tickets</b><div class="note">Paste the Ticket Release Code in My E‑Tickets to save your official tickets.</div></div></div><div class="step"><div class="stepNo">5</div><div><b>Keep your Control No.</b><div class="note">The Control No. identifies the purchase while every raffle ticket has its own raffle number.</div></div></div></div>`;
      footer?main.insertBefore(sec,footer):main.appendChild(sec);
    }
    if(!$('faq')){
      const sec=document.createElement('section');sec.id='faq';sec.className='view';sec.innerHTML=`<div class="card buyer-help-card"><h3>Frequently Asked Questions</h3><div class="step"><div><b>Can I buy several tickets?</b><div class="note">Yes. Each paid ticket is a separate raffle entry.</div></div></div><div class="step"><div><b>Can I choose my raffle number?</b><div class="note">Yes. It is optional and the seller confirms availability.</div></div></div><div class="step"><div><b>What is the Control No.?</b><div class="note">It is the transaction reference for your purchase, separate from the raffle number.</div></div></div><div class="step"><div><b>When do I receive my E‑Tickets?</b><div class="note">After payment verification and seller ticket release.</div></div></div></div>`;
      footer?main.insertBefore(sec,footer):main.appendChild(sec);
    }
  }
  function closeDrawer(){
    $('sidebar')?.classList.remove('open');$('overlay')?.classList.remove('show');$('menuBtn')?.setAttribute('aria-expanded','false');
  }
  function activateView(view,keepDrawer){
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));
    document.querySelectorAll('.sideNav button[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    try{if(view==='tickets'&&typeof window.renderTickets==='function')window.renderTickets()}catch(e){}
    try{if(view==='paymentdetails'&&typeof window.renderPaymentStatus==='function')window.renderPaymentStatus()}catch(e){}
    syncActive(view);
    window.scrollTo({top:0,behavior:'smooth'});
    if(!keepDrawer)closeDrawer();
  }
  function syncActive(view){
    const group=VIEW_TO_GROUP[view]||'';
    document.querySelectorAll('.buyer-main-btn').forEach(b=>b.classList.toggle('active',b.dataset.directView===view||b.dataset.group===group));
    document.querySelectorAll('.buyer-subnav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  }
  function openGroup(name,defaultView){
    document.querySelectorAll('.buyer-main-item[data-menu-group]').forEach(item=>{
      const open=item.dataset.menuGroup===name;
      item.classList.toggle('open',open);
      item.querySelector('.buyer-main-btn')?.setAttribute('aria-expanded',open?'true':'false');
    });
    activateView(defaultView,true);
  }
  function buildMenu(){
    const nav=document.querySelector('#sidebar .sideNav');if(!nav)return;
    nav.dataset.structuredMenu='2';nav.className='sideNav buyer-main-nav';
    nav.innerHTML=`
      <div class="buyer-main-item"><button type="button" class="buyer-main-btn active" data-direct-view="home"><span>Home</span></button></div>
      <div class="buyer-main-item"><button type="button" class="buyer-main-btn" data-direct-view="buy"><span>Buy Tickets</span></button></div>
      <div class="buyer-main-item" data-menu-group="tickets"><button type="button" class="buyer-main-btn" data-group="tickets" data-default-view="tickets" aria-expanded="false"><span>My Tickets</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="request">My Request</button><button type="button" data-view="tickets">My E‑Tickets</button><a class="verify-sub" href="./verify.html">Verify Ticket</a></div></div>
      <div class="buyer-main-item" data-menu-group="payment"><button type="button" class="buyer-main-btn" data-group="payment" data-default-view="paymentdetails" aria-expanded="false"><span>Payment</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="paymentdetails">Payment Details & Status</button><button type="button" data-view="payment">Payment Guide</button></div></div>
      <div class="buyer-main-item" data-menu-group="raffle"><button type="button" class="buyer-main-btn" data-group="raffle" data-default-view="draw" aria-expanded="false"><span>Raffle Info</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="draw">Draw Information</button><button type="button" data-view="rules">Raffle Rules</button><button type="button" data-view="event">Event Details</button></div></div>
      <div class="buyer-main-item" data-menu-group="help"><button type="button" class="buyer-main-btn" data-group="help" data-default-view="howitworks" aria-expanded="false"><span>Help</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="howitworks">How It Works</button><button type="button" data-view="contact">Contact Organizer</button><button type="button" data-view="faq">FAQs</button></div></div>`;
    nav.querySelectorAll('.buyer-main-btn[data-direct-view]').forEach(btn=>{
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();activateView(btn.dataset.directView,false)});
    });
    nav.querySelectorAll('.buyer-main-btn[data-group]').forEach(btn=>{
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();openGroup(btn.dataset.group,btn.dataset.defaultView)});
    });
    nav.querySelectorAll('.buyer-subnav button[data-view]').forEach(btn=>{
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();activateView(btn.dataset.view,false)});
    });
    nav.querySelectorAll('a.verify-sub').forEach(a=>a.addEventListener('click',()=>closeDrawer()));
  }
  function init(){addStyle();ensureHelpViews();buildMenu();syncActive('home');setTimeout(()=>{ensureHelpViews();if(document.querySelector('#sidebar .sideNav')?.dataset.structuredMenu!=='2')buildMenu()},300)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();