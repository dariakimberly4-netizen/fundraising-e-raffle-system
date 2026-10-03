const CACHE='fundraising-eraffle-v25';
const ASSETS=['./','./index.html','./seller-login.html','./seller.webmanifest','./seller-pwa.js?v=1','./seller-friendly.js?v=1','./seller-offline-workflow.js?v=1','./seller-role-access.js','./seller-overview-emphasis.js','./manifest.webmanifest','./enhancements.js?v=7','./event-branding.js?v=7','./buyer-feature-highlights.js?v=1','./seller-feature-highlights.js?v=1','./buyer-completion.js?v=1','./buyer-menu-structure.js?v=3','./buyer-menu-fix.js?v=3','./buyer-section-highlights.js?v=3','./buyer-number-choice.js?v=1','./seller-release.js?v=2','./seller-simple-overview.js?v=4','./seller-force-highlights.js?v=2','./seller-next-tools.js?v=1','./seller-ops-tools.js?v=1','./seller-final-tools.js?v=1','./seller-control-number.js?v=1','./seller-number-choice.js?v=2','./assets/pd-warriors-logo.jpg?v=7','./buy.html','./buyer.html','./buyer-profiles.js?v=2','./buyer-friendly.js?v=2','./buyer-pwa.js?v=1','./buyer-public-only.js?v=1','./buyer-offline-workflow.js?v=1','./buyer.webmanifest','./verify.html'];

const PHONE_CSS=`
html.force-phone,html.force-phone body{margin:0!important;padding:0!important;min-width:0!important;max-width:none!important;overflow-x:hidden!important}
html.force-phone body{height:var(--approved-mobile-height,100svh)!important;min-height:var(--approved-mobile-height,100svh)!important;max-height:var(--approved-mobile-height,100svh)!important;overflow:hidden!important}
html.force-phone .app{width:100%!important;max-width:none!important;margin:0!important;height:var(--approved-mobile-height,100svh)!important;min-height:var(--approved-mobile-height,100svh)!important;max-height:var(--approved-mobile-height,100svh)!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior-y:contain!important;-webkit-overflow-scrolling:touch!important;display:flex!important;flex-direction:column!important}
html.force-phone header{width:100%!important;flex:0 0 auto!important}
html.force-phone .top{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:10px!important;padding:14px 14px 10px!important}
html.force-phone .brand{display:flex!important;align-items:center!important;gap:10px!important;flex:1 1 210px!important;min-width:0!important}
html.force-phone .logo{width:46px!important;height:46px!important;min-width:46px!important;border-radius:14px!important;font-size:16px!important}
html.force-phone .brand h1{font-size:19px!important;line-height:1.1!important;white-space:normal!important}
html.force-phone .brand small{font-size:12px!important;display:block!important;margin-top:3px!important}
html.force-phone .top-actions{display:flex!important;width:100%!important;justify-content:flex-end!important;gap:8px!important;margin:0!important}
html.force-phone .top-actions .btn{padding:10px 13px!important;font-size:13px!important;border-radius:12px!important}
html.force-phone .nav{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;overflow:visible!important;padding:0 14px 14px!important}
html.force-phone .nav button{width:100%!important;padding:10px 9px!important;font-size:13px!important;border-radius:999px!important;text-align:center!important}
html.force-phone main{padding:14px!important;width:100%!important;flex:0 0 auto!important}
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
html.force-phone .footer{font-size:11px!important;padding:20px 14px 28px!important;flex:0 0 auto!important}
@media(min-width:560px){html.force-phone .nav{grid-template-columns:repeat(4,minmax(0,1fr))!important}html.force-phone .stats{grid-template-columns:repeat(4,minmax(0,1fr))!important}html.force-phone .two{grid-template-columns:1fr 1fr!important}}
`;

const PHONE_JS=`
(function(){
  var ua=navigator.userAgent||'';
  var smallScreen=Math.min(screen.width||9999,screen.height||9999)<=900;
  var touchMobile=(navigator.maxTouchPoints||0)>0&&smallScreen;
  var isPhone=/Android|iPhone|iPod|Mobile|Opera Mini|IEMobile/i.test(ua)||touchMobile;
  if(!isPhone)return;
  document.documentElement.classList.add('force-phone');
  function applyApprovedMobileFrame(){
    var sw=Math.min(screen.width||0,screen.height||0);
    var vw=window.innerWidth||document.documentElement.clientWidth||0;
    var scale=1;
    if(sw>0&&vw>sw*1.35){
      scale=vw/sw;
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
    var rawHeight=(window.visualViewport&&window.visualViewport.height)||window.innerHeight||document.documentElement.clientHeight||0;
    if(rawHeight>0){
      var lockedHeight=Math.max(320,Math.round(rawHeight/scale));
      document.documentElement.style.setProperty('--approved-mobile-height',lockedHeight+'px');
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',applyApprovedMobileFrame,{once:true});else applyApprovedMobileFrame();
  window.addEventListener('orientationchange',function(){setTimeout(applyApprovedMobileFrame,300)});
})();
`;

