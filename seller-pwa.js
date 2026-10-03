(function(){
  const STATUS_ID='sellerOfflineStatus';
  const INSTALL_ID='sellerInstallApp';
  let deferredPrompt=null;

  function addStyle(){
    if(document.getElementById('sellerPwaStyle'))return;
    const style=document.createElement('style');
    style.id='sellerPwaStyle';
    style.textContent=`
      #${STATUS_ID}{display:inline-flex;align-items:center;gap:7px;min-height:38px;padding:8px 11px;border:1px solid #dfe8d9;border-radius:12px;background:#f7faf4;color:#246b2d;font-size:12px;font-weight:850;line-height:1.2}
      #${STATUS_ID} .seller-pwa-dot{width:9px;height:9px;border-radius:50%;background:#78a91f;box-shadow:0 0 0 3px rgba(120,169,31,.14)}
      #${STATUS_ID}.offline{background:#fff7df;color:#745700;border-color:#efdda0}
      #${STATUS_ID}.offline .seller-pwa-dot{background:#d7a91f;box-shadow:0 0 0 3px rgba(215,169,31,.16)}
      #${INSTALL_ID}{border:0;border-radius:12px;padding:10px 13px;background:#246b2d;color:#fff;font-weight:900;cursor:pointer;display:none}
      .seller-pwa-login-box{margin:12px auto 0;max-width:520px;display:flex;justify-content:center;gap:8px;align-items:center;flex-wrap:wrap;padding:0 12px}
      @media(max-width:900px){#${STATUS_ID}{font-size:11px;min-height:36px;padding:8px 10px}#${INSTALL_ID}{font-size:12px;padding:9px 11px}}
    `;
    document.head.appendChild(style);
  }

  function statusText(){
    return navigator.onLine ? 'Offline ready' : 'Offline mode';
  }

  function ensureUi(){
    addStyle();
    let status=document.getElementById(STATUS_ID);
    let install=document.getElementById(INSTALL_ID);
    if(!status){
      status=document.createElement('div');
      status.id=STATUS_ID;
      status.setAttribute('role','status');
      status.innerHTML='<span class="seller-pwa-dot" aria-hidden="true"></span><span></span>';
    }
    if(!install){
      install=document.createElement('button');
      install.id=INSTALL_ID;
      install.type='button';
      install.textContent='Install Seller App';
      install.addEventListener('click',async()=>{
        if(!deferredPrompt)return;
        deferredPrompt.prompt();
        try{await deferredPrompt.userChoice}catch(e){}
        deferredPrompt=null;
        install.style.display='none';
      });
    }
    const topActions=document.querySelector('.top-actions');
    if(topActions){
      if(!status.isConnected)topActions.insertBefore(status,topActions.firstChild);
      if(!install.isConnected)topActions.insertBefore(install,status.nextSibling);
    }else if(!status.isConnected){
      let box=document.querySelector('.seller-pwa-login-box');
      if(!box){box=document.createElement('div');box.className='seller-pwa-login-box';document.body.appendChild(box)}
      box.append(status,install);
    }
    updateStatus();
  }

  function updateStatus(){
    const status=document.getElementById(STATUS_ID);
    if(!status)return;
    status.classList.toggle('offline',!navigator.onLine);
    const text=status.querySelector('span:last-child');
    if(text)text.textContent=statusText();
    status.title=navigator.onLine
      ? 'This seller device has offline support after the app files are cached.'
      : 'You are working without internet. Seller data stays on this device.';
  }

  async function registerSw(){
    if(!('serviceWorker' in navigator))return;
    try{
      const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
      await navigator.serviceWorker.ready;
      ensureUi();
      const status=document.getElementById(STATUS_ID);
      if(status&&navigator.onLine)status.querySelector('span:last-child').textContent='Offline ready';
      if(reg.waiting)reg.waiting.postMessage?.({type:'SKIP_WAITING'});
    }catch(e){
      const status=document.getElementById(STATUS_ID);
      if(status){status.classList.add('offline');status.querySelector('span:last-child').textContent='Offline setup pending';}
    }
  }

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredPrompt=e;
    ensureUi();
    const btn=document.getElementById(INSTALL_ID);
    if(btn)btn.style.display='inline-flex';
  });
  window.addEventListener('appinstalled',()=>{
    deferredPrompt=null;
    const btn=document.getElementById(INSTALL_ID);
    if(btn)btn.style.display='none';
  });
  window.addEventListener('online',updateStatus);
  window.addEventListener('offline',updateStatus);

  function init(){ensureUi();registerSw()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
