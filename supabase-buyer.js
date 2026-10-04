(function(){
const URL='https://allltrsiqauixobewipm.supabase.co',KEY='sb_publishable_xSU0hRtZ_IROwTnHJWVejw_R0Znq-RQ',LOCAL='gt27_demo_tx_v2';
const headers={'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json','Prefer':'return=representation'};
const read=()=>{try{return JSON.parse(localStorage.getItem(LOCAL)||'null')}catch(e){return null}};
async function submit(d){
 const token=crypto.randomUUID();
 const body={request_no:d.requestNo,buyer_name:d.name,contact:d.contact,email:d.email||null,referred_by:d.referred||null,referral_source:d.source||null,payment_method:'GCash',payment_reference:d.paymentRef||null,quantity:d.qty,total_amount:d.total,proof_name:d.proofName||null,proof_url:d.proofData||null,status:'submitted',lookup_token:token};
 const r=await fetch(URL+'/rest/v1/raffle_requests',{method:'POST',headers,body:JSON.stringify(body)});
 if(!r.ok)throw new Error(await r.text());
 const rows=await r.json(); d.supabaseId=rows[0]?.id; d.lookupToken=token; localStorage.setItem(LOCAL,JSON.stringify(d)); return d;
}
async function sync(){
 const d=read(); if(!d?.supabaseId||!d.lookupToken)return;
 const h={...headers,'x-buyer-token':d.lookupToken};
 const r=await fetch(URL+'/rest/v1/raffle_requests?id=eq.'+encodeURIComponent(d.supabaseId)+'&select=id,status,payment_verified_at,issued_at',{headers:h});
 if(!r.ok)return; const rows=await r.json(); if(!rows[0])return;
 d.status=rows[0].status; d.paymentVerifiedAt=rows[0].payment_verified_at; d.issuedAt=rows[0].issued_at;
 if(d.status==='issued'){
  const tr=await fetch(URL+'/rest/v1/raffle_tickets?request_id=eq.'+encodeURIComponent(d.supabaseId)+'&select=ticket_no,control_no,verification_code',{headers:h});
  if(tr.ok){const ts=await tr.json();d.tickets=ts.map(t=>({ticketNo:t.ticket_no,controlNo:t.control_no,verificationCode:t.verification_code}));}
 }
 localStorage.setItem(LOCAL,JSON.stringify(d));
}
document.addEventListener('click',async e=>{
 const b=e.target.closest('#confirmBtn'); if(!b)return;
 setTimeout(async()=>{const d=read();if(!d||d.supabaseId)return;try{b.disabled=true;await submit(d)}catch(err){alert('Your request could not be synchronized. Please check your internet and try again.')}finally{b.disabled=false}},80);
},true);
window.addEventListener('pageshow',()=>sync().then(()=>{}));
window.GT27Supabase={sync};
})();