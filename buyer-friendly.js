(function(){
  'use strict';
  const STYLE_ID='buyerSuperFriendlyStyleV3';

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .friendlyWelcome{margin:0 0 16px;padding:15px 16px;border:1px solid #dce9d6;border-radius:18px;background:linear-gradient(135deg,#f8fcf5,#fffdf5);color:#315234;line-height:1.5}
      .friendlyWelcome strong{display:block;color:#246b2d;font-family:Georgia,'Times New Roman',serif;font-size:20px;margin-bottom:4px}
      .friendlySteps{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:16px 0}
      .friendlyStep{display:flex;gap:9px;align-items:center;padding:12px;border:1px solid #e2eadc;border-radius:15px;background:#fff}
      .friendlyStepNo{width:30px;height:30px;min-width:30px;border-radius:50%;display:grid;place-items:center;background:#246b2d;color:#fff;font-weight:950}
      .friendlyStep b{display:block;color:#246b2d;font-size:13px}.friendlyStep span{display:block;color:#6b7567;font-size:11px;line-height:1.35;margin-top:2px}
      .friendlyRequired,.friendlyOptional{display:inline-flex;align-items:center;margin-left:6px;padding:3px 7px;border-radius:999px;font-size:9px;font-weight:950;letter-spacing:.04em;text-transform:uppercase;vertical-align:middle}
      .friendlyRequired{background:#e8f5e5;color:#246b2d}.friendlyOptional{background:#f4f1e7;color:#7a6518}
      .friendlyHint{display:block;color:#778171;font-size:11px;font-weight:650;line-height:1.35;margin-top:2px}
      #buyerForm label{font-size:14px!important;gap:7px!important;margin-bottom:12px;position:relative;z-index:1}
      #buyerForm input,#buyerForm select,#buyerForm textarea{min-height:52px;font-size:16px!important;border-radius:15px!important;padding:14px!important;position:relative!important;z-index:20!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-user-select:auto!important;user-select:auto!important}
      #referredBy,#referralSource{background:#fff!important;border:2px solid #b9d1ae!important;cursor:pointer!important;pointer-events:auto!important;position:relative!important;z-index:30!important}
      #referralSource{appearance:auto!important;-webkit-appearance:menulist!important}
      #buyerForm .bundle{min-height:48px!important;touch-action:manipulation}
      #buyerForm .qtyBox button{min-width:52px!important;height:52px!important;touch-action:manipulation}
      #buyerForm button[type='submit']{min-height:56px!important;font-size:16px!important;border-radius:15px!important;background:#ee3a16!important;color:#fff!important;box-shadow:0 9px 22px rgba(238,58,22,.20)!important}
      .friendlyReferralBox{grid-column:1/-1;border:1px solid #d9e8d3;background:#f8fcf5;border-radius:16px;padding:14px;margin:4px 0 2px;position:relative;z-index:2}
      .friendlyReferralTitle{font-family:Georgia,'Times New Roman',serif;color:#246b2d;font-size:17px;font-weight:900;margin-bottom:10px}
      .friendlyReferralGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative;z-index:3}
      #introduction .introLead,#introduction .introNote{text-align:center;max-width:760px;margin-left:auto!important;margin-right:auto!important}
      #introduction .eventLines{margin-top:18px;padding:13px 15px;border-radius:16px;background:#f7fbf4;border:1px solid #e0eadb;text-align:center}
      #introduction .actions{justify-content:center}
      @media(max-width:780px){
        .friendlySteps{grid-template-columns:1fr!important}.friendlyStep{padding:11px 12px}.friendlyWelcome{padding:14px}.friendlyWelcome strong{font-size:19px}
        .friendlyReferralGrid{grid-template-columns:1fr!important}
        #buyerForm input,#buyerForm select,#buyerForm textarea{font-size:16px!important;min-height:54px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function badgeAndHint(id,type,hint){
    const el=document.getElementById(id);
    if(!el) return null;
    const label=el.closest('label');
    if(!label) return null;
    if(!label.dataset.friendlyTagged){
      label.dataset.friendlyTagged='1';
      const badge=document.createElement('span');
      badge.className=type==='required'?'friendlyRequired':'friendlyOptional';
      badge.textContent=type==='required'?'Required':'Optional';
      const textNode=Array.from(label.childNodes).find(n=>n.nodeType===3&&n.textContent.trim());
      if(textNode){
        const title=document.createElement('span');
        title.textContent=textNode.textContent.trim();
        textNode.replaceWith(title);
        title.appendChild(badge);
      }else{
        label.insertBefore(badge,label.firstChild);
      }
      if(hint){
        const h=document.createElement('small');
        h.className='friendlyHint';h.textContent=hint;
        el.insertAdjacentElement('afterend',h);
      }
    }
    return label;
  }

  function setupIntro(){
    const hero=document.querySelector('#introduction .hero');
    if(!hero||hero.querySelector('.friendlySteps')) return;
    const steps=document.createElement('div');
    steps.className='friendlySteps';
    steps.innerHTML=`<div class="friendlyStep"><span class="friendlyStepNo">1</span><div><b>Choose your tickets</b><span>Buy one or several.</span></div></div><div class="friendlyStep"><span class="friendlyStepNo">2</span><div><b>Send your payment details</b><span>Your payment is reviewed.</span></div></div><div class="friendlyStep"><span class="friendlyStepNo">3</span><div><b>Receive your e-tickets</b><span>You get exactly what you paid for.</span></div></div>`;
    const note=hero.querySelector('.introNote');
    if(note) note.insertAdjacentElement('afterend',steps);
  }

  function setupBuy(){
    const form=document.getElementById('buyerForm');
    if(!form) return;
    const card=form.closest('.card');
    const title=card&&card.querySelector('h3');
    const note=card&&card.querySelector('p.note');
    if(title) title.textContent='Get Your Raffle Tickets';
    if(note) note.textContent='Just follow the simple form below. No buyer account is required.';

    if(!card.querySelector('.friendlyWelcome')){
      const welcome=document.createElement('div');
      welcome.className='friendlyWelcome';
      welcome.innerHTML='<strong>Support the PD Warriors 💚</strong>Choose your tickets, enter your details, tell us who referred you, then send your request.';
      form.parentNode.insertBefore(welcome,form);
    }

    badgeAndHint('name','required','Use the name you want shown on your raffle record.');
    badgeAndHint('contact','required','Enter your best contact number.');
    badgeAndHint('email','optional','You may leave this blank.');
    const referredLabel=badgeAndHint('referredBy','optional','Enter the person, member, volunteer, or group who referred you.');
    const sourceLabel=badgeAndHint('referralSource','optional','Tap this box and choose where you heard about the raffle.');
    badgeAndHint('method','required','Choose how you will pay.');
    badgeAndHint('preferredNumbers','optional','Enter preferred raffle number(s), subject to availability.');
    badgeAndHint('ref','optional','Add your payment reference if available.');
    badgeAndHint('notes','optional','Anything the organizer should know.');
    badgeAndHint('proof','optional','Attach payment proof when available.');

    // Keep the original form controls in place. Only group the two referral labels visually.
    // This avoids replacing form HTML or detaching native Android input/select controls.
    if(referredLabel&&sourceLabel&&!document.querySelector('.friendlyReferralBox')){
      const box=document.createElement('div');
      box.className='friendlyReferralBox';
      const heading=document.createElement('div');
      heading.className='friendlyReferralTitle';
      heading.textContent='Referral information';
      const grid=document.createElement('div');
      grid.className='friendlyReferralGrid';
      box.appendChild(heading);box.appendChild(grid);
      referredLabel.parentNode.insertBefore(box,referredLabel);
      grid.appendChild(referredLabel);
      grid.appendChild(sourceLabel);
    }

    ['referredBy','referralSource'].forEach(id=>{
      const el=document.getElementById(id);
      if(!el) return;
      el.disabled=false;
      el.removeAttribute('readonly');
      el.style.pointerEvents='auto';
      el.style.touchAction='manipulation';
    });

    const submit=form.querySelector('button[type="submit"]');
    if(submit) submit.textContent='SEND MY TICKET REQUEST';
  }

  function init(){addStyle();setupIntro();setupBuy();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
  setTimeout(init,400);
})();
