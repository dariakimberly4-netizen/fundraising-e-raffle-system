const CACHE='fundraising-eraffle-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest'];

const PHONE_CSS=`
html.force-phone,html.force-phone body{margin:0!important;padding:0!important;min-width:0!important;max-width:none!important;overflow-x:hidden!important}
html.force-phone .app{width:100%!important;max-width:none!important;margin:0!important;min-height:100vh!important}
html.force-phone header{width:100%!important}
html.force-phone .top{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:10px!important;padding:14px 14px 10px!important}
html.force-phone .brand{display:flex!important;align-items:center!important;gap:10px!important;flex:1 1 210px!important;min-width:0!important}
html.force-phone .logo{width:46px!important;height:46px!important;min-width:46px!important;border-radius:14px!important;font-size:16px!important}
html.force-phone .brand h1{font-size:19px!important;line-height:1.1!important;white-space:normal!important}
html.force-phone .brand small{font-size:12px!important;display:block!important;margin-top:3px!important}
html.force-phone .top-actions{display:flex!important;width:100%!important;justify-content:flex-end!important;gap:8px!important;margin:0!important}
html.force-phone .top-actions .btn{padding:10px 13px!important;font-size:13px!important;border-radius:12px!important}
html.force-phone .nav{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;overflow:visible!important;padding:0 14px 14px!important}
html.force-phone .nav button{width:100%!important;padding:10px 9px!important;font-size:13px!important;border-radius:999px!important;text-align:center!important}
html.force-phone main{padding:14px!important;width:100%!important}
html.force-phone .hero{padding:24px 20px!important;min-height:0!important;border-radius:22px!important}
html.force-phone .eyebrow{font-size:10px!important;letter-spacing:.13em!important}
html.force-phone .hero h2{font-size:32px!important;line-height:1.05!important;margin:8px 0 10px!important}
html.force-phone .hero p{font-size:14px!important;line-height:1.5!important;max-width:none!important}
html.force-phone .grid{gap:10px!important}
html.force-phone .stats{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;margin-top:12px!important}
html.force-phone .card{padding:15px!important;border-radius:17px!important}
html.force-phone .stat{min-height:98px!important;display:flex!important;flex-direction:column!important;justify-content:center!important}
html.force-phone .stat b{font-size:28px!important;line-height:1!important}
html.force-phone .stat span{font-size:12px!important;line-height:1.25!important;margin-top:7px!important}
html.force-phone .two,html.force-phone .form-grid,html.force-phone .ticket-list{grid-template-columns:1fr!important}
html.force-phone .two{gap:10px!important;margin-top:10px!important}
html.force-phone .two>.card{min-height:0!important}
html.force-phone .two h3{font-size:20px!important;margin-bottom:10px!important}
html.force-phone .kv{font-size:14px!important;padding:11px 0!important}
html.force-phone .note{font-size:12px!important}
html.force-phone .meta{grid-template-columns:1fr!important}
html.force-phone .section-title{align-items:flex-start!important;flex-direction:column!important}
html.force-phone .searchline{flex-direction:column!important}
html.force-phone input,html.force-phone select,html.force-phone textarea{font-size:16px!important;padding:12px!important}
html.force-phone table{min-width:680px!important}
html.force-phone .footer{font-size:11px!important;padding:20px 14px 28px!important}
@media(min-width:560px){
  html.force-phone .nav{grid-template-columns:repeat(4,minmax(0,1fr))!important}
  html.force-phone .stats{grid-template-columns:repeat(4,minmax(0,1fr))!important}
  html.force-phone .two{grid-template-columns:1fr 1fr!important}
}
`;

const PHONE_JS=`
(function(){
  var ua=navigator.userAgent||'';
  var smallScreen=Math.min(screen.width||9999,screen.height||9999)<=900;
  var touchMobile=(navigator.maxTouchPoints||0)>0&&smallScreen;
  var isPhone=/Android|iPhone|iPod|Mobile|Opera Mini|IEMobile/i.test(ua)||touchMobile;
  if(!isPhone)return;
  document.documentElement.classList.add('force-phone');
  function fixDesktopViewport(){
    var sw=Math.min(screen.width||0,screen.height||0);
    var vw=window.innerWidth||document.documentElement.clientWidth||0;
    if(sw>0&&vw>sw*1.35){
      var scale=vw/sw;
      document.documentElement.style.overflowX='hidden';
      document.body.style.width=sw+'px';
      document.body.style.maxWidth=sw+'px';
      document.body.style.margin='0';
      document.body.style.zoom=String(scale);
    }else{
      document.body.style.width='';
      document.body.style.maxWidth='';
      document.body.style.zoom='';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fixDesktopViewport,{once:true});else fixDesktopViewport();
  window.addEventListener('orientationchange',function(){setTimeout(fixDesktopViewport,250)});
})();
`;

function injectPhoneFix(response){
  return response.text().then(html=>{
    if(!html.includes('data-phone-proportion-fix')){
      html=html.replace('</head>',`<style data-phone-proportion-fix>${PHONE_CSS}</style><script data-phone-proportion-fix>${PHONE_JS}<\/script></head>`);
    }
    return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
  });
}

self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await c.addAll(ASSETS);
  await self.skipWaiting();
})()));

self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));

self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(injectPhoneFix).catch(async()=>{
      const cached=await caches.match('./index.html');
      return cached?injectPhoneFix(cached):Response.error();
    }));
    return;
  }
  e.respondWith(fetch(e.request).then(resp=>{
    if(e.request.method==='GET'){
      const copy=resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy));
    }
    return resp;
  }).catch(()=>caches.match(e.request)));
});