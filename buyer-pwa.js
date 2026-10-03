(function(){
  const STYLE_ID='gt27BuyerPwaStyle';
  const STATUS_ID='gt27BuyerOfflineStatus';
  const INSTALL_ID='gt27BuyerInstallBtn';
  let deferredInstall=null;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      #${STATUS_ID}{position:fixed;left:50%;bottom:max(12px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:1200;max-width:calc(100vw - 28px);padding:10px 14px;border-radius:999px;font-size:12px;font-weight:900;line-height:1.25;text-align:center;box-shadow:0 10px 28px rgba(25,54,27,.18);transition:.2s ease;pointer-events:none}
      #${STATUS_ID}.ready{background:#e8f6e6;color:#246b2d;border:1px solid #bad8b4}
      #${STATUS_ID}.offline{background:#fff3cc;color:#6f5200;border:1px solid #ead48b}
      #${STATUS_ID}.error{background:#fde8e9;color:#9d2e35;border:1px solid #edb7bb}
      #${INSTALL_ID}{background:#fff4cb!important;color:#705300!important;border:1px solid #e4cb78!important}
    `;
    document.head.appendChild(style);
  }

  function statusEl(){
    let el=document.getElementById(STATUS_ID);
    if(!el){
      el=document.createElement('div');
      el.id=STATUS_ID;
      el.setAttribute('role','status');
      el.setAttribute('aria-live','polite');
      document.body.appendChild(el);
    }
    return el;
  }

  function showStatus(text,type,autoHide){
    addStyle();
    const el=statusEl();
    el.textContent=text;
    el.className=type||'ready';
    el.style.display='block';
    clearTimeout(el._hideTimer);
    if(autoHide){el._hideTimer=setTimeout(()=>{el.style.display='none'},autoHide)}
  }

  function updateNetworkStatus(){
    if(navigator.onLine){
      showStatus('Offline-ready • Your request and saved e-tickets stay on this phone.','ready',4500);
    }else{
      showStatus('Offline mode • You can still create requests and view saved e-tickets.','offline',0);
    }
  }

  function addInstallButton(){
    if(!deferredInstall||document.getElementById(INSTALL_ID))return;
    const actions=document.querySelector('#introduction .actions');
    if(!actions)return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.id=INSTALL_ID;
    btn.className='btn gold';
    btn.textContent='Install Buyer App';
    btn.addEventListener('click',async()=>{
      if(!deferredInstall)return;
      deferredInstall.prompt();
      try{await deferredInstall.userChoice}catch(e){}
      deferredInstall=null;
      btn.remove();
    });
    actions.appendChild(btn);
  }

  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredInstall=e;
    addInstallButton();
  });
  window.addEventListener('appinstalled',()=>{
    deferredInstall=null;
    document.getElementById(INSTALL_ID)?.remove();
    showStatus('Buyer app installed • Ready for offline use.','ready',5000);
  });
  window.addEventListener('online',updateNetworkStatus);
  window.addEventListener('offline',updateNetworkStatus);

  async function registerOffline(){
    addStyle();
    if(!('serviceWorker' in navigator)){
      showStatus('Offline installation is not supported by this browser.','error',6000);
      return;
    }
    try{
      const reg=await navigator.serviceWorker.register('./sw.js',{scope:'./'});
      try{await reg.update()}catch(e){}
      await navigator.serviceWorker.ready;
      updateNetworkStatus();
    }catch(e){
      showStatus('Could not prepare offline mode yet. Open this page once with internet and try again.','error',6500);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',registerOffline,{once:true});else registerOffline();
})();
