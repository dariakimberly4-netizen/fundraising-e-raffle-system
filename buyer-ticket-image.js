(function(){
  const ORDER_KEY='gt27_buyer_order_v2';
  const TICKET_KEY='gt27_buyer_tickets_v1';
  const STYLE_ID='gt27TicketImageStyle';

  function load(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch(e){return null}}
  function safe(v,fallback='—'){const s=String(v??'').trim();return s||fallback}
  function ticketNo(t){return safe(t?.number||t?.ticketNo,'GT27-00000')}
  function ticketCode(t){return safe(t?.verificationCode||t?.code,'—')}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .officialTicketActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
      .officialTicketActions button{min-height:48px;border:0;border-radius:13px;padding:11px 14px;font:inherit;font-weight:900;cursor:pointer;touch-action:manipulation}
      .officialTicketSave{background:#246b2d;color:#fff}
      .officialTicketShare{background:#fff4cb;color:#705300;border:1px solid #ead58b!important}
      .officialTicketHint{font-size:11px;color:#697466;line-height:1.45;margin-top:7px}
      @media(max-width:640px){.officialTicketActions button{flex:1 1 140px}}
    `;
    document.head.appendChild(s);
  }

  function roundRect(ctx,x,y,w,h,r,fill,stroke){
    const rr=Math.min(r,w/2,h/2);
    ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);
    if(fill){ctx.fillStyle=fill;ctx.fill()}
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}
  }

  function fitText(ctx,text,maxWidth,startSize,minSize=20){
    let size=startSize;
    do{ctx.font=`900 ${size}px Arial, sans-serif`;if(ctx.measureText(text).width<=maxWidth)return size;size-=2}while(size>=minSize);
    return minSize;
  }

  function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines){
    const words=String(text).split(/\s+/);let line='',lines=[];
    for(const word of words){const test=line?line+' '+word:word;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word;if(lines.length===maxLines-1)break}else line=test}
    if(line&&lines.length<maxLines)lines.push(line);
    lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight));
    return y+lines.length*lineHeight;
  }

  function loadImage(src){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=src})}

  async function buildTicketImage(index){
    const pack=load(TICKET_KEY);const order=load(ORDER_KEY);
    if(!pack?.tickets?.[index])throw new Error('Ticket record not found.');
    const t=pack.tickets[index], count=pack.tickets.length;
    const buyer=safe(pack.buyerName||order?.buyerName||order?.name,'Buyer');
    const control=safe(pack.controlNo||order?.controlNo,'—');
    const number=ticketNo(t), code=ticketCode(t);

    const W=1080,H=1350,canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#f7faf5';ctx.fillRect(0,0,W,H);

    roundRect(ctx,55,55,970,1240,38,'#ffffff','#dfe8d9');
    ctx.fillStyle='#246b2d';ctx.fillRect(55,55,970,14);
    ctx.fillStyle='#78a91f';ctx.fillRect(297,55,243,14);
    ctx.fillStyle='#d7a91f';ctx.fillRect(540,55,243,14);
    ctx.fillStyle='#ee3a16';ctx.fillRect(783,55,242,14);

    try{
      const logo=await loadImage('./assets/pd-warriors-logo.jpg');
      ctx.save();ctx.beginPath();ctx.arc(155,164,62,0,Math.PI*2);ctx.clip();ctx.drawImage(logo,93,102,124,124);ctx.restore();
      ctx.strokeStyle='#d7a91f';ctx.lineWidth=5;ctx.beginPath();ctx.arc(155,164,64,0,Math.PI*2);ctx.stroke();
    }catch(e){
      ctx.fillStyle='#246b2d';ctx.beginPath();ctx.arc(155,164,62,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.font='900 30px Arial';ctx.textAlign='center';ctx.fillText('PDW',155,175);ctx.textAlign='left';
    }

    ctx.fillStyle='#246b2d';ctx.font='900 25px Arial, sans-serif';ctx.fillText("PARKINSON'S DISEASE WARRIORS PHILIPPINES",245,125);
    ctx.fillStyle='#ee3a16';ctx.font='900 58px Georgia, serif';ctx.fillText('GET TOGETHER 2027',245,183);
    ctx.fillStyle='#51614d';ctx.font='900 20px Arial, sans-serif';ctx.fillText('OFFICIAL FUNDRAISING E-RAFFLE TICKET',245,220);

    ctx.strokeStyle='#dce6d7';ctx.setLineDash([13,11]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(90,270);ctx.lineTo(990,270);ctx.stroke();ctx.setLineDash([]);

    roundRect(ctx,90,305,900,210,26,'#f7fbf4','#dce9d6');
    ctx.fillStyle='#246b2d';ctx.font='900 20px Arial, sans-serif';ctx.fillText(`E-TICKET ${index+1} OF ${count}`,125,350);
    ctx.fillStyle='#697466';ctx.font='800 18px Arial, sans-serif';ctx.fillText('RAFFLE TICKET NUMBER',125,390);
    const fs=fitText(ctx,number,820,82,48);ctx.fillStyle='#ee3a16';ctx.font=`900 ${fs}px Arial, sans-serif`;ctx.fillText(number,125,470);

    const boxY=555,boxW=425,boxH=145;
    roundRect(ctx,90,boxY,boxW,boxH,22,'#fbfdf9','#dfe8d9');
    roundRect(ctx,565,boxY,boxW,boxH,22,'#fbfdf9','#dfe8d9');
    ctx.fillStyle='#697466';ctx.font='900 17px Arial, sans-serif';ctx.fillText('BUYER',120,595);ctx.fillText('CONTROL NO.',595,595);
    ctx.fillStyle='#223022';ctx.font='900 26px Arial, sans-serif';wrapText(ctx,buyer,120,640,360,32,2);ctx.fillText(control,595,645);

    roundRect(ctx,90,735,900,150,22,'#fbfdf9','#dfe8d9');
    ctx.fillStyle='#697466';ctx.font='900 17px Arial, sans-serif';ctx.fillText('VERIFICATION CODE',120,775);
    ctx.fillStyle='#246b2d';ctx.font='900 25px monospace';wrapText(ctx,code,120,822,830,31,2);

    ctx.strokeStyle='#dce6d7';ctx.setLineDash([13,11]);ctx.beginPath();ctx.moveTo(90,930);ctx.lineTo(990,930);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#246b2d';ctx.font='900 22px Arial, sans-serif';ctx.fillText('EVENT DETAILS',90,975);
    ctx.fillStyle='#3f523d';ctx.font='700 24px Arial, sans-serif';
    ctx.fillText('January 16, 2027  •  9:00 AM–1:00 PM',90,1025);
    ctx.fillText("St. Luke's Medical Center – Quezon City",90,1070);
    ctx.font='700 21px Arial, sans-serif';ctx.fillText('New Hope: Moving Forward Beyond Parkinson’s.',90,1113);

    roundRect(ctx,90,1160,900,80,18,'#246b2d');
    ctx.fillStyle='#ffffff';ctx.font='900 24px Arial, sans-serif';ctx.textAlign='center';ctx.fillText('PAID • VALID OFFICIAL E-TICKET',540,1210);ctx.textAlign='left';
    ctx.fillStyle='#697466';ctx.font='700 15px Arial, sans-serif';ctx.textAlign='center';ctx.fillText('Keep this image and your verification code for raffle verification.',540,1270);ctx.textAlign='left';

    return {canvas,number,blob:await new Promise(resolve=>canvas.toBlob(resolve,'image/png',1))};
  }

  async function saveTicket(index){
    try{
      const {blob,number}=await buildTicketImage(index);if(!blob)throw new Error('Could not create image.');
      const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`GET-TOGETHER-2027-${number}.png`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    }catch(e){alert(e.message||'Unable to save this ticket image.')}
  }

  async function shareTicket(index){
    try{
      const {blob,number}=await buildTicketImage(index);if(!blob)throw new Error('Could not create image.');
      const file=new File([blob],`GET-TOGETHER-2027-${number}.png`,{type:'image/png'});
      if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
        await navigator.share({title:'GET TOGETHER 2027 E-Raffle Ticket',text:`Official e-ticket ${number}`,files:[file]});
      }else{
        const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
        alert('Ticket image saved. You can now send it through Messenger or another app.');
      }
    }catch(e){if(e?.name!=='AbortError')alert(e.message||'Unable to share this ticket image.')}
  }

  function enhance(){
    addStyle();
    const pack=load(TICKET_KEY);if(!pack?.tickets?.length)return;
    const cards=[...document.querySelectorAll('#ticketList .ticket')];
    cards.forEach((card,index)=>{
      if(card.querySelector('.officialTicketActions'))return;
      const actions=document.createElement('div');actions.className='officialTicketActions';
      actions.innerHTML=`<button type="button" class="officialTicketSave">SAVE TICKET IMAGE</button><button type="button" class="officialTicketShare">SHARE TICKET</button>`;
      const hint=document.createElement('div');hint.className='officialTicketHint';hint.textContent='Creates a clean official PNG ticket that you can keep or send through Messenger.';
      actions.querySelector('.officialTicketSave').addEventListener('click',()=>saveTicket(index));
      actions.querySelector('.officialTicketShare').addEventListener('click',()=>shareTicket(index));
      card.append(actions,hint);
    });
  }

  function init(){enhance();const target=document.getElementById('ticketList');if(target)new MutationObserver(enhance).observe(target,{childList:true,subtree:true})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
