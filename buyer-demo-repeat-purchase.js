(function(){
  const TX_KEY='gt27_demo_tx_v2';
  const PROFILE_KEY='gt27_demo_buyer_profile_v1';
  const HISTORY_KEY='gt27_demo_buyer_history_v1';
  const $=id=>document.getElementById(id);
  function read(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch(e){return fallback}}
  function write(key,val){localStorage.setItem(key,JSON.stringify(val))}
  function profileFrom(d){if(!d)return null;return {name:d.name||'',contact:d.contact||'',email:d.email||'',referred:d.referred||'',source:d.source||'',method:d.method||''}}
  function saveProfile(d){const p=profileFrom(d);if(p&&p.name&&p.contact)write(PROFILE_KEY,p)}
  function archiveIssued(d){if(!d||d.status!=='issued'||!Array.isArray(d.tickets)||!d.tickets.length)return;const h=read(HISTORY_KEY,[]);if(!h.some(x=>x.requestNo===d.requestNo)){h.unshift({requestNo:d.requestNo||'',issuedAt:d.issuedAt||new Date().toISOString(),controlNo:d.controlNo||'',qty:d.qty||d.tickets.length,tickets:d.tickets});write(HISTORY_KEY,h.slice(0,20));}}
  function prefill(){const p=read(PROFILE_KEY,null);if(!p)return;const map={name:'name',contact:'contact',email:'email',referred:'referred',source:'source'};Object.entries(map).forEach(([k,id])=>{const el=$(id);if(el&&!el.value)el.value=p[k]||''});const method=$('method');if(method&&p.method&&!method.value)method.value=p.method;const buy=$('buyCard');if(buy&&!buy.querySelector('#savedBuyerNote')){const n=document.createElement('div');n.id='savedBuyerNote';n.className='notice ok';n.style.marginBottom='12px';n.innerHTML='<b>Returning buyer</b><br>Your saved buyer information is already filled in. Choose your new quantity and preferred raffle number(s), then make a new payment.';buy.insertBefore(n,buy.children[1]||null)}}
  function beginNewBuy(){
    const d=read(TX_KEY,null);
    if(d&&['submitted','payment_verified'].includes(d.status)){
      alert('You still have an active request. Please use FOLLOW UP MY REQUEST until it is completed before starting a new buy.');
      return;
    }
    if(d){saveProfile(d);archiveIssued(d)}
    localStorage.removeItem(TX_KEY);
    document.querySelectorAll('#payCard,#reviewCard,#submittedCard,#returnedCard,#readyCard,#followUpCard').forEach(el=>el.classList.add('hidden'));
    const buy=$('buyCard');if(buy){buy.classList.remove('hidden');prefill();setTimeout(()=>buy.scrollIntoView({behavior:'smooth',block:'start'}),40)}else location.reload();
  }
  function addNewBuyButton(){
    const hero=document.querySelector('.hero');if(!hero||$('newBuyBtn'))return;
    const b=document.createElement('button');b.id='newBuyBtn';b.className='btn primary full';b.style.marginTop='8px';b.textContent='NEW BUY';b.onclick=beginNewBuy;
    const follow=$('heroFollowUpBtn');if(follow)hero.insertBefore(b,follow);else hero.appendChild(b);
  }
  function turnResetIntoRepeat(){const btn=$('resetDemo');if(!btn)return;btn.textContent='NEW BUY';btn.className='btn primary full';btn.onclick=beginNewBuy;}
  function saveOnConfirm(){const btn=$('confirmBtn');if(!btn||btn.dataset.repeatBound)return;btn.dataset.repeatBound='1';btn.addEventListener('click',()=>{setTimeout(()=>{const d=read(TX_KEY,null);saveProfile(d)},0)});}
  function init(){const d=read(TX_KEY,null);if(d){saveProfile(d);if(d.status==='issued')archiveIssued(d)}prefill();turnResetIntoRepeat();saveOnConfirm();setTimeout(addNewBuyButton,0);window.addEventListener('focus',()=>{const x=read(TX_KEY,null);if(x){saveProfile(x);if(x.status==='issued')archiveIssued(x)}turnResetIntoRepeat();prefill();addNewBuyButton()});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
