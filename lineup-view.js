(function(){
function pProj(x){return player(x.name)?.[3]||0;}
function sortProj(a,b){return pProj(b)-pProj(a);}
function assignLineup(){
  const pool=myRoster().slice().sort(sortProj);
  const used=new Set();
  function takePos(pos){const x=pool.find((p,i)=>!used.has(i)&&p.pos===pos);if(!x)return null;used.add(pool.indexOf(x));return x;}
  function takeEligible(positions,preferQB=false){let candidates=pool.map((p,i)=>({p,i})).filter(x=>!used.has(x.i)&&positions.includes(x.p.pos));if(!candidates.length)return null;if(preferQB){const qb=candidates.filter(x=>x.p.pos==='QB').sort((a,b)=>pProj(b.p)-pProj(a.p))[0];if(qb){used.add(qb.i);return qb.p;}}candidates.sort((a,b)=>pProj(b.p)-pProj(a.p));used.add(candidates[0].i);return candidates[0].p;}
  const slots=[];
  slots.push({label:'QB',player:takePos('QB')});
  slots.push({label:'RB',player:takePos('RB')});
  slots.push({label:'RB',player:takePos('RB')});
  slots.push({label:'WR',player:takePos('WR')});
  slots.push({label:'WR',player:takePos('WR')});
  slots.push({label:'WR',player:takePos('WR')});
  slots.push({label:'W/R/T',player:takeEligible(['WR','RB','TE'])});
  slots.push({label:'QB/W/R/T',player:takeEligible(['QB','WR','RB','TE'],true)});
  const bench=pool.map((p,i)=>({p,i})).filter(x=>!used.has(x.i)).map(x=>x.p);
  while(bench.length<8)bench.push(null);
  return {slots,bench:bench.slice(0,8)};
}
function row(slot,p,isBench=false){if(!p)return `<div class="lineup-row empty"><div class="lineup-slot">${slot}</div><div class="lineup-empty">OPEN SLOT</div></div>`;const proj=player(p.name)?.[3];return `<div class="lineup-row"><div class="lineup-slot ${isBench?'bench':''}">${slot}</div><div class="lineup-player"><b>${E(p.name)}</b><small>${p.pos||'—'}${p.keeper?' • Keeper':p.pick?` • Pick ${fmtPick(p.pick)}`:''}</small></div><div class="lineup-proj">${proj?proj.toFixed(1):'—'}<small>Proj</small></div></div>`;}
const baseRosterView=rosterView;
rosterView=function(){const {slots,bench}=assignLineup();const roster=myRoster();const starterCount=slots.filter(x=>x.player).length;return `<div class="mt-page lineup-page"><div class="mt-hero"><div><div class="mt-kicker">RED ZONE FRANCHISE HQ</div><h2>Rice Rice Baby</h2><p>Manager: Scott • Live starting lineup and bench assignment.</p></div><div class="mt-status"><strong>${starterCount} / 8</strong><span>STARTERS FILLED</span></div></div><div class="lineup-layout"><section class="mt-panel"><div class="mt-panel-head"><h3>Starting Lineup</h3><span class="m">DraftIQ fills starter spots before bench</span></div><div class="lineup-list">${slots.map(x=>row(x.label,x.player,false)).join('')}</div></section><section class="mt-panel"><div class="mt-panel-head"><h3>Bench</h3><span class="m">${Math.max(0,roster.length-starterCount)} players</span></div><div class="lineup-list">${bench.map((p,i)=>row(`BN ${i+1}`,p,true)).join('')}</div></section></div></div>`;};
window.DraftIQAssignLineup=assignLineup;
})();