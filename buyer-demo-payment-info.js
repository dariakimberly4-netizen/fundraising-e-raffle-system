(function(){
  function init(){
    const pay=document.getElementById('payCard');
    if(!pay||document.getElementById('paymentDestination'))return;
    const box=document.createElement('div');
    box.id='paymentDestination';
    box.style.cssText='margin:12px 0 14px;padding:14px;border:2px solid var(--green);border-radius:16px;background:#f7fbf4;text-align:center';
    box.innerHTML='<div style="font-size:11px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;color:var(--green)">Please send your payment through</div><div style="margin-top:7px;font-family:Georgia,serif;font-size:25px;font-weight:900;color:var(--red)">0919 091 6041</div><div style="margin-top:3px;font-size:16px;font-weight:900;color:var(--green)">Kimberly Daria</div><div style="margin-top:9px;font-size:12px;line-height:1.5;color:#566253">After sending your payment, enter the transaction/reference number below and upload your payment proof.</div>';
    const p=pay.querySelector('p.small');
    if(p)p.after(box);else pay.insertBefore(box,pay.children[1]||null);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('pageshow',init);
})();