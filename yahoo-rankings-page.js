// DraftIQ v0.9.37 — live Yahoo rankings page.
(function(){
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function key(n){try{return typeof keyName==='function'?keyName(n):String(n||'').toLowerCase().replace(/[^a-z0-9]/g,'')}catch{return String(n||'').toLowerCase().replace(/[^a-z0-9]/g,'')}}
function rank(n){return window.DraftIQYahooRank?.(n)||9999;}
function yahooView(){
 const gone=typeof taken==='function'?taken():new Set();
 const rows=(window.DRAFTIQ_PLAYERS||[]).filter(p=>rank(p[0])<9999&&!gone.has(key(p[0]))).sort((a,b)=>rank(a[0])-rank(b[0]));
 const pos=['ALL','QB','RB','WR','TE','DEF'];
 return `<div class="yahoo-rank-page"><div class="card yahoo-rank-hero"><div><div class="eyebrow">YAHOO SPORTS</div><h2>Yahoo Rankings</h2><p>Live available-player board in Yahoo draft-room order. Keepers and drafted players are automatically removed.</p></div><div class="yahoo-rank-count"><strong>${rows.length}</strong><span>AVAILABLE</span></div></div><div class="card"><div class="yahoo-rank-tools"><input id="yahooRankSearch" placeholder="Search players…" oninput="DraftIQFilterYahooRanks()"><select id="yahooRankPos" onchange="DraftIQFilterYahooRanks()">${pos.map(x=>`<option>${x}</option>`).join('')}</select></div><table class="yahoo-rank-table"><thead><tr><th>Yahoo</th><th>Player</th><th>Pos</th><th>Proj Pts</th></tr></thead><tbody>${rows.map(p=>`<tr data-name="${esc(p[0]).toLowerCase()}" data-pos="${esc(p[1])}"><td class="yahoo-rank-num">${rank(p[0])}</td><td><b>${esc(p[0])}</b></td><td><span class="pill">${esc(p[1])}</span></td><td>${Number(p[3]||0).toFixed(1)}</td></tr>`).join('')}</tbody></table></div></div>`;
}
window.DraftIQFilterYahooRanks=function(){const q=(document.getElementById('yahooRankSearch')?.value||'').toLowerCase().trim(),pos=document.getElementById('yahooRankPos')?.value||'ALL';document.querySelectorAll('.yahoo-rank-table tbody tr').forEach(r=>{r.style.display=(!q||r.dataset.name.includes(q))&&(pos==='ALL'||r.dataset.pos===pos)?'':'none';});};
const baseView=window.view;
window.view=function(v){if(v==='yahoo'){if(typeof nav==='function')nav(v);const next=typeof nextMineIncludingCurrent==='function'?nextMineIncludingCurrent():null;if(document.getElementById('status')&&typeof owner==='function'&&typeof fmtPick==='function')document.getElementById('status').innerHTML=`<b>${esc(owner(s.pick))}</b> on pick ${fmtPick(s.pick)}<br>${next?`Your next: <b>${fmtPick(next)}</b>`:'Draft complete'}`;document.getElementById('app').innerHTML=yahooView();document.body.classList.remove('command-active');return;}return baseView(v);};
function addNav(){const n=document.getElementById('nav');if(!n||Array.from(n.querySelectorAll('button')).some(b=>b.textContent.trim()==='Yahoo Rankings'))return;const b=document.createElement('button');b.textContent='Yahoo Rankings';b.onclick=()=>window.view('yahoo');n.appendChild(b);}
const oldNav=window.nav;window.nav=function(v){oldNav(v);addNav();if(v==='yahoo')Array.from(document.querySelectorAll('#nav button')).forEach(b=>b.classList.toggle('on',b.textContent.trim()==='Yahoo Rankings'));};
window.addEventListener('load',addNav);
})();