function injectAppEnhancements(response){
  return response.text().then(html=>{
    if(!html.includes('data-phone-proportion-fix')) html=html.replace('</head>',`<style data-phone-proportion-fix>${PHONE_CSS}</style><script data-phone-proportion-fix>${PHONE_JS}<\/script></head>`);
    html=html.replace(/<script src="\.\/enhancements\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/event-branding\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/seller-feature-highlights\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/seller-release\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/seller-simple-overview\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/seller-force-highlights\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/seller-next-tools\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace('</head>','<script src="./enhancements.js?v=7" defer></script><script src="./event-branding.js?v=7" defer></script><script src="./seller-feature-highlights.js?v=1" defer></script><script src="./seller-release.js?v=2" defer></script><script src="./seller-simple-overview.js?v=4" defer></script><script src="./seller-force-highlights.js?v=2" defer></script><script src="./seller-next-tools.js?v=1" defer></script></head>');
    return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store, max-age=0'}});
  });
}

function injectBuyerFeatures(response){
  return response.text().then(html=>{
    html=html.replace(/<script src="\.\/buyer-feature-highlights\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/buyer-completion\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/buyer-menu-structure\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/buyer-menu-fix\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/buyer-section-highlights\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace(/<script src="\.\/buyer-number-choice\.js(?:\?v=\d+)?" defer><\/script>/g,'');
    html=html.replace('</head>','<script src="./buyer-feature-highlights.js?v=1" defer></script><script src="./buyer-completion.js?v=1" defer></script><script src="./buyer-number-choice.js?v=1" defer></script><script src="./buyer-menu-structure.js?v=3" defer></script><script src="./buyer-menu-fix.js?v=3" defer></script><script src="./buyer-section-highlights.js?v=3" defer></script></head>');
    return new Response(html,{status:response.status,statusText:response.statusText,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store, max-age=0'}});
  });
}

self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(ASSETS);await self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})()));
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    const u=new URL(e.request.url);
    if(u.pathname.endsWith('/')||u.pathname.endsWith('/index.html')){
      e.respondWith(fetch(e.request,{cache:'no-store'}).then(injectAppEnhancements).catch(async()=>{const cached=await caches.match('./index.html');return cached?injectAppEnhancements(cached):Response.error()}));
      return;
    }
    if(u.pathname.endsWith('/seller-login.html')){
      e.respondWith(fetch(e.request,{cache:'no-store'}).then(async resp=>{
        if(resp&&resp.ok){const c=await caches.open(CACHE);await c.put('./seller-login.html',resp.clone())}
        return resp;
      }).catch(async()=>{const cached=await caches.match('./seller-login.html');return cached||Response.error()}));
      return;
    }
    if(u.pathname.endsWith('/buy.html')){
      e.respondWith(fetch(e.request,{cache:'no-store'}).then(injectBuyerFeatures).catch(async()=>{const cached=await caches.match('./buy.html');return cached?injectBuyerFeatures(cached):Response.error()}));
      return;
    }
    if(u.pathname.endsWith('/buyer.html')){
      e.respondWith(fetch(e.request,{cache:'no-store'}).then(async resp=>{
        if(resp&&resp.ok){const c=await caches.open(CACHE);await c.put('./buyer.html',resp.clone())}
        return resp;
      }).catch(async()=>{const cached=await caches.match('./buyer.html');return cached||Response.error()}));
      return;
    }
  }
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('/event-branding.js')||url.pathname.endsWith('/enhancements.js')||url.pathname.endsWith('/buyer-feature-highlights.js')||url.pathname.endsWith('/seller-feature-highlights.js')||url.pathname.endsWith('/buyer-completion.js')||url.pathname.endsWith('/buyer-menu-structure.js')||url.pathname.endsWith('/buyer-menu-fix.js')||url.pathname.endsWith('/buyer-section-highlights.js')||url.pathname.endsWith('/buyer-number-choice.js')||url.pathname.endsWith('/buyer-profiles.js')||url.pathname.endsWith('/seller-release.js')||url.pathname.endsWith('/seller-simple-overview.js')||url.pathname.endsWith('/seller-force-highlights.js')||url.pathname.endsWith('/seller-next-tools.js')||url.pathname.endsWith('/seller-ops-tools.js')||url.pathname.endsWith('/seller-final-tools.js')||url.pathname.endsWith('/seller-control-number.js')||url.pathname.endsWith('/seller-number-choice.js')||url.pathname.endsWith('/seller-friendly.js')||url.pathname.endsWith('/assets/pd-warriors-logo.jpg')){
    e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match(e.request,{ignoreSearch:true})));
    return;
  }
  e.respondWith(fetch(e.request).then(resp=>{if(e.request.method==='GET'){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return resp}).catch(()=>caches.match(e.request)));
});