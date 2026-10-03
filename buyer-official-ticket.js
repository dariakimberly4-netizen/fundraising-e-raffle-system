(function(){
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const ORDER_KEY='gt27_buyer_order_v2';
  const STYLE_ID='gt27OfficialTicketStyle';
  let rendering=false;

  function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
  function load(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .officialTicket{position:relative;margin-top:16px;border:2px solid #d7a91f;border-radius:22px;overflow:hidden;background:linear-gradient(145deg,#fffef8 0%,#fff 46%,#f7fbf4 100%);box-shadow:0 14px 34px rgba(36,107,45,.12)}
      .officialTicket:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 90% 80%,rgba(238,58,22,.05),transparent 22%),radial-gradient(circle at 10% 12%,rgba(120,169,31,.08),transparent 24%)}
      .otRibbon{height:8px;background:linear-gradient(90deg,#0d5a2b 0 36%,#d7a91f 36% 47%,#ee3a16 47% 61%,#d7a91f 61% 70%,#0d5a2b 70% 100%)}
      .otHead{position:relative;display:grid;grid-template-columns:72px 1fr;gap:13px;align-items:center;padding:15px 16px 12px;border-bottom:1px solid #eadfb0}
      .otLogo{width:70px;height:70px;border-radius:50%;object-fit:cover;background:#fff;border:2px solid #d7a91f;box-shadow:0 4px 12px rgba(36,107,45,.12)}
      .otOrg{font-size:10px;line-height:1.35;letter-spacing:.08em;text-transform:uppercase;color:#18592f;font-weight:950}
      .otTitle{font-family:Georgia,"Times New Roman",serif;font-size:27px;line-height:1;color:#18592f;font-weight:900;margin-top:3px}.otTitle b{color:#c91822}
      .otGold{display:inline-block;margin-top:7px;padding:5px 9px;border-radius:7px;background:linear-gradient(90deg,#f3d36b,#d7a91f,#f3d36b);color:#174e2b;font-size:10px;font-weight:950;letter-spacing:.05em;text-transform:uppercase}
      .otTheme{margin-top:5px;font-family:Georgia,"Times New Roman",serif;font-style:italic;color:#345c3d;font-size:12px}
      .otBody{position:relative;padding:14px 16px 16px}
      .otTicketLine{display:grid;grid-template-columns:104px 1fr;align-items:center;border:2px solid #d7a91f;border-radius:15px;overflow:hidden;background:#fff;margin-bottom:13px}
      .otTicketLabel{height:100%;min-height:72px;display:flex;align-items:center;justify-content:center;text-align:center;background:linear-gradient(180deg,#c91620,#9e0d15);color:#fff;font-weight:950;letter-spacing:.05em;font-size:13px}
      .otTicketNo{padding:10px 13px;font-size:34px;line-height:1;font-weight:1000;color:#c5151d;letter-spacing:.02em;word-break:break-word}
      .otGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
      .otField{border:1px solid #dfe8d9;border-radius:13px;background:rgba(250,253,248,.94);padding:10px 11px;min-width:0}
      .otField span{display:block;font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:#246b2d;font-weight:950;margin-bottom:4px}.otField b{display:block;color:#1f2d20;font-size:14px;line-height:1.35;word-break:break-word}
      .otField .verifyCode{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#18592f;font-size:13px}
      .otStatus{color:#187650!important}
      .otDivider{height:1px;background:linear-gradient(90deg,transparent,#d7a91f 18%,#d7a91f 82%,transparent);margin:13px 0}
      .otEventGrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.otEvent{font-size:12px;line-height:1.45;color:#415241}.otEvent strong{display:block;color:#246b2d;font-size:10px;letter-spacing:.05em;text-transform:uppercase}
      .otThanks{text-align:center;margin:13px 0 2px;font-family:Georgia,"Times New Roman",serif;font-style:italic;color:#246b2d;font-size:18px}
      .otFooter{position:relative;background:#07542b;color:#fff;padding:11px 14px;text-align:center;font-size:10px;line-height:1.45;border-top:3px solid #d7a91f}
      .otActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.otActions .btn{flex:1 1 150px}
      .otCount{position:absolute;right:14px;top:12px;background:#fff4cb;border:1px solid #ead58b;border-radius:999px;padding:5px 8px;color:#725500;font-size:10px;font-weight:950}
      @media(max-width:640px){.otHead{grid-template-columns:58px 1fr;padding:13px 12px 11px}.otLogo{width:56px;height:56px}.otTitle{font-size:21px}.otGold{font-size:9px}.otTheme{font-size:11px}.otBody{padding:12px}.otTicketLine{grid-template-columns:88px 1fr}.otTicketLabel{min-height:66px;font-size:12px}.otTicketNo{font-size:27px}.otGrid,.otEventGrid{grid-template-columns:1fr}.otCount{position:static;display:inline-flex;margin:0 0 10px auto}.officialTicket{border-radius:18px}}
    `;
    document.head.appendChild(s);
  }

  function render(){
    if(rendering)return;
    const box=document.getElementById('ticketList');
    if(!box)return;
    const p=load(TICKET_KEY),o=load(ORDER_KEY);
    if(!p?.tickets?.length)return;
    const signature=JSON.stringify([p.controlNo,p.tickets.map(t=>t.number||t.ticketNo||'')]);
    if(box.dataset.officialSignature===signature)return;
    rendering=true;
    const buyer=esc(p.buyerName||o?.buyerName||'Buyer');
    const control=esc(p.controlNo||'—');
    const tickets=p.tickets;
    const summary='<div class="summary"><div class="kv"><span>Control No.</span><b>'+control+'</b></div><div class="kv"><span>Official E‑Tickets Received</span><b>'+tickets.length+'</b></div></div>';
    const cards=tickets.map((t,i)=>{
      const rawNo=String(t.number||t.ticketNo||'');
      const no=esc(rawNo);
      const code=esc(t.verificationCode||t.code||'');
      const verifyHref='./verify.html?ticket='+encodeURIComponent(rawNo);
      return '<article class="officialTicket">'+
        '<div class="otRibbon"></div>'+
        '<div class="otHead">'+
          '<img class="otLogo" src="./assets/pd-warriors-logo.jpg?v=7" alt="Parkinson\'s Disease Warriors Philippines logo">'+
          '<div><div class="otOrg">Parkinson\'s Disease Warriors Philippines</div><div class="otTitle">GET TOGETHER <b>2027</b></div><div class="otGold">Official Fundraising E‑Raffle Ticket</div><div class="otTheme">New Hope: Moving Forward Beyond Parkinson’s.</div></div>'+
        '</div>'+
        '<div class="otBody">'+
          '<div class="otCount">E‑TICKET '+(i+1)+' OF '+tickets.length+'</div>'+
          '<div class="otTicketLine"><div class="otTicketLabel">TICKET<br>NO.</div><div class="otTicketNo">'+no+'</div></div>'+
          '<div class="otGrid">'+
            '<div class="otField"><span>Buyer</span><b>'+buyer+'</b></div>'+
            '<div class="otField"><span>Control No.</span><b>'+control+'</b></div>'+
            '<div class="otField"><span>Verification Code</span><b class="verifyCode">'+code+'</b></div>'+
            '<div class="otField"><span>Status</span><b class="otStatus">PAID / VALID</b></div>'+
          '</div>'+
          '<div class="otDivider"></div>'+
          '<div class="otEventGrid">'+
            '<div class="otEvent"><strong>Date</strong>January 16, 2027</div>'+
            '<div class="otEvent"><strong>Time</strong>9:00 AM–1:00 PM</div>'+
            '<div class="otEvent"><strong>Venue</strong>St. Luke’s Medical Center – Quezon City</div>'+
            '<div class="otEvent"><strong>Theme</strong>New Hope: Moving Forward Beyond Parkinson’s.</div>'+
          '</div>'+
          '<div class="otThanks">Thank you for your support!</div>'+
          '<div class="otActions"><a class="btn secondary" href="'+verifyHref+'">Verify Ticket</a></div>'+
        '</div>'+
        '<div class="otFooter">This e‑ticket is part of the GET TOGETHER 2027 Fundraising E‑Raffle. Keep this ticket number and verification code for checking and organizer confirmation.</div>'+
      '</article>';
    }).join('');
    box.innerHTML=summary+cards;
    box.dataset.officialSignature=signature;
    rendering=false;
  }

  function init(){
    addStyle();
    render();
    const box=document.getElementById('ticketList');
    if(box)new MutationObserver(()=>{if(!rendering)requestAnimationFrame(render)}).observe(box,{childList:true,subtree:true});
    window.addEventListener('storage',render);
    document.addEventListener('click',e=>{if(e.target?.id==='receiveTickets')setTimeout(render,100)});
    const releaseFile=document.getElementById('releaseFile');if(releaseFile)releaseFile.addEventListener('change',()=>setTimeout(render,150));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
