const CACHE='fundraising-eraffle-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest'];

const RESPONSIVE_CSS=`
@media(max-width:1100px){
  .app{max-width:900px!important;width:100%!important}
  .top{padding:18px 22px!important;gap:16px!important}
  .logo{width:52px!important;height:52px!important;border-radius:16px!important;font-size:18px!important}
  .brand h1{font-size:22px!important}.brand small{font-size:14px!important}
  .top-actions{display:flex!important;gap:10px!important}.top-actions .btn{padding:12px 16px!important;font-size:15px!important}
  .nav{flex-wrap:wrap!important;overflow:visible!important;padding:0 22px 16px!important;gap:9px!important}
  .nav button{padding:12px 18px!important;font-size:15px!important}
  main{padding:20px 24px 0!important}
  .hero{padding:34px!important;min-height:250px!important;border-radius:26px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
  .hero h2{font-size:44px!important;margin:10px 0 14px!important}.hero p{font-size:17px!important;line-height:1.55!important;max-width:760px!important}.eyebrow{font-size:12px!important}
  .grid{gap:16px!important}.stats{gap:14px!important;margin-top:18px!important}
  .card{padding:20px!important;border-radius:18px!important}
  .stat{min-height:122px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}.stat b{font-size:34px!important}.stat span{font-size:15px!important}
  .two{gap:16px!important}.two>.card{min-height:310px!important}
  .two h3{font-size:24px!important}.kv{font-size:16px!important;padding:14px 0!important}.note{font-size:14px!important}
  .footer{font-size:13px!important;padding:30px 18px 44px!important}
}
@media(max-width:760px){
  .app{max-width:none!important}
  .top{align-items:center!important;flex-wrap:wrap!important;padding:14px 16px!important}
  .brand{flex:1 1 220px!important}.logo{width:46px!important;height:46px!important}.brand h1{font-size:19px!important}.brand small{font-size:12px!important}
  .top-actions{display:flex!important;margin-left:auto!important}.top-actions .btn{padding:10px 13px!important;font-size:13px!important}
  .nav{padding:0 16px 14px!important;gap:8px!important}.nav button{padding:10px 14px!important;font-size:13px!important}
  main{padding:16px!important}
  .hero{padding:26px 24px!important;min-height:0!important;border-radius:22px!important}.hero h2{font-size:clamp(30px,9vw,40px)!important;line-height:1.05!important}.hero p{font-size:15px!important;line-height:1.5!important}
  .stats{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:12px!important}.stat{min-height:108px!important;padding:16px!important}.stat b{font-size:30px!important}.stat span{font-size:13px!important}
  .two,.form-grid,.ticket-list{grid-template-columns:1fr!important}.two>.card{min-height:auto!important}
  .meta{grid-template-columns:1fr!important}.section-title{align-items:flex-start!important;flex-direction:column!important}.searchline{flex-direction:column!important}
}
@media(max-width:430px){
  .top-actions{width:100%!important;justify-content:flex-end!important}
  .nav{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;overflow:visible!important}.nav button{width:100%!important}
  .stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}
}
`;

function injectResponsiveCss(response){
  return response.text().then(html=>{
    if(!html.includes('data-responsive-fix')){
      html=html.replace('</head>',`<style data-responsive-fix>${RESPONSIVE_CSS}</style></head>`);
    }
    return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8'}});
  });
}

self.addEventListener('install',e=>e.waitUntil((async()=>{
  await caches.open(CACHE).then(c=>c.addAll(ASSETS));
  await self.skipWaiting();
})()));

self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));

self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).then(injectResponsiveCss).catch(async()=>{
      const cached=await caches.match('./index.html');
      return cached?injectResponsiveCss(cached):Response.error();
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    const copy=resp.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy));
    return resp;
  })));
});