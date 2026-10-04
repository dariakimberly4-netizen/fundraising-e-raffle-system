(function(){
  const $=id=>document.getElementById(id);
  const PICKS=[7,11,25,88,100,365,777,1000,2027,7777,12345,20001];
  function cleanNums(raw,qty){
    const text=String(raw||'').trim();
    if(!text)return [];
    const parts=text.split(/[\s,;]+/).filter(Boolean);
    const nums=[];
    for(const p of parts){
      if(!/^\d+$/.test(p))throw new Error('Use numbers only, separated by commas.');
      const n=Number(p);
      if(n<1||n>99999)throw new Error('Each preferred number must be from 1 to 99999.');
      if(nums.includes(n))throw new Error('Do not repeat the same preferred number.');
      nums.push(n);
    }
    if(nums.length>qty)throw new Error('You cannot choose more preferred numbers than the ticket quantity.');
    return nums;
  }
  function fmt(n){return 'GT27-'+String(n).padStart(5,'0')}
  function getQty(){return Number(document.getElementById('qtyText')?.textContent||1)||1}
  function current(){try{return cleanNums($('preferredNumbers')?.value||'',getQty())}catch(e){return []}}
  function setNums(nums){
    const input=$('preferredNumbers');if(!input)return;
    input.value=nums.join(', ');
    input.dispatchEvent(new Event('input',{bubbles:true}));
    renderPicks();
  }
  function renderPicks(){
    const grid=$('numberPickGrid');if(!grid)return;
    const nums=current(),qty=getQty();
    grid.querySelectorAll('[data-number]').forEach(btn=>{
      const n=Number(btn.dataset.number),selected=nums.includes(n);
      btn.classList.toggle('selected',selected);
      btn.setAttribute('aria-pressed',selected?'true':'false');
      btn.disabled=!selected&&nums.length>=qty;
    });
    const count=$('pickCount');if(count)count.textContent=nums.length+' of '+qty+' selected';
  }
  function toggleNumber(n){
    const nums=current(),qty=getQty(),i=nums.indexOf(n);
    if(i>=0)nums.splice(i,1);else{
      if(nums.length>=qty){alert('You can choose up to '+qty+' raffle number'+(qty===1?'':'s')+' for this purchase.');return;}
      nums.push(n);
    }
    setNums(nums);
  }
  function init(){
    const buy=$('buyCard');
    if(!buy||$('preferredNumbers'))return;
    const summary=buy.querySelector('.summary');
    if(!summary)return;
    const style=document.createElement('style');
    style.textContent='#numberPickGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.numberPick{min-height:46px;border:1px solid #d6e2d0;border-radius:12px;background:#f7faf5;color:var(--green);font-weight:950;padding:8px}.numberPick.selected{background:var(--green);color:#fff;border-color:var(--green);box-shadow:0 6px 14px rgba(36,107,45,.18)}.numberPick:disabled{opacity:.38}.pickerHead{display:flex;justify-content:space-between;gap:10px;align-items:center}.pickerHead b{color:var(--green)}#pickCount{font-size:11px;color:var(--muted);font-weight:850}@media(max-width:480px){#numberPickGrid{grid-template-columns:repeat(2,1fr)}}';
    document.head.appendChild(style);
    const wrap=document.createElement('div');
    wrap.style.marginTop='12px';
    wrap.innerHTML='<div class="pickerHead"><b>Pick Your Raffle Number</b><span id="pickCount">0 selected</span></div><div class="small" style="margin-top:5px">Tap a number below, or type your own number from 1 to 99999. You may choose up to your ticket quantity.</div><div id="numberPickGrid">'+PICKS.map(n=>'<button type="button" class="numberPick" data-number="'+n+'">'+fmt(n)+'</button>').join('')+'</div><label style="margin-top:10px">Custom raffle number(s) — optional<input id="preferredNumbers" inputmode="numeric" placeholder="Example: 7, 25, 2027"></label><div class="small" style="margin-top:6px">Selected numbers are subject to availability. If you leave this blank, the seller can assign available numbers.</div>';
    buy.insertBefore(wrap,summary);
    wrap.querySelectorAll('[data-number]').forEach(btn=>btn.addEventListener('click',()=>toggleNumber(Number(btn.dataset.number))));
    $('preferredNumbers').addEventListener('input',renderPicks);
    document.querySelectorAll('[data-q]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(renderPicks,0)));
    renderPicks();

    const toReview=$('toReview');
    if(toReview&&typeof toReview.onclick==='function'){
      const original=toReview.onclick;
      toReview.onclick=function(e){
        const q=getQty();
        let nums;
        try{nums=cleanNums($('preferredNumbers').value,q)}catch(err){alert(err.message);return}
        original.call(this,e);
        if(window.__demoDraft){
          window.__demoDraft.preferredNumbers=nums;
          window.__demoDraft.preferredTicketNos=nums.map(fmt);
          const rs=$('reviewSummary');
          if(rs){
            const old=rs.querySelector('[data-preferred-row]');if(old)old.remove();
            const row=document.createElement('div');row.className='kv';row.dataset.preferredRow='1';
            row.innerHTML='<span>Chosen raffle number(s)</span><b>'+(nums.length?nums.map(fmt).join(', '):'No preference')+'</b>';
            rs.appendChild(row);
          }
        }
      };
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();