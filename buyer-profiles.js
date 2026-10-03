(function(){
  const PROFILES_KEY='gt27_buyer_profiles_v1';
  const ACTIVE_KEY='gt27_buyer_active_profile_v1';
  const ORDER_KEY='gt27_buyer_order_v2';
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const DATA_PREFIX='gt27_buyer_profile_data_v1:';
  const STYLE_ID='gt27BuyerProfilesStyle';

  const readJSON=(k,fallback)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??fallback}catch(e){return fallback}};
  const writeJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const profiles=()=>readJSON(PROFILES_KEY,[]).filter(p=>p&&p.id&&p.name);
  const saveProfiles=p=>writeJSON(PROFILES_KEY,p);
  const activeId=()=>localStorage.getItem(ACTIVE_KEY)||'';
  const profileById=id=>profiles().find(p=>p.id===id)||null;
  const safe=(v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function snapshot(id){
    if(!id)return;
    const data={
      order:localStorage.getItem(ORDER_KEY),
      tickets:localStorage.getItem(TICKET_KEY),
      savedAt:new Date().toISOString()
    };
    writeJSON(DATA_PREFIX+id,data);
  }
  function restore(id){
    const data=readJSON(DATA_PREFIX+id,null);
    if(data&&typeof data==='object'){
      if(data.order===null||data.order===undefined)localStorage.removeItem(ORDER_KEY);else localStorage.setItem(ORDER_KEY,data.order);
      if(data.tickets===null||data.tickets===undefined)localStorage.removeItem(TICKET_KEY);else localStorage.setItem(TICKET_KEY,data.tickets);
    }else{
      localStorage.removeItem(ORDER_KEY);
      localStorage.removeItem(TICKET_KEY);
    }
  }
  function uid(){return 'B'+Date.now().toString(36).toUpperCase()+Math.random().toString(36).slice(2,6).toUpperCase()}
  async function hashPin(v){
    const b=new TextEncoder().encode(v),d=await crypto.subtle.digest('SHA-256',b);
    return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,'0')).join('');
  }

  // Preserve the current active buyer's latest global records before anything else runs.
  const startupActive=activeId();
  if(startupActive&&profileById(startupActive))snapshot(startupActive);

  function migrateLegacy(){
    if(profiles().length)return;
    const raw=localStorage.getItem(ORDER_KEY)||localStorage.getItem(TICKET_KEY);
    if(!raw)return;
    let o=null;try{o=JSON.parse(localStorage.getItem(ORDER_KEY)||'null')}catch(e){}
    const p={id:uid(),name:(o&&o.buyerName)||'Existing Buyer',contact:(o&&o.contact)||'',email:(o&&o.email)||'',createdAt:new Date().toISOString(),migrated:true};
    saveProfiles([p]);snapshot(p.id);
  }
  migrateLegacy();

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .bp-cover{position:fixed;inset:0;z-index:10000;background:linear-gradient(180deg,#f7fbf4,#fffdf6);display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto}
      .bp-card{width:min(100%,620px);background:#fff;border:1px solid #dfe8d9;border-radius:26px;box-shadow:0 22px 60px rgba(36,107,45,.18);overflow:hidden}
      .bp-stripe{height:7px;background:linear-gradient(90deg,#246b2d,#78a91f,#d7a91f,#ee3a16)}
      .bp-body{padding:24px}.bp-logo{width:78px;height:78px;border-radius:50%;object-fit:cover;border:3px solid #d7a91f;display:block;margin:0 auto 12px}
      .bp-kicker{text-align:center;color:#246b2d;font-weight:950;font-size:11px;letter-spacing:.1em;text-transform:uppercase}.bp-title{text-align:center;font-family:Georgia,'Times New Roman',serif;color:#246b2d;font-size:30px;margin:6px 0}.bp-sub{text-align:center;color:#657260;font-size:13px;line-height:1.5;margin:0 auto 18px;max-width:470px}
      .bp-list{display:grid;gap:9px;margin:12px 0 18px}.bp-person{display:flex;align-items:center;gap:12px;width:100%;border:1px solid #dfe8d9;background:#f7faf5;border-radius:16px;padding:13px 14px;cursor:pointer;text-align:left}.bp-person:hover{border-color:#78a91f}.bp-avatar{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#246b2d;color:#fff;font-weight:950;font-size:18px;flex:0 0 42px}.bp-person b{display:block;color:#246b2d;font-size:15px}.bp-person span{display:block;color:#6b7567;font-size:11px;margin-top:2px}.bp-open{margin-left:auto;color:#246b2d;font-weight:950;font-size:12px}
      .bp-new{border-top:1px solid #edf2ea;padding-top:17px}.bp-new h3{margin:0 0 4px;color:#246b2d;font-family:Georgia,'Times New Roman',serif}.bp-note{color:#6b7567;font-size:12px;line-height:1.45;margin:0 0 12px}.bp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.bp-field{display:grid;gap:5px;color:#40523d;font-size:12px;font-weight:850}.bp-field.full{grid-column:1/-1}.bp-field input{width:100%;border:1px solid #d6e2d0;border-radius:13px;padding:12px 13px;font-size:16px;outline:none}.bp-field input:focus{border-color:#246b2d;box-shadow:0 0 0 3px rgba(36,107,45,.1)}
      .bp-create{margin-top:12px;width:100%;min-height:50px;border:0;border-radius:14px;background:#246b2d;color:#fff;font-weight:950;font-size:15px;cursor:pointer}.bp-error{display:none;margin-top:10px;padding:10px 12px;border-radius:12px;background:#fff1ef;color:#a52d20;font-size:12px;font-weight:800}.bp-error.show{display:block}
      .bp-current{margin:0 0 12px;padding:11px 12px;border:1px solid #dfe8d9;background:#f7faf5;border-radius:14px}.bp-current small{display:block;color:#6b7567;font-size:10px;text-transform:uppercase;letter-spacing:.08em;font-weight:900}.bp-current b{display:block;color:#246b2d;margin-top:3px;font-size:14px}.bp-switch{width:100%;margin-top:8px;min-height:38px;border:1px solid #cfe0c7;background:#fff;color:#246b2d;border-radius:11px;font-weight:900;cursor:pointer}
      @media(max-width:560px){.bp-cover{padding:10px;align-items:flex-start}.bp-card{margin-top:8px;border-radius:22px}.bp-body{padding:19px 16px 20px}.bp-title{font-size:27px}.bp-grid{grid-template-columns:1fr}.bp-field.full{grid-column:auto}.bp-person{padding:12px}.bp-logo{width:70px;height:70px}}
    `;document.head.appendChild(s);
  }

  async function selectProfile(id){
    const p=profileById(id);if(!p)return;
    if(p.pinHash){
      const pin=prompt('Enter the 4-digit PIN for '+p.name+':');
      if(pin===null)return;
      if(!/^\d{4}$/.test(pin)||await hashPin(pin)!==p.pinHash){alert('Incorrect PIN.');return}
    }
    const old=activeId();if(old&&profileById(old))snapshot(old);
    restore(id);localStorage.setItem(ACTIVE_KEY,id);location.reload();
  }

  async function createProfile(form,errorBox){
    const fd=new FormData(form);const name=String(fd.get('name')||'').trim(),contact=String(fd.get('contact')||'').trim(),email=String(fd.get('email')||'').trim(),pin=String(fd.get('pin')||'').trim();
    if(!name||!contact){errorBox.textContent='Please enter the buyer name and mobile/contact number.';errorBox.classList.add('show');return}
    if(pin&& !/^\d{4}$/.test(pin)){errorBox.textContent='Optional PIN must be exactly 4 digits.';errorBox.classList.add('show');return}
    const p={id:uid(),name,contact,email,createdAt:new Date().toISOString()};if(pin)p.pinHash=await hashPin(pin);
    const list=profiles();list.push(p);saveProfiles(list);
    const old=activeId();if(old&&profileById(old))snapshot(old);
    restore(p.id);localStorage.setItem(ACTIVE_KEY,p.id);location.reload();
  }

  function chooser(){
    addStyle();
    const cover=document.createElement('div');cover.className='bp-cover';cover.id='buyerProfileChooser';
    const list=profiles();
    cover.innerHTML=`<section class="bp-card"><div class="bp-stripe"></div><div class="bp-body"><img class="bp-logo" src="./assets/pd-warriors-logo.jpg" alt="Parkinson's Disease Warriors Philippines logo"><div class="bp-kicker">GET TOGETHER 2027 • Buyer Portal</div><h1 class="bp-title">Who is buying tickets?</h1><p class="bp-sub">Choose your buyer profile so each person keeps their own requests, Control Nos. and e-tickets on this phone.</p><div class="bp-list">${list.map(p=>`<button class="bp-person" type="button" data-profile="${safe(p.id)}"><span class="bp-avatar">${safe((p.name||'?').trim().charAt(0).toUpperCase())}</span><span><b>${safe(p.name)}</b><span>${safe(p.contact||'No contact')} ${p.pinHash?'• PIN protected':''}</span></span><span class="bp-open">OPEN ›</span></button>`).join('')||'<div class="bp-note" style="text-align:center;padding:8px">No buyer profiles yet. Create the first one below.</div>'}</div><form class="bp-new" id="buyerProfileForm"><h3>Create Buyer Profile</h3><p class="bp-note">Quick sign up. This profile stays on this device and works offline.</p><div class="bp-grid"><label class="bp-field"><span>Full Name *</span><input name="name" autocomplete="name" required placeholder="Buyer name"></label><label class="bp-field"><span>Mobile / Contact *</span><input name="contact" autocomplete="tel" required placeholder="09xx xxx xxxx"></label><label class="bp-field"><span>Email — Optional</span><input name="email" type="email" autocomplete="email" placeholder="name@example.com"></label><label class="bp-field"><span>4-digit PIN — Optional</span><input name="pin" inputmode="numeric" maxlength="4" pattern="[0-9]*" placeholder="••••"></label></div><button class="bp-create" type="submit">CREATE PROFILE & CONTINUE</button><div class="bp-error" id="buyerProfileError"></div></form></div></section>`;
    document.body.appendChild(cover);
    cover.querySelectorAll('[data-profile]').forEach(b=>b.addEventListener('click',()=>selectProfile(b.dataset.profile)));
    const form=cover.querySelector('#buyerProfileForm'),err=cover.querySelector('#buyerProfileError');form.addEventListener('submit',e=>{e.preventDefault();err.classList.remove('show');createProfile(form,err)});
  }

  function installCurrentBuyerCard(){
    const id=activeId(),p=profileById(id);if(!p)return;
    const side=document.querySelector('.sidebar');if(side&&!document.getElementById('buyerCurrentProfile')){
      const card=document.createElement('div');card.className='bp-current';card.id='buyerCurrentProfile';card.innerHTML=`<small>Current Buyer</small><b>${safe(p.name)}</b><button class="bp-switch" type="button">Switch Buyer</button>`;
      const title=side.querySelector('.sideTitle');title?.insertAdjacentElement('afterend',card);if(!title)side.prepend(card);
      card.querySelector('.bp-switch').onclick=()=>{snapshot(id);localStorage.removeItem(ACTIVE_KEY);location.reload()};
    }
    // Friendly prefill for a new request.
    setTimeout(()=>{
      const n=document.getElementById('name'),c=document.getElementById('contact'),e=document.getElementById('email');
      if(n&&!n.value)n.value=p.name||'';if(c&&!c.value)c.value=p.contact||'';if(e&&!e.value)e.value=p.email||'';
    },60);
  }

  window.addEventListener('beforeunload',()=>{const id=activeId();if(id&&profileById(id))snapshot(id)});
  document.addEventListener('DOMContentLoaded',()=>{
    addStyle();
    const id=activeId();
    if(!id||!profileById(id)){chooser();return}
    installCurrentBuyerCard();
  },{once:true});
})();