(function(){
  const $=id=>document.getElementById(id);
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
  function init(){
    const buy=$('buyCard');
    if(!buy||$('preferredNumbers'))return;
    const summary=buy.querySelector('.summary');
    if(!summary)return;
    const wrap=document.createElement('div');
    wrap.style.marginTop='12px';
    wrap.innerHTML='<label>Preferred raffle number(s) — optional<input id="preferredNumbers" inputmode="numeric" placeholder="Example: 7, 25, 2027"></label><div class="small" style="margin-top:6px">Choose up to the number of tickets you are buying. Example: 7 becomes GT27-00007. Preferred numbers are subject to availability.</div>';
    buy.insertBefore(wrap,summary);

    const toReview=$('toReview');
    if(toReview&&typeof toReview.onclick==='function'){
      const original=toReview.onclick;
      toReview.onclick=function(e){
        const q=Number(document.getElementById('qtyText')?.textContent||1)||1;
        let nums;
        try{nums=cleanNums($('preferredNumbers').value,q)}catch(err){alert(err.message);return}
        original.call(this,e);
        if(window.__demoDraft){
          window.__demoDraft.preferredNumbers=nums;
          window.__demoDraft.preferredTicketNos=nums.map(fmt);
          const rs=$('reviewSummary');
          if(rs){
            const row=document.createElement('div');row.className='kv';
            row.innerHTML='<span>Preferred number(s)</span><b>'+(nums.length?nums.map(fmt).join(', '):'No preference')+'</b>';
            rs.appendChild(row);
          }
        }
      };
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();