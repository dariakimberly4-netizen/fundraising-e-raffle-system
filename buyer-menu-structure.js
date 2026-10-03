(function(){
  const STYLE_ID='buyerMenuStructureStyleV1';
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
      .buyer-main-nav{display:grid;gap:9px}
      .buyer-main-item{display:grid;gap:6px}
      .buyer-main-btn{width:100%!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;border:1px solid var(--line)!important;background:#f3f8ef!important;color:var(--green)!important;border-radius:14px!important;padding:13px 14px!important;text-align:left!important;font-weight:900!important;cursor:pointer!important;touch-action:manipulation!important}
      .buyer-main-btn.active,.buyer-main-item.open>.buyer-main-btn{background:var(--green)!important;color:#fff!important;border-color:var(--green)!important}
      .buyer-chevron{font-size:15px;line-height:1;transition:transform .18s ease}
      .buyer-main-item.open .buyer-chevron{transform:rotate(180deg)}
      .buyer-subnav{display:none;gap:6px;padding:2px 0 2px 11px;border-left:3px solid #d7a91f;margin-left:10px}
      .buyer-main-item.open .buyer-subnav{display:grid}
      .buyer-subnav button,.buyer-subnav a{width:100%!important;border:1px solid #e4eadf!important;background:#fff!important;color:#40523d!important;border-radius:11px!important;padding:11px 12px!important;text-align:left!important;text-decoration:none!important;font-weight:800!important;font-size:13px!important;cursor:pointer!important;touch-action:manipulation!important}
      .buyer-subnav button.active{background:#eef7ea!important;color:var(--green)!important;border-color:#bcd5b5!important}
      .buyer-subnav a.verify-sub{background:#fff7df!important;color:#745700!important;border-color:#efdda0!important}
      .buyer-help-card .step{padding:14px 0}
      @media(max-width:780px){.buyer-main-btn{min-height:50px!important}.buyer-subnav button,.buyer-subnav a{min-height:46px!important;display:flex!important;align-items:center!important}}
      @media(prefers-reduced-motion:reduce){.buyer-chevron{transition:none}}
    `;document.head.appendChild(s);
  }

  function ensureHelpViews(){
    const main=document.querySelector('main.content');if(!main)return;
    const footer=main.querySelector('.footer');
    if(!$('howitworks')){
      const sec=document.createElement('section');sec.id='howitworks';sec.className='view';sec.innerHTML=`<div class="card buyer-help-card"><h3>How It Works</h3><div class="step"><div class="stepNo">1</div><div><b>Choose your tickets</b><div class="note">Select your quantity and, if you want, request preferred raffle number(s).</div></div></div><div class="step"><div class="stepNo">2</div><div><b>Submit your details</b><div class="note">Enter your buyer information, payment method, reference, and proof when available.</div></div></div><div class="step"><div class="stepNo">3</div><div><b>Wait for seller confirmation</b><div class="note">The seller checks payment and confirms that any preferred raffle numbers are still available.</div></div></div><div class="step"><div class="stepNo">4</div><div><b>Receive your E‑Tickets</b><div class="note">Paste the seller's Ticket Release Code in My E‑Tickets to save your official raffle tickets on this device.</div></div></div><div class="step"><div class="stepNo">5</div><div><b>Keep your Control No. and ticket numbers</b><div class="note">Your Control No. identifies the transaction. Each raffle ticket has its own separate raffle number and verification code.</div></div></div></div>`;
      footer?main.insertBefore(sec,footer):main.appendChild(sec);
    }
    if(!$('faq')){
      const sec=document.createElement('section');sec.id='faq';sec.className='view';sec.innerHTML=`<div class="card buyer-help-card"><h3>Frequently Asked Questions</h3><div class="step"><div><b>Can I buy more than one ticket?</b><div class="note">Yes. Each paid ticket is a separate raffle entry.</div></div></div><div class="step"><div><b>Can I choose my raffle number?</b><div class="note">Yes. Preferred numbers are optional and are confirmed by the seller only if still available.</div></div></div><div class="step"><div><b>What is the Control No.?</b><div class="note">It is the transaction reference for your purchase. It is different from your raffle ticket number.</div></div></div><div class="step"><div><b>When do I receive my E‑Tickets?</b><div class="note">After payment is verified and the seller releases your official ticket code.</div></div></div><div class="step"><div><b>Can two buyers use the same raffle number?</b><div class="note">No. The seller checks assigned ticket numbers before confirming a preferred number.</div></div></div></div>`;
      footer?main.insertBefore(sec,footer):main.appendChild(sec);
    }
  }

  function closeDrawer(){
    $('sidebar')?.classList.remove('open');$('overlay')?.classList.remove('show');
    $('menuBtn')?.setAttribute('aria-expanded','false');
  }

  function openView(view){
    if(typeof window.setView==='function') window.setView(view);
    else{
      document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));
    }
    if(view==='tickets')try{window.renderTickets?.()}catch(e){}
    syncActive(view);closeDrawer();
  }

  function syncActive(view){
    const group=VIEW_TO_GROUP[view]||'';
    document.querySelectorAll('.buyer-main-btn').forEach(b=>b.classList.toggle('active',b.dataset.directView===view||b.dataset.group===group));
    document.querySelectorAll('.buyer-subnav [data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  }

  function toggleGroup(name){
    document.querySelectorAll('.buyer-main-item[data-menu-group]').forEach(item=>{
      const isTarget=item.dataset.menuGroup===name;
      item.classList.toggle('open',isTarget?!item.classList.contains('open'):false);
      item.querySelector('.buyer-main-btn')?.setAttribute('aria-expanded',item.classList.contains('open')?'true':'false');
    });
  }

  function buildMenu(){
    const nav=document.querySelector('#sidebar .sideNav');if(!nav||nav.dataset.structuredMenu==='1')return;
    nav.dataset.structuredMenu='1';nav.className='sideNav buyer-main-nav';
    nav.innerHTML=`
      <div class="buyer-main-item"><button type="button" class="buyer-main-btn active" data-direct-view="home" data-view="home"><span>Home</span></button></div>
      <div class="buyer-main-item"><button type="button" class="buyer-main-btn" data-direct-view="buy" data-view="buy"><span>Buy Tickets</span></button></div>
      <div class="buyer-main-item" data-menu-group="tickets"><button type="button" class="buyer-main-btn" data-group="tickets" aria-expanded="false"><span>My Tickets</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="request">My Request</button><button type="button" data-view="tickets">My E‑Tickets</button><a class="verify-sub" href="./verify.html">Verify Ticket</a></div></div>
      <div class="buyer-main-item" data-menu-group="payment"><button type="button" class="buyer-main-btn" data-group="payment" aria-expanded="false"><span>Payment</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="paymentdetails">Payment Details & Status</button><button type="button" data-view="payment">Payment Guide</button></div></div>
      <div class="buyer-main-item" data-menu-group="raffle"><button type="button" class="buyer-main-btn" data-group="raffle" aria-expanded="false"><span>Raffle Info</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="draw">Draw Information</button><button type="button" data-view="rules">Raffle Rules</button><button type="button" data-view="event">Event Details</button></div></div>
      <div class="buyer-main-item" data-menu-group="help"><button type="button" class="buyer-main-btn" data-group="help" aria-expanded="false"><span>Help</span><span class="buyer-chevron">⌄</span></button><div class="buyer-subnav"><button type="button" data-view="howitworks">How It Works</button><button type="button" data-view="contact">Contact Organizer</button><button type="button" data-view="faq">FAQs</button></div></div>`;

    nav.addEventListener('click',e=>{
      const groupBtn=e.target.closest('.buyer-main-btn[data-group]');
      if(groupBtn){e.preventDefault();e.stopPropagation();toggleGroup(groupBtn.dataset.group);return}
      const viewBtn=e.target.closest('button[data-view]');
      if(viewBtn){e.preventDefault();e.stopPropagation();openView(viewBtn.dataset.view)}
    });
    nav.querySelectorAll('a.verify-sub').forEach(a=>a.addEventListener('click',()=>closeDrawer()));
  }

  function init(){
    addStyle();ensureHelpViews();buildMenu();syncActive('home');
    setTimeout(()=>{ensureHelpViews();buildMenu()},250);
    setTimeout(()=>{ensureHelpViews();buildMenu()},800);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();