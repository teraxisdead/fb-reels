// Free Cloudflare Worker backend (free plan: 100k requests/day). Public content only.
const UA='facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uagent.php)';
const PAGE=/(^|\.)(facebook\.com|fb\.com|fb\.watch)$/, CDN=/(^|\.)(fbcdn\.net)$/;
const H={'access-control-allow-origin':'*','access-control-allow-headers':'*'};
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{...H,'content-type':'application/json'}});
const un=s=>s.replace(/\\u0025/g,'%').replace(/\\\//g,'/').replace(/&amp;/g,'&');
const og=(h,p)=>{const m=h.match(new RegExp('<meta[^>]+property="og:'+p+'"[^>]+content="([^"]*)"','i'))||h.match(new RegExp('<meta[^>]+content="([^"]*)"[^>]+property="og:'+p+'"','i'));return m?un(m[1]):null};
export default{async fetch(req){
 if(req.method==='OPTIONS')return new Response(null,{headers:H});
 const u=new URL(req.url);let t;
 try{t=new URL(u.searchParams.get('u')||u.searchParams.get('url'))}catch{return J({error:'invalid_url'},400)}
 if(t.protocol!=='https:')return J({error:'invalid_url'},400);
 if(u.pathname==='/dl'){
  if(!CDN.test(t.hostname))return J({error:'host_not_allowed'},400);
  const r=await fetch(t,{redirect:'manual'});if(r.status>=300&&r.status<400)return J({error:'redirect_blocked'},400);
  const h={...H,'content-type':r.headers.get('content-type')||'application/octet-stream'};const l=r.headers.get('content-length');if(l)h['content-length']=l;
  return new Response(r.body,{status:r.status,headers:h});}
 if(!PAGE.test(t.hostname))return J({error:'unsupported_url'},400);
 const r=await fetch(t,{headers:{'user-agent':UA,'accept-language':'en'},redirect:'follow'});
 if(!r.ok)return J({error:'inaccessible',status:r.status},200);
 const h=await r.text(),q=[];
 const hd=h.match(/"(?:browser_native_hd_url|hd_src)":"([^"]+)"/),sd=h.match(/"(?:browser_native_sd_url|sd_src)":"([^"]+)"/),ov=og(h,'video:url')||og(h,'video');
 if(hd)q.push({label:'HD',url:un(hd[1])});if(sd)q.push({label:'SD',url:un(sd[1])});if(!q.length&&ov)q.push({label:'Best available',url:ov});
 const img=og(h,'image'),title=og(h,'title');
 if(/login|checkpoint/.test(r.url)&&!img)return J({error:'login_required'});
 if(q.length)return J({kind:'video',title,thumb:img,qualities:q.filter(x=>CDN.test(new URL(x.url).hostname))});
 if(img&&/photo|\/p\/|fbid/.test(t.href))return J({kind:'photo',title,thumb:img,qualities:[{label:'Best available',url:img}]});
 return J({kind:'page',title,thumb:img,qualities:[],note:'Page/profile listings are not available without login. Paste individual Reel/video/photo links.'});
}}
