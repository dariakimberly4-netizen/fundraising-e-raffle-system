(function(){
  const STYLE_ID='buyerNativeMenuStyleV3';
  const VALID=new Set(['home','buy','request','tickets','paymentdetails','payment','draw','rules','event','howitworks','contact','faq']);
  const $=id=>document.getElementById(id);

  function addStyle(){
    if($(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #sidebar{z-index:220!important;pointer-events:auto!important}
      #sidebar *{pointer-events:auto!important}
      #overlay{z-index:200!important}
      #menuBtn{position:relative!important;z-index:240!important;pointer-events:auto!important;touch-action:manipulation!important}
      .topbar{z-index:250!important}
      .buyer-native-nav{display:grid!important;gap:9px!important}
      .buyer-native-link,.buyer-native-nav summary{display:flex!important;align-items:center!important;justify-content:space-between!important;width:100%!important;min-height:50px!important;border:1px solid var(--line)!important;background:#f3f8ef!important;color:var(--green)!important;border-radius:14px!important;padding:13px 14px!important;text-align:left!important;font:inherit!important;font-weight:900!important;text-decoration:none!important;cursor:pointer!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important;list-style:none!important;user-select:none!important}
      .buyer-native-nav summary::-webkit-details-marker{display:none!important}
      .buyer-native-nav details[open]>summary,.buyer-native-link.active{background:var(--green)!important;color:#fff!important;border-color:var(--green)!important}
      .buyer-native-nav summary:after{content:'⌄';font-size:16px;font-weight:900;transition:transform .15s ease}
      .buyer-native-nav details[open]>summary:after{transform:rotate(180deg)}
      .buyer-native-sub{display:grid!important;gap:6px!important;padding:7px 0 2px 12px!important;margin-left:10px!important;border-left:3px solid var(--gold)!important}
      .buyer-native-sub a{display:flex!important;align-items:center!important;min-height:46px!important;border:1px solid #e4eadf!important;background:#fff!important;color:#40523d!important;border-radius:11px!important;padding:11px 12px!important;text-decoration:none!important;font-weight:800!important;font-size:13px!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      .buyer-native-sub a.active{background:#eef7ea!important;color:var(--green)!important;border-color:#bcd5b5!important}
      .buyer-native-sub a.verify-native{background:#fff7df!important;color:#745700!important;border-color:#efdda0!important}
      .buyer-help-card .step{padding:14px 0}
      @media(prefers-reduced-motion:reduce){.buyer-native-nav summary:after{transition:none}}
    `;
    document.head.appendChild(s);
  }

  function ensureHelpViews(){
    const main=document.querySelector('main.content');if(!main)return;
    const footer=main.querySelector('.footer');
    if(!$('howitworks')){
      const sec=document.createElement('section');sec.id='howitworks';sec.className='view';
      sec.innerHTML=`<div class="card buyer-help-card"><h3>How It Works</h3><div class="step"><div class="stepNo">1</div><div><b>Choose your tickets</b><div class="note">Select your quantity and optional preferred raffle number(s).</div></div></div><div class="step"><div class="stepNo">2</div><div><b>Submit buyer and payment details</b><div class="note">Enter your information, payment reference, and proof when available.</div></div></div><div class="step"><div class="stepNo">3</div><div><b>Wait for seller confirmation</b><div class="note">The seller verifies payment and confirms available preferred numbers.</div></div></div><div class="step"><div class="stepNo">4</div><div><b>Receive your E‑Tickets</b><div class="note">Use the Ticket Release Code in My E‑Tickets.</div></div></div><div class="step"><div class="stepNo">5</div><div><b>Keep your Control No.</b><div class="note">The Control No. identifies the purchase; each raffle ticket has its own raffle number.</div></div></div></div>`;
      footer?main.insertBefore(sec,footer):main.appendChild(sec);
    }
    if(!$('faq')){
      const sec=document.createElement('section');sec.id='faq';sec.className='view';
      sec.innerHTML=`<div class="card buyer-help-card"><h3>Frequently Asked Questions</h3><div class="step"><div><b>Can I buy several tickets?</b><div class="note">Yes. Each paid ticket is a separate raffle entry.</div></div></div><div class="step"><div><b>Can I choose my raffle number?</b><div class="note">Yes. Preferred numbers are optional and subject to seller confirmation.</div></div></div><div class="step"><div><b>What is the Control No.?</b><div class="note">It is the transaction reference for your purchase and is separate from your raffle number.</div></div></div><div class="step"><div><b>When do I receive my E‑Tickets?</b><div class="note">After payment verification and seller ticket release.</div></div></div></div>`;
      footer?main.insertBefore(sec,footer):main.appendChild(sec);
    }
  }

  function menuHtml(){
    return `
      <a class="buyer-native-link" data-native-view="home" href="#home">Home</a>
      <a class="buyer-native-link" data-native-view="buy" href="#buy">Buy Tickets</a>
      <details data-native-group="tickets"><summary>My Tickets</summary><div class="buyer-native-sub"><a data-native-view="tickets" href="#tickets">My E‑Tickets</a><a data-native-view="request" href="#request">My Request</a><a class="verify-native" href="./verify.html">Verify Ticket</a></div></details>
      <details data-native-group="payment"><summary>Payment</summary><div class="buyer-native-sub"><a data-native-view="paymentdetails" href="#paymentdetails">Payment Details & Status</a><a data-native-view="payment" href="#payment">Payment Guide</a></div></details>
      <details data-native-group="raffle"><summary>Raffle Info</summary><div class="buyer-native-sub"><a data-native-view="draw" href="#draw">Draw Information</a><a data-native-view="rules" href="#rules">Raffle Rules</a><a data-native-view="event" href="#event">Event Details</a></div></details>
      <details data-native-group="help"><summary>Help</summary><div class="buyer-native-sub"><a data-native-view="howitworks" href="#howitworks">How It Works</a><a data-native-view="contact" href="#contact">Contact Organizer</a><a data-native-view="faq" href="#faq">FAQs</a></div></details>`;
  }

  function buildMenu(){
    const nav=document.querySelector('#sidebar .sideNav');if(!nav)return;
    if(nav.dataset.nativeMenu==='3')return;
    nav.dataset.nativeMenu='3';
    nav.className='sideNav buyer-native-nav';
    nav.innerHTML=menuHtml();
    nav.querySelectorAll('a[data-native-view]').forEach(a=>a.addEventListener('click',()=>setTimeout(syncFromHash,0)));
    nav.querySelectorAll('a.verify-native').forEach(a=>a.addEventListener('click',closeDrawer));
  }

  function closeDrawer(){
    $('sidebar')?.classList.remove('open');
    $('overlay')?.classList.remove('show');
    $('menuBtn')?.setAttribute('aria-expanded','false');
  }

  function showView(view){
    if(!VALID.has(view))view='home';
    const target=$(view);if(!target)return false;
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));
    document.querySelectorAll('[data-native-view]').forEach(a=>a.classList.toggle('active',a.dataset.nativeView===view));
    document.querySelectorAll('.buyer-native-nav details').forEach(d=>{
      const has=!!d.querySelector(`[data-native-view="${view}"]`);
      if(has)d.open=true;
    });
    try{if(view==='tickets'&&typeof window.renderTickets==='function')window.renderTickets()}catch(e){}
    try{if(view==='paymentdetails'&&typeof window.renderPaymentStatus==='function')window.renderPaymentStatus()}catch(e){}
    closeDrawer();
    window.scrollTo({top:0,behavior:'auto'});
    return true;
  }

  function syncFromHash(){
    const view=(location.hash||'#home').slice(1).toLowerCase();
    if(showView(view))return;
    setTimeout(()=>showView(view),120);
    setTimeout(()=>showView(view),500);
  }

  function init(){
    addStyle();ensureHelpViews();buildMenu();syncFromHash();
    window.addEventListener('hashchange',syncFromHash);
    setTimeout(()=>{ensureHelpViews();buildMenu();syncFromHash()},250);
    setTimeout(()=>{ensureHelpViews();buildMenu();syncFromHash()},900);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();