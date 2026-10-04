(function(){
  const AUTH_KEY='gt27_seller_auth_v1',USER_KEY='gt27_seller_user_v1',NAME_KEY='gt27_seller_name_v1';
  if(sessionStorage.getItem(AUTH_KEY)!=='1'||!sessionStorage.getItem(USER_KEY)){
    location.replace('./seller-demo-login.html');
    return;
  }
  function logout(){
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem('gt27_seller_role_v1');
    sessionStorage.removeItem(NAME_KEY);
    location.replace('./seller-demo-login.html');
  }
  function init(){
    if(document.getElementById('sellerDemoLogoutDock'))return;
    const style=document.createElement('style');
    style.textContent='#sellerDemoLogoutDock{position:fixed;right:12px;bottom:14px;z-index:9999;display:flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--green,#246b2d);border-radius:16px;padding:8px 9px;box-shadow:0 10px 28px rgba(0,0,0,.16)}#sellerDemoLogoutDock .who{font-size:11px;font-weight:900;color:var(--green,#246b2d);max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#sellerDemoLogoutDock button{min-height:40px;border:0;border-radius:11px;padding:9px 12px;background:var(--red,#ee3a16);color:#fff;font-weight:950}';
    document.head.appendChild(style);
    const dock=document.createElement('div');dock.id='sellerDemoLogoutDock';
    const who=document.createElement('span');who.className='who';who.textContent=sessionStorage.getItem(NAME_KEY)||'Seller';
    const out=document.createElement('button');out.type='button';out.textContent='LOG OUT';out.onclick=logout;
    dock.append(who,out);document.body.appendChild(dock);

    const header=document.querySelector('header');
    if(header&&!document.getElementById('sellerDemoLogout')){
      const out2=document.createElement('button');out2.id='sellerDemoLogout';out2.type='button';out2.textContent='LOG OUT';out2.style.minHeight='38px';out2.style.border='1px solid var(--line)';out2.style.borderRadius='12px';out2.style.padding='8px 10px';out2.style.background='#fff';out2.style.color='var(--red)';out2.style.fontWeight='950';out2.onclick=logout;header.appendChild(out2);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();