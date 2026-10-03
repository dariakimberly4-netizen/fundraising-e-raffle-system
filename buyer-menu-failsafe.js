(function(){
  const STYLE_ID='gt27BuyerMenuFailsafeStyle';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #menuBtn{pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:12020!important}
      .topbar{z-index:12010!important}
      @media(max-width:780px){
        #sidebar{z-index:12010!important;pointer-events:auto!important}
        #overlay{z-index:12000!important}
        #sidebar.open{transform:translateX(0)!important}
        #overlay.show{display:block!important;pointer-events:auto!important}
      }
      .buyer-intro-welcome{margin:14px 0 0;padding:15px 16px;border:1px solid #dce9d6;border-radius:16px;background:#f7fbf4;color:#355336;line-height:1.6;text-align:center}
      .buyer-intro-welcome b{color:#246b2d}
      .buyer-intro-cta{display:flex;justify-content:center;margin-top:14px}
      .buyer-intro-cta a{min-height:48px;padding:12px 18px;border-radius:13px;background:#ee3a16;color:#fff;font-weight:950;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;touch-action:manipulation}
    `;
    document.head.appendChild(s);
  }

  function enhanceIntroduction(){
    const hero=document.querySelector('#introduction .hero');
    if(!hero||hero.querySelector('.buyer-intro-welcome'))return;
    const welcome=document.createElement('div');
    welcome.className='buyer-intro-welcome';
    welcome.innerHTML='<b>Welcome to the GET TOGETHER 2027 Fundraising E-Raffle.</b><br>Every ticket you purchase helps support Parkinson\'s Disease Warriors Philippines and its community activities. You do not need to attend the event to join the fundraising raffle. Choose your tickets, complete your buyer and payment details, then submit your request for confirmation.';
    const cta=document.createElement('div');
    cta.className='buyer-intro-cta';
    cta.innerHTML='<a href="#buy" data-route="buy">BUY RAFFLE TICKETS</a>';
    const actions=hero.querySelector('.actions');
    if(actions){actions.insertAdjacentElement('beforebegin',welcome);welcome.insertAdjacentElement('afterend',cta)}
    else{hero.append(welcome,cta)}
  }

  function init(){
    addStyle();
    enhanceIntroduction();

    const menu=document.getElementById('menuBtn');
    const sidebar=document.getElementById('sidebar');
    const overlay=document.getElementById('overlay');
    if(!menu||!sidebar||!overlay)return;

    menu.disabled=false;
    menu.removeAttribute('disabled');
    menu.setAttribute('aria-expanded',sidebar.classList.contains('open')?'true':'false');

    function setMenu(open){
      sidebar.classList.toggle('open',!!open);
      overlay.classList.toggle('show',!!open);
      menu.setAttribute('aria-expanded',open?'true':'false');
    }

    function routeTo(id,updateHash=true){
      const target=document.getElementById(id)||document.getElementById('introduction');
      if(!target)return;
      document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v===target));
      document.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.getAttribute('data-route')===target.id));
      setMenu(false);
      if(updateHash){
        try{history.replaceState(null,'','#'+target.id)}catch(e){location.hash=target.id}
      }
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }

    menu.addEventListener('click',function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      setMenu(!sidebar.classList.contains('open'));
    },true);

    overlay.addEventListener('click',function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      setMenu(false);
    },true);

    document.addEventListener('click',function(e){
      const a=e.target.closest&&e.target.closest('[data-route]');
      if(!a)return;
      const id=a.getAttribute('data-route')||(a.getAttribute('href')||'').replace(/^#/, '');
      if(!id)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      routeTo(id,true);
    },true);

    window.addEventListener('hashchange',()=>routeTo((location.hash||'#introduction').slice(1),false));
    routeTo((location.hash||'#introduction').slice(1),false);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
