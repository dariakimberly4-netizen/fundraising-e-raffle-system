(function(){
  const EVENT={
    title:'GET TOGETHER 2027',
    subtitle:'Fundraising E-Raffle',
    org:"Parkinson's Disease Warriors Philippines",
    date:'January 16, 2027',
    time:'9:00 AM–1:00 PM',
    venue:'St. Luke’s Medical Center – Quezon City',
    theme:'New Hope: Moving Forward Beyond Parkinson’s.',
    logo:'./assets/pd-warriors-logo.jpg?v=20261003b'
  };
  const DASHBOARD_NEW_KEY='gt27_dashboard_new_seen_v1';
  const DASHBOARD_NEW_VERSION='recent-sales-pending-payments-v3';

  const BRAND_STYLE=`
  :root{--pd-green:#246b2d;--pd-leaf:#78a91f;--pd-red:#ee3a16;--pd-gold:#d7a91f;--pd-line:#dfe8d9}
  body{background:linear-gradient(180deg,#fff 0%,#fbfdf8 55%,#fffdf8 100%)!important}
  header{background:rgba(255,255,255,.97)!important;border-bottom:1px solid #e6ecdf!important;z-index:90!important}
  header:after{content:"";display:block;height:3px;background:linear-gradient(90deg,var(--pd-green),var(--pd-leaf),var(--pd-gold),var(--pd-red))}
  .top{background:#fff!important}.brand{align-items:center!important}
  .logo{border-radius:50%!important;background:#fff!important;padding:0!important;overflow:hidden!important;border:2px solid var(--pd-gold)!important;box-shadow:0 5px 16px rgba(36,107,45,.14)!important}
  .logo img{border-radius:50%!important;object-fit:cover!important}
  .brand h1{font-family:Georgia,'Times New Roman',serif!important;color:var(--pd-red)!important;font-weight:800!important;letter-spacing:.045em!important}
  .brand small{color:var(--pd-green)!important;font-weight:750!important}
  .btn.primary{background:var(--pd-green)!important;color:#fff!important}.top-actions .btn.primary{background:var(--pd-red)!important}
  .btn.secondary{background:#f4f7ef!important;color:var(--pd-green)!important}.btn.gold{background:#fff5d8!important;color:#795b00!important}

  #dashboard .hero{background:#fff!important;color:#24311f!important;border:2px solid var(--pd-green)!important;box-shadow:0 12px 32px rgba(36,107,45,.10)!important;position:relative!important}
  #dashboard .hero:before{content:"";position:absolute;left:-2px;right:-2px;top:-2px;height:7px;border-radius:28px 28px 0 0;background:linear-gradient(90deg,var(--pd-green),var(--pd-leaf) 32%,var(--pd-gold) 64%,var(--pd-red));z-index:1}
  #dashboard .hero:after{content:"";position:absolute;right:-70px;bottom:-86px;width:220px;height:220px;border-radius:50%;border:3px solid rgba(238,58,22,.10)!important;box-shadow:0 0 0 18px rgba(120,169,31,.06),0 0 0 36px rgba(215,169,31,.045)!important}
  #dashboard .hero .eyebrow{display:block!important;width:100%!important;text-align:center!important;color:var(--pd-green)!important;font-weight:950!important;font-size:13px!important;line-height:1.4!important;letter-spacing:.12em!important;margin-bottom:10px!important}
  #dashboard .hero h2{font-family:Georgia,'Times New Roman',serif!important;color:var(--pd-red)!important;letter-spacing:.025em!important}
  #dashboard .hero p{color:#315234!important;font-weight:650!important}#dashboard .hero p strong{color:var(--pd-green)!important}#dashboard .hero p span{color:#5a4a1d!important}
  .card{border-color:var(--pd-line)!important;box-shadow:0 8px 22px rgba(36,107,45,.055)!important}
  .stat b{color:var(--pd-green)!important}.stat:nth-child(1) b{color:var(--pd-red)!important}.stat:nth-child(4) b{color:#9b7215!important}
  .section-title h2,.card h3{color:var(--pd-green)!important}.bar{background:#edf3e9!important}.bar span{background:linear-gradient(90deg,var(--pd-green),var(--pd-leaf),var(--pd-gold),var(--pd-red))!important}
  input:focus,select:focus,textarea:focus{border-color:var(--pd-green)!important;box-shadow:0 0 0 3px rgba(36,107,45,.10)!important}
  .ticket-head{background:linear-gradient(135deg,var(--pd-green),#3e842e)!important}.ticket-no{color:var(--pd-red)!important}.footer{color:var(--pd-green)!important}
  #pdEventMark,.pd-event-mark{display:none!important}

  /* FORCE-VISIBLE NEW DASHBOARD FEATURE MARKER */
  #nav.pd-sidebar button.pd-dashboard-new{background:linear-gradient(135deg,#fff5ad,#ffe378)!important;color:#5f4700!important;border:3px solid var(--pd-gold)!important;box-shadow:0 0 0 4px rgba(215,169,31,.18),0 8px 20px rgba(116,83,0,.18)!important}
  #nav.pd-sidebar button.pd-dashboard-new.active{background:linear-gradient(135deg,#246b2d,#3f8732)!important;color:#fff!important;border:3px solid var(--pd-gold)!important;box-shadow:0 0 0 4px rgba(215,169,31,.18),0 8px 20px rgba(36,107,45,.22)!important}
  .pd-dashboard-new-badge{float:right;display:inline-flex;align-items:center;justify-content:center;padding:4px 8px;border-radius:999px;background:var(--pd-red);color:#fff;font-size:9px;font-weight:950;line-height:1;letter-spacing:.06em}
  #pdDashboardNewBanner{margin:0 0 14px!important;padding:12px 14px!important;border:3px solid var(--pd-gold)!important;border-radius:16px!important;background:linear-gradient(135deg,#fff8cf,#ffe790)!important;color:#5f4700!important;font-weight:900!important;box-shadow:0 0 0 4px rgba(215,169,31,.13),0 9px 22px rgba(116,83,0,.12)!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;flex-wrap:wrap!important}
  #pdDashboardNewBanner .pd-new-pill{display:inline-flex;padding:5px 9px;border-radius:999px;background:var(--pd-red);color:#fff;font-size:10px;font-weight:950;letter-spacing:.06em}

  /* SIDEBAR */
  #nav.pd-sidebar{position:fixed!important;left:0!important;top:0!important;bottom:0!important;width:245px!important;height:100vh!important;z-index:100!important;display:flex!important;flex-direction:column!important;gap:8px!important;padding:18px 14px!important;overflow-y:auto!important;background:#fff!important;border-right:1px solid var(--pd-line)!important;box-shadow:8px 0 28px rgba(36,107,45,.08)!important;pointer-events:auto!important;touch-action:manipulation!important}
  #nav.pd-sidebar .pd-side-head{padding:8px 8px 14px!important;margin-bottom:4px!important;border-bottom:1px solid #e8efe4!important;text-align:center!important;pointer-events:none!important}
  #nav.pd-sidebar .pd-side-head img{width:76px!important;height:76px!important;object-fit:cover!important;border-radius:50%!important;border:2px solid var(--pd-gold)!important;background:#fff!important;display:block!important;margin:0 auto 10px!important}
  #nav.pd-sidebar .pd-side-head strong{display:block!important;font-family:Georgia,'Times New Roman',serif!important;color:var(--pd-red)!important;font-size:20px!important;line-height:1.08!important}
  #nav.pd-sidebar .pd-side-head small{display:block!important;color:var(--pd-green)!important;font-size:11px!important;font-weight:800!important;margin-top:5px!important;letter-spacing:.04em!important}
  #nav.pd-sidebar button{width:100%!important;border:1px solid #dfe9d9!important;border-radius:16px!important;padding:13px 14px!important;background:#f2f7ee!important;color:var(--pd-green)!important;font-weight:850!important;text-align:left!important;white-space:normal!important;pointer-events:auto!important;touch-action:manipulation!important;position:relative!important;z-index:101!important}
  #nav.pd-sidebar button.active{background:var(--pd-green)!important;color:#fff!important;border-color:var(--pd-green)!important;box-shadow:0 6px 16px rgba(36,107,45,.15)!important}
  #pdSidebarToggle{display:none!important;pointer-events:auto!important}
  #pdSidebarBackdrop{display:none;position:fixed;inset:0;background:rgba(20,34,18,.38);z-index:50!important;pointer-events:auto!important}
  @media(min-width:901px){
    .app{max-width:none!important;margin:0!important}
    .top,main,.footer{margin-left:245px!important}
    main{max-width:1180px!important;margin-right:auto!important}
  }

  /* MOBILE DRAWER */
  @media(max-width:900px){
    #dashboard .hero .eyebrow{font-size:12px!important;text-align:center!important;line-height:1.45!important}
    header{z-index:90!important}
    .top,main,.footer{margin-left:0!important}
    #pdSidebarToggle{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important}
    #nav.pd-sidebar{width:min(82vw,300px)!important;height:var(--approved-mobile-height,100svh)!important;max-height:var(--approved-mobile-height,100svh)!important;transform:translateX(-105%)!important;transition:transform .24s ease!important;padding:16px 14px 22px!important;z-index:100!important}
    #nav.pd-sidebar.open{transform:translateX(0)!important}
    #nav.pd-sidebar .pd-side-head img{width:66px!important;height:66px!important}
    #nav.pd-sidebar .pd-side-head strong{font-size:19px!important}
    #nav.pd-sidebar button{padding:13px 14px!important;font-size:15px!important;text-align:left!important}
    #pdSidebarBackdrop.show{display:block!important;z-index:50!important}
    html.force-phone .logo{width:54px!important;height:54px!important;min-width:54px!important}
  }
  `;

  function addBrandStyle(){
    let s=document.getElementById('pdBrandStyle');
    if(!s){s=document.createElement('style');s.id='pdBrandStyle';document.head.appendChild(s)}
    s.textContent=BRAND_STYLE;
  }

  function applyDashboardNewHighlight(){
    let isSeen=false;
    try{isSeen=localStorage.getItem(DASHBOARD_NEW_KEY)===DASHBOARD_NEW_VERSION}catch(e){}
    const btn=document.querySelector('#nav button[data-view="dashboard"]');
    const dashboard=document.getElementById('dashboard');
    if(!btn||!dashboard)return;
    if(!isSeen){
      btn.classList.add('pd-dashboard-new');
      if(!btn.querySelector('.pd-dashboard-new-badge')){
        const badge=document.createElement('span');badge.className='pd-dashboard-new-badge';badge.textContent='NEW';btn.appendChild(badge);
      }
      let banner=document.getElementById('pdDashboardNewBanner');
      if(!banner){
        banner=document.createElement('div');banner.id='pdDashboardNewBanner';
        banner.innerHTML='<span><span class="pd-new-pill">NEW</span> &nbsp; Recent Sales + Pending Payments are now on your Seller Dashboard.</span>';
        const hero=dashboard.querySelector('.hero');
        if(hero)dashboard.insertBefore(banner,hero);else dashboard.insertBefore(banner,dashboard.firstChild);
      }
      if(!btn.dataset.pdDashboardNewBound){
        btn.dataset.pdDashboardNewBound='1';
        btn.addEventListener('click',()=>{
          try{localStorage.setItem(DASHBOARD_NEW_KEY,DASHBOARD_NEW_VERSION)}catch(e){}
          setTimeout(()=>{btn.classList.remove('pd-dashboard-new');btn.querySelector('.pd-dashboard-new-badge')?.remove();document.getElementById('pdDashboardNewBanner')?.remove()},800);
        },{once:true});
      }
    }else{
      btn.classList.remove('pd-dashboard-new');btn.querySelector('.pd-dashboard-new-badge')?.remove();document.getElementById('pdDashboardNewBanner')?.remove();
    }
  }

  function setupSidebar(){
    const nav=document.getElementById('nav');
    if(!nav)return;
    nav.classList.add('pd-sidebar');
    if(!nav.querySelector('.pd-side-head')){
      const head=document.createElement('div');
      head.className='pd-side-head';
      head.innerHTML=`<img src="${EVENT.logo}" alt="Parkinson's Disease Warriors Philippines logo"><strong>${EVENT.title}</strong><small>FUNDRAISING E-RAFFLE</small>`;
      nav.insertBefore(head,nav.firstChild);
    }

    let backdrop=document.getElementById('pdSidebarBackdrop');
    if(!backdrop){backdrop=document.createElement('div');backdrop.id='pdSidebarBackdrop';document.body.appendChild(backdrop)}

    let toggle=document.getElementById('pdSidebarToggle');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.id='pdSidebarToggle';toggle.type='button';toggle.className='btn secondary';toggle.innerHTML='☰ Menu';toggle.setAttribute('aria-label','Open navigation menu');toggle.setAttribute('aria-expanded','false');
      const actions=document.querySelector('.top-actions');
      if(actions)actions.insertBefore(toggle,actions.firstChild);else document.querySelector('.top')?.appendChild(toggle);
    }

    const open=()=>{nav.classList.add('open');backdrop.classList.add('show');toggle.setAttribute('aria-expanded','true')};
    const close=()=>{nav.classList.remove('open');backdrop.classList.remove('show');toggle.setAttribute('aria-expanded','false')};
    toggle.onclick=()=>nav.classList.contains('open')?close():open();
    backdrop.onclick=close;
    nav.querySelectorAll('button[data-view]').forEach(btn=>{
      btn.style.pointerEvents='auto';
      btn.onclick=()=>{
        const view=btn.dataset.view;
        try{if(typeof showView==='function')showView(view)}catch(e){}
        if(window.innerWidth<=900)close();
      };
    });
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }

  function applyEventBranding(){
    addBrandStyle();
    document.getElementById('pdEventMark')?.remove();
    document.querySelectorAll('.pd-event-mark').forEach(el=>el.remove());

    const logo=document.querySelector('.logo');
    if(logo)logo.innerHTML=`<img src="${EVENT.logo}" alt="Parkinson's Disease Warriors Philippines logo" style="width:100%;height:100%;object-fit:cover;display:block">`;

    const brandTitle=document.getElementById('brandTitle')||document.querySelector('.brand h1');
    const brandOrg=document.getElementById('brandOrg')||document.querySelector('.brand small');
    if(brandTitle)brandTitle.textContent=EVENT.title;
    if(brandOrg)brandOrg.textContent=`${EVENT.subtitle} • ${EVENT.org}`;

    const hero=document.querySelector('#dashboard .hero');
    if(hero){
      const eyebrow=hero.querySelector('.eyebrow'),h2=hero.querySelector('h2'),p=hero.querySelector('p');
      if(eyebrow)eyebrow.textContent=`${EVENT.org} • ${EVENT.subtitle}`;
      if(h2)h2.textContent=EVENT.title;
      if(p)p.innerHTML=`<strong>${EVENT.date}</strong><br><strong>${EVENT.time}</strong><br>${EVENT.venue}<br><span>Theme: “${EVENT.theme}”</span>`;
    }

    const footer=document.querySelector('.footer');
    if(footer)footer.textContent=`${EVENT.title} • ${EVENT.subtitle} • ${EVENT.org}`;
    setupSidebar();
    applyDashboardNewHighlight();

    try{
      if(typeof db!=='undefined'&&db&&db.settings){
        db.settings.title=EVENT.title;db.settings.org=EVENT.org;db.settings.drawDate='2027-01-16';
        db.settings.purpose=`${EVENT.theme} | ${EVENT.date}, ${EVENT.time} | ${EVENT.venue}`;
        localStorage.setItem('fundraising_eraffle_v1',JSON.stringify(db));
      }
    }catch(e){}
  }

  function init(){applyEventBranding();setTimeout(applyEventBranding,120);setTimeout(applyEventBranding,500)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
