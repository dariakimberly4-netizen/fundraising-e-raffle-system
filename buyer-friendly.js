(function(){
  const STYLE_ID='buyerSuperFriendlyStyleV1';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .friendlyWelcome{margin:0 0 16px;padding:15px 16px;border:1px solid #dce9d6;border-radius:18px;background:linear-gradient(135deg,#f8fcf5,#fffdf5);color:#315234;line-height:1.5}
      .friendlyWelcome strong{display:block;color:#246b2d;font-family:Georgia,'Times New Roman',serif;font-size:20px;margin-bottom:4px}
      .friendlySteps{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:16px 0}
      .friendlyStep{display:flex;gap:9px;align-items:center;padding:12px;border:1px solid #e2eadc;border-radius:15px;background:#fff}
      .friendlyStepNo{width:30px;height:30px;min-width:30px;border-radius:50%;display:grid;place-items:center;background:#246b2d;color:#fff;font-weight:950}
      .friendlyStep b{display:block;color:#246b2d;font-size:13px}.friendlyStep span{display:block;color:#6b7567;font-size:11px;line-height:1.35;margin-top:2px}
      #buyerForm{gap:0!important}
      .friendlySection{margin-top:14px;padding:16px;border:1px solid #e1e9dc;border-radius:18px;background:#fff}
      .friendlySectionTitle{display:flex;align-items:center;gap:9px;margin:0 0 12px;color:#246b2d;font-family:Georgia,'Times New Roman',serif;font-size:19px;font-weight:900}
      .friendlyNum{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#eef7ea;color:#246b2d;font-family:Inter,system-ui,sans-serif;font-size:13px;font-weight:950}
      .friendlyRequired,.friendlyOptional{display:inline-flex;align-items:center;margin-left:6px;padding:3px 7px;border-radius:999px;font-size:9px;font-weight:950;letter-spacing:.04em;text-transform:uppercase;vertical-align:middle}
      .friendlyRequired{background:#e8f5e5;color:#246b2d}.friendlyOptional{background:#f4f1e7;color:#7a6518}
      .friendlyHint{display:block;margin-top:-1px;color:#778171;font-size:11px;font-weight:650;line-height:1.35}
      #buyerForm label{font-size:14px!important;gap:7px!important;margin-bottom:12px}
      #buyerForm input,#buyerForm select,#buyerForm textarea{min-height:52px;font-size:16px!important;border-radius:15px!important;padding:14px!important}
      #buyerForm textarea{min-height:84px}
      #buyerForm .bundleRow{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
      #buyerForm .bundle{min-height:48px!important;border-radius:14px!important;padding:10px 8px!important}
      #buyerForm .qtyBox{margin-top:10px}
      #buyerForm .qtyBox button{width:52px!important;height:52px!important;min-width:52px!important;border-radius:14px!important;font-size:24px!important}
      #buyerForm .qtyBox input{height:52px!important;min-height:52px!important;font-size:20px!important}
      .friendlySubmitNote{margin:12px 0 0;padding:12px 13px;border-radius:14px;background:#f6faf3;color:#53644f;font-size:12px;line-height:1.45;text-align:center}
      #buyerForm button[type='submit']{width:100%!important;min-height:56px!important;font-size:16px!important;border-radius:15px!important;background:#ee3a16!important;color:#fff!important;box-shadow:0 9px 22px rgba(238,58,22,.20)!important}
      .friendlyHelp{margin-top:12px;text-align:center;color:#657260;font-size:12px;line-height:1.45}
      .friendlyHelp a{color:#246b2d;font-weight:900;text-decoration:none}
      #introduction .introLead,#introduction .introNote{text-align:center;max-width:760px;margin-left:auto!important;margin-right:auto!important}
      #introduction .eventLines{margin-top:18px;padding:13px 15px;border-radius:16px;background:#f7fbf4;border:1px solid #e0eadb;text-align:center}
      #introduction .actions{justify-content:center}
      @media(max-width:780px){
        .friendlySteps{grid-template-columns:1fr!important}.friendlyStep{padding:11px 12px}.friendlySection{padding:14px;margin-top:12px}.friendlySectionTitle{font-size:18px}
        #buyerForm .bundleRow{grid-template-columns:repeat(2,minmax(0,1fr))!important}
        #buyerForm .bundle{font-size:15px!important}.friendlyWelcome{padding:14px}.friendlyWelcome strong{font-size:19px}
      }
    `;
    document.head.appendChild(s);
  }
  function tagLabel(id,type,hint){
    const el=document.getElementById(id);if(!el)return null;
    const label=el.closest('label');if(!label)return null;
    if(!label.querySelector('.friendlyRequired,.friendlyOptional')){
      const badge=document.createElement('span');badge.className=type==='required'?'friendlyRequired':'friendlyOptional';badge.textContent=type==='required'?'Required':'Optional';
      const firstText=Array.from(label.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());
      if(firstText){const wrap=document.createElement('span');wrap.textContent=firstText.textContent.trim();firstText.replaceWith(wrap);wrap.appendChild(badge)}
      else label.insertBefore(badge,label.firstChild);
    }
    if(hint&&!label.querySelector('.friendlyHint')){const h=document.createElement('small');h.className='friendlyHint';h.textContent=hint;el.insertAdjacentElement('afterend',h)}
    return label;
  }
  function section(title,num,nodes){
    const box=document.createElement('div');box.className='friendlySection';
    const h=document.createElement('div');h.className='friendlySectionTitle';h.innerHTML=`<span class="friendlyNum">${num}</span>${title}`;box.appendChild(h);
    nodes.filter(Boolean).forEach(n=>box.appendChild(n));return box;
  }
  function setupIntro(){
    const hero=document.querySelector('#introduction .hero');if(!hero||hero.querySelector('.friendlySteps'))return;
    const steps=document.createElement('div');steps.className='friendlySteps';steps.innerHTML=`
      <div class="friendlyStep"><span class="friendlyStepNo">1</span><div><b>Choose your tickets</b><span>Buy one or several.</span></div></div>
      <div class="friendlyStep"><span class="friendlyStepNo">2</span><div><b>Send your payment details</b><span>The seller checks and confirms.</span></div></div>
      <div class="friendlyStep"><span class="friendlyStepNo">3</span><div><b>Receive your e-tickets</b><span>You get exactly what you paid for.</span></div></div>`;
    const note=hero.querySelector('.introNote');if(note)note.insertAdjacentElement('afterend',steps);
  }
  function setupBuy(){
    const view=document.getElementById('buy'),form=document.getElementById('buyerForm');if(!view||!form||form.dataset.friendly==='1')return;
    form.dataset.friendly='1';
    const card=form.closest('.card');const title=card?.querySelector('h3');const note=card?.querySelector('p.note');
    if(title)title.textContent='Get Your Raffle Tickets';
    if(note)note.textContent='Just follow the simple steps below. It only takes a minute.';
    const welcome=document.createElement('div');welcome.className='friendlyWelcome';welcome.innerHTML='<strong>Hi! Ready to support the PD Warriors? 💚</strong>Choose how many tickets you want, add your details, then send your request. You can review everything before your seller confirms it.';
    form.parentNode.insertBefore(welcome,form);

    const name=tagLabel('name','required','Use the name you want shown on your raffle record.');
    const contact=tagLabel('contact','required','Your seller can use this to confirm your ticket request.');
    const email=tagLabel('email','optional','You can leave this blank.');
    const method=tagLabel('method','required','Choose how you will pay.');
    const preferred=tagLabel('preferredNumbers','optional','Want a lucky number? Enter one or more numbers separated by commas.');
    const ref=tagLabel('ref','optional','Add your payment reference if you already have it.');
    const notes=tagLabel('notes','optional','Anything the seller should know.');
    const proof=tagLabel('proof','optional','You may attach payment proof if available.');

    const qty=document.getElementById('qty');let qtyBlock=qty?.parentElement;
    while(qtyBlock&&qtyBlock!==form&&!qtyBlock.querySelector('.bundleRow'))qtyBlock=qtyBlock.parentElement;
    if(qtyBlock===form)qtyBlock=null;
    const summary=form.querySelector('.summary');
    const consent=form.querySelector('.consent');
    const actions=form.querySelector('.actions');

    const oldGrid=form.querySelector('.grid');
    [name,contact,email,method].forEach(n=>{if(n&&oldGrid&&n.parentElement===oldGrid)n.remove()});
    if(oldGrid&&oldGrid.children.length===0)oldGrid.remove();

    const detailsWrap=document.createElement('div');detailsWrap.className='grid';[name,contact].forEach(n=>n&&detailsWrap.appendChild(n));
    const ticketNodes=[];if(qtyBlock)ticketNodes.push(qtyBlock);if(summary)ticketNodes.push(summary);
    const paymentWrap=document.createElement('div');paymentWrap.className='grid';[method,ref].forEach(n=>n&&paymentWrap.appendChild(n));
    const optionalWrap=document.createElement('div');optionalWrap.className='grid';[email,preferred,notes,proof].forEach(n=>n&&optionalWrap.appendChild(n));

    form.innerHTML='';
    form.appendChild(section('Your details',1,[detailsWrap]));
    form.appendChild(section('Choose your tickets',2,ticketNodes));
    form.appendChild(section('Payment details',3,[paymentWrap]));
    form.appendChild(section('Optional details',4,[optionalWrap]));
    const final=section('Review & send',5,[consent,actions]);form.appendChild(final);

    const submit=form.querySelector('button[type="submit"]');if(submit)submit.textContent='SEND MY TICKET REQUEST';
    if(actions){const n=document.createElement('div');n.className='friendlySubmitNote';n.textContent='Your tickets are issued only after the seller verifies your payment. You will receive exactly the number of e-tickets you purchased.';actions.insertAdjacentElement('beforebegin',n)}
    const help=document.createElement('div');help.className='friendlyHelp';help.innerHTML='Need help? Open <a href="#howitworks">How It Works</a> or <a href="#contact">Contact Organizer</a>.';final.appendChild(help);
  }
  function init(){addStyle();setupIntro();setupBuy()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
