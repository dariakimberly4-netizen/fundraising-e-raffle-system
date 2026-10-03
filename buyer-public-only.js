(function(){
  const STYLE_ID='gt27BuyerPublicOnlyStyle';
  const HIDDEN_HREFS=['seller-login.html','staff-portal.html'];
  const replacements=[
    [/Seller verifies payment/gi,'Payment is reviewed'],
    [/seller verifies payment/gi,'payment is reviewed'],
    [/seller ticket release/gi,'ticket issuance'],
    [/seller confirmation/gi,'organizer confirmation'],
    [/seller assigns/gi,'Organizer assigns'],
    [/seller’s/gi,"organizer's"],
    [/seller's/gi,"organizer's"],
    [/seller release file/gi,'ticket delivery file'],
    [/seller release/gi,'ticket delivery'],
    [/Ticket Release Code/gi,'Ticket Delivery Code'],
    [/ticket release code/gi,'ticket delivery code'],
    [/seller/gi,'organizer'],
    [/administrator/gi,'organizer'],
    [/admin/gi,'organizer']
  ];

  function replaceText(value){
    let out=String(value||'');
    for(const [re,to] of replacements)out=out.replace(re,to);
    return out;
  }

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .buyer-public-badge{display:inline-flex;align-items:center;justify-content:center;margin:0 auto 12px;padding:7px 11px;border-radius:999px;background:#eef7ea;border:1px solid #cfe2c9;color:#246b2d;font-size:10px;font-weight:950;letter-spacing:.07em;text-transform:uppercase}
      .buyer-public-note{margin:12px auto 0;max-width:620px;padding:11px 13px;border-radius:14px;background:#f7fbf4;border:1px solid #dce9d6;color:#496146;font-size:12px;line-height:1.5;text-align:center}
    `;
    document.head.appendChild(s);
  }

  function hidePrivateLinks(root=document){
    root.querySelectorAll?.('a[href]').forEach(a=>{
      const href=(a.getAttribute('href')||'').toLowerCase();
      if(HIDDEN_HREFS.some(x=>href.includes(x))||/\b(seller|admin|staff)[-_]?(login|portal)\b/i.test(href)){
        a.remove();
      }
    });
  }

  function polishHeader(){
    document.title='GET TOGETHER 2027 — Buy Raffle Tickets';
    const center=document.querySelector('.buyerCenterTitle');if(center)center.textContent='Buy Raffle Tickets';
    const label=document.querySelector('.buyerPortalLabel');if(label)label.textContent='Buyer Portal';
    const side=document.querySelector('.sideTitle');if(side)side.textContent='Raffle Menu';
    const hero=document.querySelector('#introduction .hero');
    if(hero&&!hero.querySelector('.buyer-public-badge')){
      const badge=document.createElement('div');badge.className='buyer-public-badge';badge.textContent='Public Buyer Portal';
      const eyebrow=hero.querySelector('.eyebrow');
      eyebrow?eyebrow.insertAdjacentElement('afterend',badge):hero.prepend(badge);
    }
    if(hero&&!hero.querySelector('.buyer-public-note')){
      const note=document.createElement('div');note.className='buyer-public-note';
      note.textContent='Everything a buyer needs is here: choose tickets, submit payment details, track your request, and receive your official e-tickets.';
      const actions=hero.querySelector('.actions');actions?actions.insertAdjacentElement('beforebegin',note):hero.appendChild(note);
    }
  }

  function processNode(root){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const p=node.parentElement;
      if(!p||['SCRIPT','STYLE','NOSCRIPT','TEXTAREA'].includes(p.tagName))return NodeFilter.FILTER_REJECT;
      if(p.closest('.code,.ticketCode,[id*="requestCode"],[id*="releaseCode"]'))return NodeFilter.FILTER_REJECT;
      return /seller|admin|ticket release code/i.test(node.nodeValue||'')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const v=replaceText(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v});
    root.querySelectorAll?.('input[placeholder],textarea[placeholder],button[title],a[title],[aria-label]').forEach(el=>{
      for(const attr of ['placeholder','title','aria-label']){
        if(!el.hasAttribute(attr))continue;
        const old=el.getAttribute(attr),next=replaceText(old);if(next!==old)el.setAttribute(attr,next);
      }
    });
    hidePrivateLinks(root.nodeType===1?root:document);
  }

  function init(){
    addStyle();polishHeader();processNode(document.body);hidePrivateLinks();
    const obs=new MutationObserver(muts=>{
      for(const m of muts){
        m.addedNodes.forEach(n=>{if(n.nodeType===1||n.nodeType===3)processNode(n.nodeType===1?n:n.parentElement)});
      }
      polishHeader();
    });
    obs.observe(document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
