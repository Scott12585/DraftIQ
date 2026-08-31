// High-resolution NFL/GSIS headshots from the nflverse players dataset.
// Falls back to the existing DraftIQ avatar renderer if no nflverse image is available.
(function(){
const DATA_URL='https://github.com/nflverse/nflverse-data/releases/download/players/players.csv';
const fallbackAvatar=window.DraftIQAvatar;
const photos=new Map();
function k(v){return typeof keyName==='function'?keyName(v):String(v||'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function parseCSV(text){
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++;}else if(c==='"')quoted=false;else field+=c;}
  else if(c==='"')quoted=true;
  else if(c===','){row.push(field);field='';}
  else if(c==='\n'){row.push(field.replace(/\r$/,''));rows.push(row);row=[];field='';}
  else field+=c;
 }
 if(field||row.length){row.push(field);rows.push(row);}
 return rows;
}
function initials(n){return String(n||'?').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase();}
function nflverseAvatar(name,cls=''){
 const photo=photos.get(k(name));
 if(!photo)return fallbackAvatar?fallbackAvatar(name,cls):`<span class="avatar-fallback ${cls}">${initials(name)}</span>`;
 const fallback=fallbackAvatar?encodeURIComponent(fallbackAvatar(name,cls)):'';
 return `<img class="${cls}" src="${photo}" alt="" loading="lazy" decoding="async" data-fallback-html="${fallback}" onerror="if(this.dataset.fallbackHtml){this.outerHTML=decodeURIComponent(this.dataset.fallbackHtml)}else{this.outerHTML='<span class=&quot;avatar-fallback ${cls}&quot;>${initials(name)}</span>'}">`;
}
function refreshCurrentView(){
 if(typeof view!=='function')return;
 const active=document.body.classList.contains('command-active')?'command':null;
 if(active)view(active);
}
async function load(){
 try{
  const res=await fetch(DATA_URL,{cache:'force-cache'});if(!res.ok)throw new Error('nflverse '+res.status);
  const rows=parseCSV(await res.text());if(!rows.length)return;
  const h=rows[0].map(x=>x.trim());
  const nameI=h.indexOf('display_name');
  const directHead=h.indexOf('headshot');
  const headI=directHead>=0?directHead:h.indexOf('headshot_url');
  if(nameI<0||headI<0)return;
  for(let i=1;i<rows.length;i++){const n=rows[i][nameI],p=rows[i][headI];if(n&&p&&/^https?:\/\//.test(p))photos.set(k(n),p);}
  window.DraftIQAvatar=nflverseAvatar;
  window.DraftIQHeadshotSource='nflverse/GSIS';
  refreshCurrentView();
 }catch(e){console.warn('DraftIQ nflverse headshots unavailable; using fallback.',e);}
}
load();
})();