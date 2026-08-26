// 2026 D/ST rankings for DraftIQ. Uses current consensus draft projections/rankings.
(function(){
const DST=[
['Houston Texans D/ST',1,120.2],['Denver Broncos D/ST',2,118.3],['Los Angeles Rams D/ST',3,107.3],['Seattle Seahawks D/ST',4,110.9],['Philadelphia Eagles D/ST',5,102.6],['New England Patriots D/ST',6,101.0],['Minnesota Vikings D/ST',7,112.8],['Pittsburgh Steelers D/ST',8,111.8],['Jacksonville Jaguars D/ST',9,99.0],['Los Angeles Chargers D/ST',10,108.6],['Baltimore Ravens D/ST',11,101.5],['Kansas City Chiefs D/ST',12,100.0],['Green Bay Packers D/ST',13,98.5],['Detroit Lions D/ST',14,106.8],['Buffalo Bills D/ST',15,106.6],['Cleveland Browns D/ST',16,96.0],['Dallas Cowboys D/ST',17,94.0],['San Francisco 49ers D/ST',18,93.0],['Tampa Bay Buccaneers D/ST',19,92.0],['New York Jets D/ST',20,91.0],['Atlanta Falcons D/ST',21,90.0],['Arizona Cardinals D/ST',22,89.0],['Chicago Bears D/ST',23,88.0],['Cincinnati Bengals D/ST',24,87.0],['Indianapolis Colts D/ST',25,86.0],['Las Vegas Raiders D/ST',26,85.0],['Miami Dolphins D/ST',27,84.0],['New Orleans Saints D/ST',28,83.0],['New York Giants D/ST',29,82.0],['Carolina Panthers D/ST',30,81.0],['Tennessee Titans D/ST',31,80.0],['Washington Commanders D/ST',32,79.0]
];
const map=new Map(DST.map(x=>[keyName(x[0]),x]));
P.forEach(p=>{if(p[1]!=='DEF')return;const d=map.get(keyName(p[0]));if(d){p[2]=200+d[1];p[3]=d[2];}});
window.DraftIQDefenseRankings=DST;
// DEF is a required starter, but it should remain a late-round need rather than distort early recommendations.
const oldPosNeed=posNeed;
posNeed=function(pos){if(pos==='DEF'){const has=myRoster().some(x=>x.pos==='DEF');if(has)return 2;const r=round(s.pick);return r>=10?58:r>=8?30:4;}return oldPosNeed(pos);};
const oldMultiplier=teamNeedMultiplier;
teamNeedMultiplier=function(team,pos){if(pos==='DEF'){const has=teamRoster(team).some(x=>x.pos==='DEF');return has?.15:(round(s.pick)>=9?1.0:.15);}return oldMultiplier(team,pos);};
function addDefOption(){const sel=document.getElementById('pos');if(!sel||Array.from(sel.options).some(o=>o.value==='DEF'))return;const o=document.createElement('option');o.value='DEF';o.textContent='DEF';sel.appendChild(o);}
const oldFilter=filterPlayers;
filterPlayers=function(){addDefOption();oldFilter();};
const oldView=view;
view=function(v){oldView(v);if(v==='players')addDefOption();};
if(document.getElementById('pos'))addDefOption();
})();