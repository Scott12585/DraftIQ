// Command Center v2 layout: combined Best Available + next-pick outlook.
(function(){
let positionFilter='ALL';

function findPanel(title){
 return Array.from(document.querySelectorAll('.cockpit-panel')).find(p=>p.querySelector('.panel-title h3')?.textContent.includes(title));
}
function avatar(name){
 return window.DraftIQTeamLogo?window.DraftIQTeamLogo(name,'cc-rank-photo'):window.DraftIQAvatar?window.DraftIQAvatar(name,'cc-rank-photo'):`<span class="avatar-fallback cc-rank-photo">${String(name||'?').split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase()}</span>`;
}
function metaLine(name,pos){return window.DraftIQNFLLine?window.DraftIQNFLLine(name,pos):pos;}
function targetBadge(name){return typeof targetLevel==='function'&&targetLevel(name)>0?'<span class="cc-target-badge">TARGET</span>':'';}
function projectedRank(){
 const future=typeof nextMine==='function'?nextMine():null;
 if(!future||future<=s.pick)return null;
 return Math.max(1,future-s.pick+1);
}
function toggleTarget(name){
 if(!name)return;
 if(typeof targetLevel==='function'&&targetLevel(name)>0)removeTargetHere(name);
 else addTargetHere(name,2);
 view('command');
}
function renderCombinedBest(panel){
 const overall=rec();
 const projected=projectedRank();
 const future=typeof nextMine==='function'?nextMine():null;
 const ranked=overall.map((x,i)=>({x,rank:i+1})).filter(r=>positionFilter==='ALL'||r.x.p[1]===positionFilter).slice(0,50);
 const head=panel.querySelector('.panel-title');
 head.innerHTML=`<div><h3>Best Available</h3><small class="cc-rank-sub">DraftIQ rank + chance player lasts to your next pick</small></div><div class="cc-rank-actions"><select id="ccCombinedPos" aria-label="Best Available position">${['ALL','QB','RB','WR','TE','DEF'].map(p=>`<option value="${p}" ${positionFilter===p?'selected':''}>${p==='ALL'?'Overall':p}</option>`).join('')}</select><button onclick="view('players')">View All →</button></div>`;
 const sel=head.querySelector('#ccCombinedPos');
 sel?.addEventListener('change',()=>{positionFilter=sel.value;renderCombinedBest(panel);});
 let lineInserted=false;
 let html='<div class="cc-rank-head"><span>RK</span><span>PLAYER</span><span>IQ</span><span>AT NEXT</span><span></span></div>';
 ranked.forEach(({x,rank})=>{
   if(projected&&!lineInserted&&rank>=projected){
     html+=`<div class="cc-next-divider"><span>YOUR NEXT PICK ${future?fmtPick(future):''}</span><b>Projected range starts around overall rank ${projected}</b></div>`;
     lineInserted=true;
   }
   const targeted=typeof targetLevel==='function'&&targetLevel(x.p[0])>0;
   html+=`<div class="cc-rank-row ${targeted?'cc-targeted-row':''}"><div class="cc-rank-num">${rank}</div>${avatar(x.p[0])}<div class="cc-rank-player"><b>${E(x.p[0])}${targetBadge(x.p[0])}</b><small>${metaLine(x.p[0],x.p[1])}</small></div><div class="cc-rank-score">${x.score.toFixed(1)}</div><div class="cc-rank-surv">${Math.round(x.surv)}%</div><button class="cc-target-star ${targeted?'on':''}" data-player="${encodeURIComponent(x.p[0])}" title="${targeted?'Remove from':'Add to'} targets" aria-label="${targeted?'Remove from':'Add to'} targets">★</button></div>`;
 });
 if(projected&&!lineInserted)html+=`<div class="cc-next-divider cc-next-divider-bottom"><span>YOUR NEXT PICK ${future?fmtPick(future):''}</span><b>Projected range starts around overall rank ${projected}</b></div>`;
 const list=panel.querySelector('.player-list');
 list.innerHTML=html;
 list.classList.add('cc-rank-scroll');
 list.querySelectorAll('.cc-target-star').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleTarget(decodeURIComponent(btn.dataset.player||''));}));
}
function renderDraftBoard(panel){
 if(!panel)return;
 const currentRound=Math.min(12,Math.max(1,round(s.pick)));
 const endRound=Math.min(12,currentRound+1);
 let rows='';
 for(let r=currentRound;r<=endRound;r++){
   rows+=`<tr class="cc-board-round"><td colspan="3">ROUND ${r}${r===currentRound?' • CURRENT':''}</td></tr>`;
   for(let j=1;j<=10;j++){
     const p=(r-1)*10+j;
     const d=s.draft.find(x=>x.pick===p);
     const o=owner(p);
     rows+=`<tr class="${p===s.pick?'active-pick ':''}${o==='Scott'?'mine':''}" data-pick="${p}"><td>${fmtPick(p)}</td><td><b>${E(o)}</b></td><td>${d?E(d.name):p===s.pick?'<span class="clock">ON THE CLOCK</span>':'—'}</td></tr>`;
   }
 }
 panel.innerHTML=`<div class="panel-title"><div><h3>Draft Board</h3><small class="cc-rank-sub">Rounds ${currentRound}${endRound>currentRound?'–'+endRound:''}</small></div><button onclick="view('board')">Full Board →</button></div><div class="cc-board-scroll"><table class="board-compact"><tr><th>Pick</th><th>Owner</th><th>Player</th></tr>${rows}</table></div>`;
 requestAnimationFrame(()=>panel.querySelector('.active-pick')?.scrollIntoView({block:'center'}));
}
function redesign(){
 const grid=document.querySelector('.cc-grid');
 if(!grid)return;
 const recPanel=findPanel('DraftIQ Recommendation');
 const bestPanel=findPanel('Best Available');
 const likelyPanel=findPanel('Likely At Your Next Pick');
 const teamPanel=findPanel('My Team');
 const targetPanel=findPanel('My Targets');
 const boardPanel=findPanel('Draft Board');
 if(likelyPanel)likelyPanel.remove();
 recPanel?.classList.add('cc-area-rec');
 teamPanel?.classList.add('cc-area-team');
 targetPanel?.classList.add('cc-area-targets');
 boardPanel?.classList.add('cc-area-board');
 if(bestPanel){bestPanel.classList.add('cc-area-best','cc-combined-best');renderCombinedBest(bestPanel);}
 renderDraftBoard(boardPanel);
 grid.classList.add('cc-grid-v2');
}
const previousView=window.view;
window.view=function(v){previousView(v);if(v==='command')setTimeout(redesign,0);};
window.addEventListener('load',()=>setTimeout(redesign,0));
})();