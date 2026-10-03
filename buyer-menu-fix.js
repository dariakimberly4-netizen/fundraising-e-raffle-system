(function(){
  const STYLE_ID='buyerMenuFixStyleV2';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #menuBtn{position:relative!important;z-index:260!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
      #sidebar{z-index:240!important;pointer-events:auto!important}
      #sidebar *{pointer-events:auto!important}
      #overlay{z-index:220!important;pointer-events:auto!important}
      .topbar{z-index:270!important}
    `;
    document.head.appendChild(s);
  }
  function closeMenu(){
    const sidebar=document.getElementById('sidebar');
    const overlay=document.getElementById('overlay');
    const menu=document.getElementById('menuBtn');
    sidebar?.classList.remove('open');
    overlay?.classList.remove('show');
    menu?.setAttribute('aria-expanded','false');
  }
  function bind(){
    addStyle();
    const menu=document.getElementById('menuBtn');
    const sidebar=document.getElementById('sidebar');
    const overlay=document.getElementById('overlay');
    if(menu&&!menu.dataset.drawerBoundV2){
      menu.dataset.drawerBoundV2='1';
      menu.onclick=null;
      menu.setAttribute('aria-controls','sidebar');
      menu.setAttribute('aria-expanded','false');
      menu.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        const open=!sidebar?.classList.contains('open');
        sidebar?.classList.toggle('open',open);
        overlay?.classList.toggle('show',open);
        menu.setAttribute('aria-expanded',open?'true':'false');
      });
    }
    if(overlay&&!overlay.dataset.drawerBoundV2){
      overlay.dataset.drawerBoundV2='1';
      overlay.onclick=null;
      overlay.addEventListener('click',function(e){e.preventDefault();closeMenu()});
    }
  }
  function init(){bind();setTimeout(bind,150);setTimeout(bind,600)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();