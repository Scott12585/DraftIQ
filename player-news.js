// FantasyPros news integration via Supabase Edge Function.
(function(){
const ENDPOINT='https://uinhyjqsqrgfczqrmcya.supabase.co/functions/v1/fantasypros-news';
const cache=new Map();
let lastPlayer='';
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function age(v){if(!v)return '';const d=new Date(v);if(Number.isNaN(d.getTime()))return '';const m=Math.max(0,Math.floor((Date.now()-d.getTime())/60000));if(m<60)return `${m}m ago`;const h=Math.floor(m/60);if(h<24)return `${h}h ago`;const days=Math.floor(h/24);return `${days}d ago`;}
function items(data){const candidates=[data?.news,data?.items,data?.results,data?.data,data?.players?.news];for(const x of candidates)if(Array.isArray(x))return x;return Array.isArray(data)?data:[];}
function normalize(n){return {title:n?.title||n?.headline||n?.news_headline||n?.player_name||'Player Update',body:n?.description||n?.analysis||n?.news||n?.summary||n?.body||n?.content||'',date:n?.published_at||n?.updated_at||n?.created_at||n?.date||n?.timestamp||'',type:n?.type||n?.category||n?.news_type||''};}
function panel(){return document.querySelector('.cc-area-rec')||Array.from(document.querySelectorAll('.cockpit-panel')).find(p=>p.querySelector('.panel-title h3')?.textContent.includes('DraftIQ Recommendation'));}
function recommendedName(p){return p?.querySelector('.recommend-info h2')?.textContent?.trim()||'';}
function mount(p){let box=p.querySelector('.fp-news');if(!box){box=document.createElement('div');box.className='fp-news';const action=p.querySelector('.recommend-action');if(action)action.before(box);else p.appendChild(box);}return box;}
function renderLoading(box){box.innerHTML='<div class="fp-news-head"><b>LATEST NEWS</b><span>FantasyPros</span></div><div class="fp-news-loading">Checking for recent player news…</div>';}
function render(box,data){const list=items(data).map(normalize).filter(x=>x.title||x.body);if(!list.length){box.innerHTML='<div class="fp-news-head"><b>LATEST NEWS</b><span>FantasyPros</span></div><div class="fp-news-empty">No recent FantasyPros news found for this player.</div>';return;}const n=list[0];box.innerHTML=`<div class="fp-news-head"><b>LATEST NEWS</b><span>${esc(n.type||'FantasyPros')}${n.date?` • ${esc(age(n.date))}`:''}</span></div><div class="fp-news-title">${esc(n.title)}</div>${n.body?`<div class="fp-news-body">${esc(n.body)}</div>`:''}`;}
function renderError(box){box.innerHTML='<div class="fp-news-head"><b>LATEST NEWS</b><span>FantasyPros</span></div><div class="fp-news-empty">Player news temporarily unavailable.</div>';}
async function load(name,box){if(cache.has(name)){render(box,cache.get(name));return;}renderLoading(box);try{const r=await fetch(`${ENDPOINT}?player=${encodeURIComponent(name)}&limit=3`,{cache:'no-store'});const data=await r.json();if(!r.ok)throw new Error(data?.error||'news');cache.set(name,data);render(box,data);}catch(e){console.warn('DraftIQ news:',e);renderError(box);}}
function refresh(){const p=panel();if(!p)return;const name=recommendedName(p);if(!name)return;const box=mount(p);if(name!==lastPlayer||!box.dataset.loaded){lastPlayer=name;box.dataset.loaded='1';load(name,box);}}
const obs=new MutationObserver(()=>requestAnimationFrame(refresh));window.addEventListener('load',()=>{refresh();const app=document.getElementById('app');if(app)obs.observe(app,{childList:true,subtree:true});});setInterval(refresh,5000);
})();