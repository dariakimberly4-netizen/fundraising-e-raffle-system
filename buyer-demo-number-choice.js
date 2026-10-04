(function(){
  const TX_KEY='gt27_demo_tx_v2';
  const HISTORY_KEY='gt27_demo_buyer_history_v1';
  const $=id=>document.getElementById(id);
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}};
  const fmt=n=>'GT27-'+String(n).padStart(5,'0');
  const selected=[];

  function getQty(){return Math.max(1,Number($('qtyText')?.textContent||1)||1)}
  function usedNumbers(){
    const used=new Set();
    read(HISTORY_KEY,[]).forEach(o=>(o.tickets||[]).forEach(t=>{if(t.ticketNo)used.add(t.ticketNo)}));
    const tx=read(TX_KEY,null);
    if(tx?.status==='issued')(tx.tickets||[]).forEach(t=>{if(t.ticketNo)used.add(t.ticketNo)});
    return used;
  }
  function sync(){
    const input=$('preferredNumbers');
    if(input){input.value=selected.join(', ');input.dispatchEvent(new Event('input',{bubbles:true}));}
  }
  function toggle(n){
    if(!Number.isInteger(n)||n<1||n>99999)return alert('Choose a raffle number from 1 to 99999.');
    if(usedNumbers().has(fmt(n)))return alert(fmt(n)+' is already taken. Please choose another number.');
    const i=selected.indexOf(n);
    if(i>=0)selected.splice(i,1);else{
      if(selected.length>=getQty())return alert('You can pick up to '+getQty()+' raffle number'+(getQty()===1?'':'s')+' for this purchase.');
      selected.push(n);
    }
    selected.sort((a,b)=>a-b);sync();render();
  }
  function render(){
    const count=$('pickCount');if(count)count.textContent=selected.length+' of '+getQty()+' selected';
    const chips=$('pickedNumbers');
    if(chips){chips.innerHTML=selected.length?selected.map(n=>'<button type="button" class="pickedChip" data-remove="'+n+'">'+fmt(n)+' ×</button>').join(''):'<span class="small">No number selected yet.</span>';chips.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>toggle(Number(b.dataset.remove)));}
    const used=usedNumbers();
    document.querySelectorAll('#numberPickGrid [data-number]').forEach(btn=>{
      const n=Number(btn.dataset.number),taken=used.has(fmt(n)),on=selected.includes(n);
      btn.classList.toggle('selected',on);btn.classList.toggle('taken',taken);btn.disabled=taken||(!on&&selected.length>=getQty());
      btn.textContent=String(n).padStart(2,'0')+(taken?' ✕':'');
      btn.setAttribute('aria-pressed',on?'true':'false');
      btn.title=taken?'Already taken':on?'Selected':'Available';
    });
  }
  function init(){
    const buy=$('buyCard');if(!buy||$('numberPicker'))return;
    const summary=buy.querySelector('.summary');if(!summary)return;
    const style=document.createElement('style');
    style.textContent='#numberPickGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:7px;margin-top:10px}.numberPick{min-height:46px;border:1px solid #d6e2d0;border-radius:12px;background:#fff;color:var(--green);font-weight:950;padding:6px}.numberPick.selected{background:var(--green);color:#fff;border-color:var(--green);box-shadow:0 6px 14px rgba(36,107,45,.18)}.numberPick.taken{background:#f1f1ee;color:#aaa;text-decoration:line-through}.numberPick:disabled{opacity:.55}.pickerHead{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}.pickerHead b{color:var(--green);font-size:16px}.pickedChip{border:1px solid #b9d0b2;background:#eef7ea;color:var(--green);border-radius:999px;padding:9px 11px;font-weight:900;margin:4px 4px 0 0}@media(max-width:480px){#numberPickGrid{grid-template-columns:repeat(4,1fr)}}';
    document.head.appendChild(style);
    const wrap=document.createElement('div');wrap.id='numberPicker';wrap.style.marginTop='14px';
    wrap.innerHTML='<div style="border:1px solid var(--line);border-radius:18px;padding:14px;background:#fbfdf9"><div class="pickerHead"><div><b>Pick Your Raffle Number</b><div class="small">Tap an available number. Pick up to the number of tickets you are buying.</div></div><span id="pickCount" class="badge">0 selected</span></div><input id="preferredNumbers" type="hidden"><div id="pickedNumbers" style="margin-top:8px"></div><div class="small" style="margin:10px 0 6px">Quick pick: 01–50</div><div id="numberPickGrid">'+Array.from({length:50},(_,i)=>'<button type="button" class="numberPick" data-number="'+(i+1)+'">'+String(i+1).padStart(2,'0')+'</button>').join('')+'</div><div style="display:flex;gap:8px;margin-top:12px"><input id="customNumber" inputmode="numeric" pattern="[0-9]*" placeholder="Find another number, e.g. 2027" style="flex:1"><button type="button" id="addCustomNumber" class="btn secondary" style="min-height:48px">ADD</button></div><div class="small" style="margin-top:6px">You can choose any number from 1–99999. Taken numbers cannot be selected.</div></div>';
    buy.insertBefore(wrap,summary);
    wrap.querySelectorAll('[data-number]').forEach(btn=>btn.onclick=()=>toggle(Number(btn.dataset.number)));
    $('addCustomNumber').onclick=()=>{const raw=String($('customNumber').value||'').trim();if(!/^\d+$/.test(raw))return alert('Enter a raffle number from 1 to 99999.');toggle(Number(raw));$('customNumber').value=''};
    $('customNumber').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('addCustomNumber').click()}});
    document.querySelectorAll('[data-q]').forEach(btn=>btn.addEventListener('click',()=>{while(selected.length>Number(btn.dataset.q||1))selected.pop();sync();setTimeout(render,0)}));

    const toReview=$('toReview');
    if(toReview&&typeof toReview.onclick==='function'){
      const original=toReview.onclick;
      toReview.onclick=function(e){
        if(selected.length>getQty())return alert('Choose no more than '+getQty()+' raffle numbers.');
        original.call(this,e);
        if(window.__demoDraft){
          window.__demoDraft.preferredNumbers=[...selected];
          window.__demoDraft.preferredTicketNos=selected.map(fmt);
          const rs=$('reviewSummary');if(rs){const old=rs.querySelector('[data-preferred-row]');if(old)old.remove();const row=document.createElement('div');row.className='kv';row.dataset.preferredRow='1';row.innerHTML='<span>Chosen raffle number(s)</span><b>'+(selected.length?selected.map(fmt).join(', '):'No preference')+'</b>';rs.appendChild(row)}
        }
      };
    }
    sync();render();window.addEventListener('focus',render);window.addEventListener('storage',render);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();