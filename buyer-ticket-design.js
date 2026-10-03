(function(){
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const ORDER_KEY='gt27_buyer_order_v2';
  const STYLE_ID='gt27OfficialTicketStyle';

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function load(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .officialTicket{position:relative;margin-top:16px;border:2px solid #d7a91f;border-radius:22px;overflow:hidden;background:#fffdf8;box-shadow:0 14px 34px rgba(36,107,45,.14);color:#223022}
      .officialTicket:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 88% 72%,rgba(238,58,22,.05),transparent 24%),radial-gradient(circle at 82% 82%,rgba(120,169,31,.06),transparent 30%)}
      .otTopBand{height:10px;background:linear-gradient(90deg,#07572f 0 54%,#d7a91f 54% 66%,#c71322 66% 84%,#07572f 84%)}
      .otHead{position:relative;display:grid;grid-template-columns:82px 1fr;gap:14px;align-items:center;padding:16px 18px 13px;border-bottom:1px solid #ead9a3;background:linear-gradient(180deg,#fff 0%,#fffdf7 100%)}
      .otLogo{width:78px;height:78px;border-radius:50%;object-fit:cover;border:3px solid #d7a91f;background:#fff;box-shadow:0 5px 16px rgba(0,0,0,.08)}
      .otOrg{font-size:11px;letter-spacing:.07em;text-transform:uppercase;font-weight:950;color:#07572f;line-height:1.35}
      .otTitle{font-family:Georgia,"Times New Roman",serif;font-size:29px;font-weight:950;line-height:1;color:#07572f;margin-top:3px}.otTitle b{color:#c71322}
      .otLabel{display:inline-flex;margin-top:8px;padding:6px 10px;border-radius:7px;background:linear-gradient(90deg,#e3b840,#f2d67a);color:#174d29;font-size:11px;font-weight:950;letter-spacing:.035em;text-transform:uppercase}
      .otTheme{margin-top:6px;font-family:Georgia,"Times New Roman",serif;font-style:italic;color:#315d39;font-size:13px}
      .otNumberWrap{position:relative;padding:14px 18px 12px;display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center}
      .otNumberLabel{background:#bd1020;color:#fff;border-radius:12px;padding:11px 10px;text-align:center;font-size:13px;font-weight:950;letter-spacing:.05em;text-transform:uppercase}
      .otNumber{font-size:34px;line-height:1;font-weight:1000;color:#c71322;letter-spacing:.02em;word-break:break-word}
      .otTip{margin:0 18px 12px;padding:10px 12px;border-radius:12px;background:#f2f8ee;border:1px solid #dce8d7;color:#3e573c;font-size:12px;line-height:1.5;text-align:center}
      .otGrid{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 18px 16px}
      .otField{border:1px solid #dce7d6;border-radius:14px;background:rgba(248,251,245,.96);padding:11px 12px;min-width:0}
      .otField span{display:block;font-size:10px;letter-spacing:.07em;text-transform:uppercase;font-weight:950;color:#07572f;margin-bottom:4px}.otField b{display:block;font-size:15px;line-height:1.4;color:#1f2e20;word-break:break-word}
      .otCode{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#07572f!important}.otValid{color:#187650!important}
      .otDivider{position:relative;margin:0 18px;border-top:1px dashed #d7a91f}
      .otEvent{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 18px 16px}
      .otEventItem{display:grid;grid-template-columns:36px 1fr;gap:9px;align-items:center}.otIcon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#07572f;color:#fff;font-size:16px;font-weight:900}
      .otEventItem span{display:block;font-size:9px;letter-spacing:.07em;text-transform:uppercase;font-weight:950;color:#07572f}.otEventItem b{display:block;font-size:13px;line-height:1.3;color:#263526;margin-top:2px}
      .otTulip{position:absolute;right:16px;bottom:58px;font-size:56px;opacity:.10;transform:rotate(-8deg);pointer-events:none}
      .otFooter{position:relative;background:#07572f;color:#fff;padding:14px 18px;text-align:center;font-size:11px;line-height:1.5;border-top:3px solid #d7a91f}.otFooter strong{display:block;color:#f7d96a;font-family:Georgia,"Times New Roman",serif;font-style:italic;font-size:17px;margin-bottom:3px}
      .otActions{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:14px 18px 17px;background:#fffdf8}.otActions .btn{min-height:52px;font-size:14px;border-radius:13px}
      @media(max-width:640px){.otHead{grid-template-columns:64px 1fr;padding:14px}.otLogo{width:60px;height:60px}.otTitle{font-size:22px}.otLabel{font-size:9px}.otTheme{font-size:12px}.otNumberWrap{grid-template-columns:92px 1fr;padding:12px 14px 10px}.otNumber{font-size:27px}.otNumberLabel{font-size:11px}.otTip{margin-left:14px;margin-right:14px}.otGrid,.otEvent{grid-template-columns:1fr;padding-left:14px;padding-right:14px}.otDivider{margin-left:14px;margin-right:14px}.otFooter{padding:12px 14px}.otTulip{font-size:44px}.otActions{grid-template-columns:1fr;padding:12px 14px 15px}.otActions .btn{width:100%;min-height:54px;font-size:15px}}
      @media print{body *{visibility:hidden!important}.officialTicket,.officialTicket *{visibility:visible!important}.officialTicket{position:absolute!important;left:0!important;top:0!important;width:100%!important;box-shadow:none!important}.otActions,.otTip{display:none!important}}
    `;
    document.head.appendChild(s);
  }

  function officialTicketMarkup(p,t,i,total,buyer){
    const no=t.number||t.ticketNo||'';
    const code=t.verificationCode||t.code||'';
    const control=p.controlNo||'—';
    return `<article class="officialTicket" data-ticket="${esc(no)}">
      <div class="otTopBand"></div>
      <div class="otHead">
        <img class="otLogo" src="./assets/pd-warriors-logo.jpg?v=7" alt="Parkinson's Disease Warriors Philippines logo">
        <div><div class="otOrg">Parkinson's Disease Warriors Philippines</div><div class="otTitle">GET TOGETHER <b>2027</b></div><div class="otLabel">Official Fundraising E‑Raffle Ticket</div><div class="otTheme">New Hope: Moving Forward Beyond Parkinson’s.</div></div>
      </div>
      <div class="otNumberWrap"><div class="otNumberLabel">Ticket No.</div><div class="otNumber">${esc(no)}</div></div>
      <div class="otTip">Keep this ticket safe. Each e-ticket is one separate raffle entry.</div>
      <div class="otGrid">
        <div class="otField"><span>Buyer</span><b>${esc(buyer)}</b></div>
        <div class="otField"><span>Control No.</span><b>${esc(control)}</b></div>
        <div class="otField"><span>Verification Code</span><b class="otCode">${esc(code)}</b></div>
        <div class="otField"><span>Status</span><b class="otValid">PAID / VALID</b></div>
      </div>
      <div class="otDivider"></div>
      <div class="otEvent">
        <div class="otEventItem"><div class="otIcon">📅</div><div><span>Date</span><b>January 16, 2027</b></div></div>
        <div class="otEventItem"><div class="otIcon">◷</div><div><span>Time</span><b>9:00 AM–1:00 PM</b></div></div>
        <div class="otEventItem"><div class="otIcon">●</div><div><span>Venue</span><b>St. Luke’s Medical Center – Quezon City</b></div></div>
        <div class="otEventItem"><div class="otIcon">♥</div><div><span>This Ticket</span><b>${i+1} of ${total}</b></div></div>
      </div>
      <div class="otTulip">🌷</div>
      <div class="otFooter"><strong>Thank you for your support!</strong>Keep your Ticket No., Control No., and Verification Code. You can use them anytime to check this ticket.</div>
      <div class="otActions"><a class="btn primary" href="./verify.html?ticket=${encodeURIComponent(no)}">CHECK MY TICKET</a><button class="btn gold otPrint" type="button">SAVE OR PRINT</button></div>
    </article>`;
  }

  function renderOfficialTickets(){
    const box=document.getElementById('ticketList');
    if(!box)return;
    const p=load(TICKET_KEY);
    if(!p?.tickets?.length){box.innerHTML='<div class="note" style="margin-top:12px">Your e-tickets will appear here after confirmation.</div>';return}
    const o=load(ORDER_KEY)||{};
    const buyer=p.buyerName||o.buyerName||'Buyer';
    box.innerHTML='<div class="summary"><div class="kv"><span>Control No.</span><b>'+esc(p.controlNo||'—')+'</b></div><div class="kv"><span>Your E‑Tickets</span><b>'+p.tickets.length+'</b></div></div>'+p.tickets.map((t,i)=>officialTicketMarkup(p,t,i,p.tickets.length,buyer)).join('');
    box.querySelectorAll('.otPrint').forEach(btn=>btn.addEventListener('click',()=>window.print()));
  }

  function init(){
    addStyle();
    window.renderTickets=renderOfficialTickets;
    renderOfficialTickets();
    const box=document.getElementById('ticketList');
    if(box){
      const obs=new MutationObserver(()=>{
        if(box.dataset.officialBusy==='1')return;
        const p=load(TICKET_KEY);
        if(p?.tickets?.length&&!box.querySelector('.officialTicket')){
          box.dataset.officialBusy='1';
          renderOfficialTickets();
          box.dataset.officialBusy='0';
        }
      });
      obs.observe(box,{childList:true,subtree:true});
    }
    window.addEventListener('storage',e=>{if(e.key===TICKET_KEY)renderOfficialTickets()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
