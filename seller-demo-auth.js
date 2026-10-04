(function(){
  const AUTH_KEY='gt27_seller_auth_v1',USER_KEY='gt27_seller_user_v1',NAME_KEY='gt27_seller_name_v1';
  if(sessionStorage.getItem(AUTH_KEY)!=='1'||!sessionStorage.getItem(USER_KEY)){
    location.replace('./seller-demo-login.html');
    return;
  }
  function init(){
    const header=document.querySelector('header');
    if(!header||document.getElementById('sellerDemoLogout'))return;
    const wrap=document.createElement('div');wrap.style.display='flex';wrap.style.alignItems='center';wrap.style.gap='8px';
    const who=document.createElement('span');who.style.fontSize='11px';who.style.fontWeight='900';who.style.color='var(--green)';who.textContent=sessionStorage.getItem(NAME_KEY)||'Seller';
    const out=document.createElement('button');out.id='sellerDemoLogout';out.type='button';out.textContent='LOG OUT';out.style.minHeight='38px';out.style.border='1px solid var(--line)';out.style.borderRadius='12px';out.style.padding='8px 10px';out.style.background='#fff';out.style.color='var(--red)';out.style.fontWeight='950';out.onclick=function(){sessionStorage.removeItem(AUTH_KEY);sessionStorage.removeItem(USER_KEY);sessionStorage.removeItem('gt27_seller_role_v1');sessionStorage.removeItem(NAME_KEY);location.replace('./seller-demo-login.html')};
    wrap.append(who,out);header.appendChild(wrap);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();