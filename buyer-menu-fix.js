(function(){
  const STYLE_ID='buyerMenuFixStyleV1';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #menuBtn{position:relative!important;z-index:160!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #sidebar{z-index:150!important;pointer-events:auto!important}
      #sidebar .sideNav,#sidebar .sideNav button,#sidebar .sideNav a{pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #overlay{z-index:140!important;pointer-events:auto!important}
      .topbar{z-index:170!important}
    `;
    document.head.appendChild(s);
  }
  function closeMenu(){
    const sidebar=document.getElementById('sidebar');
    const overlay=document.getElementById('overlay');
    sidebar?.classList.remove('open');
    overlay?.classList.remove('show');
  }
  function bind(){
    addStyle();
    const menu=document.getElementById('menuBtn');
    const sidebar=document.getElementById('sidebar');
    const overlay=document.getElementById('overlay');
    if(menu&&!menu.dataset.menuFixBound){
      menu.dataset.menuFixBound='1';
      menu.onclick=null;
      menu.addEventListener('click',e=>{
        e.preventDefault();
        const open=!sidebar?.classList.contains('open');
        sidebar?.classList.toggle('open',open);
        overlay?.classList.toggle('show',open);
        menu.setAttribute('aria-expanded',open?'true':'false');
      });
    }
    if(overlay&&!overlay.dataset.menuFixBound){
      overlay.dataset.menuFixBound='1';
      overlay.onclick=null;
      overlay.addEventListener('click',e=>{e.preventDefault();closeMenu();menu?.setAttribute('aria-expanded','false')});
    }
    const nav=sidebar?.querySelector('.sideNav');
    if(nav&&!nav.dataset.menuFixBound){
      nav.dataset.menuFixBound='1';
      nav.addEventListener('click',e=>{
        const btn=e.target.closest('button[data-view]');
        if(!btn)return;
        try{if(typeof window.setView==='function')window.setView(btn.dataset.view)}catch(x){}
        closeMenu();menu?.setAttribute('aria-expanded','false');
      });
    }
  }
  function init(){bind();setTimeout(bind,150);setTimeout(bind,600);new MutationObserver(bind).observe(document.body,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();