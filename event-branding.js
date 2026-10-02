(function(){
  const EVENT={
    title:'GET TOGETHER 2027',
    subtitle:'Fundraising E-Raffle',
    org:"Parkinson's Disease Warriors Philippines",
    date:'January 16, 2027',
    time:'9:00 AM–1:00 PM',
    venue:'St. Luke’s Medical Center – Quezon City',
    theme:'New Hope: Moving Forward Beyond Parkinson’s.',
    logo:'./assets/pd-warriors-logo.jpg'
  };

  const BRAND_STYLE=`
  :root{
    --pd-green:#246b2d;
    --pd-leaf:#78a91f;
    --pd-red:#ee3a16;
    --pd-gold:#d7a91f;
    --pd-cream:#fffdf7;
    --pd-line:#dfe8d9;
  }
  body{background:linear-gradient(180deg,#ffffff 0%,#fbfdf8 55%,#fffdf8 100%)!important}
  header{background:rgba(255,255,255,.97)!important;border-bottom:1px solid #e6ecdf!important}
  header:after{content:"";display:block;height:3px;background:linear-gradient(90deg,var(--pd-green),var(--pd-leaf),var(--pd-gold),var(--pd-red))}
  .top{background:#fff!important}
  .brand{align-items:center!important}
  .logo{
    border-radius:50%!important;background:#fff!important;padding:0!important;overflow:hidden!important;
    border:2px solid var(--pd-gold)!important;box-shadow:0 5px 16px rgba(36,107,45,.14)!important;
  }
  .logo img{border-radius:50%!important;object-fit:cover!important}
  .brand h1{font-family:Georgia,'Times New Roman',serif!important;color:var(--pd-red)!important;font-weight:800!important;letter-spacing:.045em!important}
  .brand small{color:var(--pd-green)!important;font-weight:750!important}

  .nav button{background:#f2f7ee!important;color:var(--pd-green)!important;border:1px solid #e0ead8!important}
  .nav button.active{background:var(--pd-green)!important;color:#fff!important;border-color:var(--pd-green)!important;box-shadow:0 5px 14px rgba(36,107,45,.16)!important}
  .btn.primary{background:var(--pd-green)!important;color:#fff!important}
  .top-actions .btn.primary{background:var(--pd-red)!important}
  .btn.secondary{background:#f4f7ef!important;color:var(--pd-green)!important}
  .btn.gold{background:#fff5d8!important;color:#795b00!important}

  #dashboard .hero{
    background:#fff!important;color:#24311f!important;border:2px solid var(--pd-green)!important;
    box-shadow:0 12px 32px rgba(36,107,45,.10)!important;position:relative!important;
  }
  #dashboard .hero:before{
    content:"";position:absolute;left:-2px;right:-2px;top:-2px;height:7px;border-radius:28px 28px 0 0;
    background:linear-gradient(90deg,var(--pd-green),var(--pd-leaf) 32%,var(--pd-gold) 64%,var(--pd-red));z-index:1;
  }
  #dashboard .hero:after{
    content:"";position:absolute;right:-70px;bottom:-86px;width:220px;height:220px;border-radius:50%;
    border:3px solid rgba(238,58,22,.10)!important;box-shadow:0 0 0 18px rgba(120,169,31,.06),0 0 0 36px rgba(215,169,31,.045)!important;
  }
  #dashboard .hero .eyebrow{color:var(--pd-green)!important;font-weight:900!important}
  #dashboard .hero h2{font-family:Georgia,'Times New Roman',serif!important;color:var(--pd-red)!important;letter-spacing:.025em!important}
  #dashboard .hero p{color:#315234!important;font-weight:650!important}
  #dashboard .hero p strong{color:var(--pd-green)!important}
  #dashboard .hero p span{color:#5a4a1d!important}

  .card{border-color:var(--pd-line)!important;box-shadow:0 8px 22px rgba(36,107,45,.055)!important}
  .stat b{color:var(--pd-green)!important}.stat:nth-child(1) b{color:var(--pd-red)!important}.stat:nth-child(4) b{color:#9b7215!important}
  .section-title h2,.card h3{color:var(--pd-green)!important}
  .bar{background:#edf3e9!important}.bar span{background:linear-gradient(90deg,var(--pd-green),var(--pd-leaf),var(--pd-gold),var(--pd-red))!important}
  input:focus,select:focus,textarea:focus{border-color:var(--pd-green)!important;box-shadow:0 0 0 3px rgba(36,107,45,.10)!important}
  .ticket-head{background:linear-gradient(135deg,var(--pd-green),#3e842e)!important}
  .ticket-no{color:var(--pd-red)!important}
  .footer{color:var(--pd-green)!important}

  .pd-event-mark{
    display:flex;align-items:center;gap:14px;margin:0 0 14px;padding:14px 16px;background:#fff;
    border:1px solid var(--pd-line);border-radius:18px;box-shadow:0 7px 22px rgba(36,107,45,.06)
  }
  .pd-event-mark img{width:78px;height:78px;object-fit:cover;border-radius:50%;border:2px solid var(--pd-gold);flex:0 0 78px}
  .pd-event-mark .pd-name{font-family:Georgia,'Times New Roman',serif;color:var(--pd-green);font-size:13px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
  .pd-event-mark .pd-event{font-family:Georgia,'Times New Roman',serif;color:var(--pd-red);font-size:22px;font-weight:800;line-height:1.05;margin-top:3px}
  .pd-event-mark .pd-tag{font-size:11px;color:#62705d;margin-top:4px;letter-spacing:.04em}
  .pd-ribbon{display:flex;gap:5px;margin-top:7px}.pd-ribbon i{display:block;height:4px;border-radius:99px}.pd-ribbon i:nth-child(1){width:36%;background:var(--pd-green)}.pd-ribbon i:nth-child(2){width:20%;background:var(--pd-gold)}.pd-ribbon i:nth-child(3){width:32%;background:var(--pd-red)}

  html.force-phone .pd-event-mark{padding:10px 11px!important;gap:10px!important;margin-bottom:10px!important}
  html.force-phone .pd-event-mark img{width:56px!important;height:56px!important;flex-basis:56px!important}
  html.force-phone .pd-event-mark .pd-name{font-size:9px!important}
  html.force-phone .pd-event-mark .pd-event{font-size:17px!important}
  html.force-phone .pd-event-mark .pd-tag{font-size:9px!important}
  html.force-phone .logo{width:54px!important;height:54px!important;min-width:54px!important}
  `;

  function addBrandStyle(){
    if(document.getElementById('pdBrandStyle')) return;
    const s=document.createElement('style');s.id='pdBrandStyle';s.textContent=BRAND_STYLE;document.head.appendChild(s);
  }

  function addEventMark(){
    const dash=document.getElementById('dashboard');
    const hero=dash&&dash.querySelector('.hero');
    if(!dash||!hero||document.getElementById('pdEventMark')) return;
    const mark=document.createElement('div');mark.id='pdEventMark';mark.className='pd-event-mark';
    mark.innerHTML=`<img src="${EVENT.logo}" alt="Parkinson's Disease Warriors Philippines logo"><div style="min-width:0"><div class="pd-name">${EVENT.org}</div><div class="pd-event">${EVENT.title}</div><div class="pd-tag">Strength • Hope • Courage • Unity • Healing</div><div class="pd-ribbon"><i></i><i></i><i></i></div></div>`;
    hero.parentNode.insertBefore(mark,hero);
  }

  function applyEventBranding(){
    addBrandStyle();
    const logo=document.querySelector('.logo');
    if(logo){
      logo.innerHTML=`<img src="${EVENT.logo}" alt="Parkinson's Disease Warriors Philippines logo" style="width:100%;height:100%;object-fit:cover;display:block">`;
    }

    const brandTitle=document.getElementById('brandTitle')||document.querySelector('.brand h1');
    const brandOrg=document.getElementById('brandOrg')||document.querySelector('.brand small');
    if(brandTitle) brandTitle.textContent=EVENT.title;
    if(brandOrg) brandOrg.textContent=`${EVENT.subtitle} • ${EVENT.org}`;

    const hero=document.querySelector('#dashboard .hero');
    if(hero){
      const eyebrow=hero.querySelector('.eyebrow');
      const h2=hero.querySelector('h2');
      const p=hero.querySelector('p');
      if(eyebrow) eyebrow.textContent=`${EVENT.org} • Fundraising`;
      if(h2) h2.textContent=EVENT.title;
      if(p) p.innerHTML=`<strong>${EVENT.date}</strong><br><strong>${EVENT.time}</strong><br>${EVENT.venue}<br><span>Theme: “${EVENT.theme}”</span>`;
    }

    addEventMark();
    const footer=document.querySelector('.footer');
    if(footer) footer.textContent=`${EVENT.title} • ${EVENT.subtitle} • ${EVENT.org}`;

    try{
      if(typeof db!=='undefined'&&db&&db.settings){
        db.settings.title=EVENT.title;db.settings.org=EVENT.org;db.settings.drawDate='2027-01-16';
        db.settings.purpose=`${EVENT.theme} | ${EVENT.date}, ${EVENT.time} | ${EVENT.venue}`;
        localStorage.setItem('fundraising_eraffle_v1',JSON.stringify(db));
      }
    }catch(e){}
  }

  function init(){applyEventBranding();setTimeout(applyEventBranding,120);setTimeout(applyEventBranding,500)}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
