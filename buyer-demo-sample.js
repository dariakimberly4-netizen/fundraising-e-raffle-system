(function(){
  const $=id=>document.getElementById(id);
  function init(){
    const buy=$('buyCard');
    if(!buy||$('loadSampleBuyer'))return;
    const box=document.createElement('div');
    box.className='notice ok';
    box.style.margin='12px 0';
    box.innerHTML='<b>Sample Buyer</b><br>Use Maria Santos to quickly test the full buyer → seller → e-ticket flow.<button id="loadSampleBuyer" class="btn secondary full" type="button" style="margin-top:10px">USE SAMPLE BUYER — MARIA SANTOS</button>';
    const firstForm=buy.querySelector('.grid');
    if(firstForm)buy.insertBefore(box,firstForm);else buy.appendChild(box);
    $('loadSampleBuyer').onclick=function(){
      const values={
        name:'Maria Santos',
        contact:'0917 000 2027',
        email:'maria.santos@example.com',
        referred:'PD Warriors Demo',
        source:'Demo'
      };
      Object.entries(values).forEach(([id,val])=>{const el=$(id);if(el)el.value=val;});
      const method=$('method');if(method)method.value='GCash';
      this.textContent='SAMPLE BUYER LOADED';
      setTimeout(()=>$('name')?.focus(),80);
    };
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();