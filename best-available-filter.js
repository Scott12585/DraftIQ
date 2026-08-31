// Command Center Best Available position filter.
(function(){
let bestAvailablePos='ALL';
function options(){return ['ALL','QB','RB','WR','TE','DEF'].map(p=>`<option value="${p}" ${bestAvailablePos===p?'selected':''}>${p==='ALL'?'Overall':p}</option>`).join('');}
function renderBestAvailable(){
 const panel=Array.from(document.querySelectorAll('.cockpit-panel')).find(p=>p.querySelector('.panel-title h3')?.textContent.includes('Best Available'));
 if(!panel)return;
 const head=panel.querySelector('.panel-title');
 const list=panel.querySelector('.player-list');
 if(!head||!list)return;
 let sel=head.querySelector('#ccBestAvailablePos');
 if(!sel){
   const viewAll=head.querySelector('button');
   const wrap=document.createElement('span');wrap.className='cc-best-controls';
   wrap.innerHTML=`<select id="ccBestAvailablePos" aria-label="Best Available position">${options()}</select>`;
   head.insertBefore(wrap,viewAll||null);
   sel=wrap.querySelector('select');
   sel.addEventListener('change',()=>{bestAvailablePos=sel.value;renderBestAvailable();});
 }
 const ranked=rec().filter(x=>bestAvailablePos==='ALL'||x.p[1]===bestAvailablePos).slice(0,5);
 list.innerHTML=ranked.length?ranked.map((x,i)=>`<div class="player-line"><span>${i+1}</span>${window.DraftIQAvatar?window.DraftIQAvatar(x.p[0],'cc-best-photo'):`<span class="avatar-fallback cc-best-photo">${String(x.p[0]).split(/\s+/).map(v=>v[0]).join('').slice(0,2).toUpperCase()}</span>`}<div class="name"><b>${E(x.p[0])}</b><small>${window.DraftIQNFLLine?window.DraftIQNFLLine(x.p[0],x.p[1]):x.p[1]}</small></div><div class="value">${x.score.toFixed(1)}</div></div>`).join(''):'<div class="m">No available players at this position.</div>';
}
const priorView=window.view;
window.view=function(v){priorView(v);if(v==='command')setTimeout(renderBestAvailable,0);};
window.addEventListener('load',()=>setTimeout(renderBestAvailable,0));
})();