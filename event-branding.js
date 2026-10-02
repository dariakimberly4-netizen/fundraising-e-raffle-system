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

  function applyEventBranding(){
    const logo=document.querySelector('.logo');
    if(logo){
      logo.innerHTML=`<img src="${EVENT.logo}" alt="Parkinson's Disease Warriors Philippines logo" style="width:100%;height:100%;object-fit:contain;border-radius:inherit;display:block">`;
      logo.style.background='#fff';
      logo.style.padding='2px';
      logo.style.overflow='hidden';
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
      if(p) p.innerHTML=`<strong>${EVENT.date} • ${EVENT.time}</strong><br>${EVENT.venue}<br><span style="opacity:.94">Theme: “${EVENT.theme}”</span>`;
    }

    const footer=document.querySelector('.footer');
    if(footer) footer.textContent=`${EVENT.title} • ${EVENT.subtitle} • ${EVENT.org}`;

    try{
      if(typeof db!=='undefined'&&db&&db.settings){
        db.settings.title=EVENT.title;
        db.settings.org=EVENT.org;
        db.settings.drawDate='2027-01-16';
        db.settings.purpose=`${EVENT.theme} | ${EVENT.date}, ${EVENT.time} | ${EVENT.venue}`;
        localStorage.setItem('fundraising_eraffle_v1',JSON.stringify(db));
      }
    }catch(e){}
  }

  function init(){
    applyEventBranding();
    setTimeout(applyEventBranding,120);
    setTimeout(applyEventBranding,500);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
