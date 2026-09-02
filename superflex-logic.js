// DraftIQ v0.9.31: Superflex-aware QB demand.
// Every team begins with a keeper QB, but QB2 remains a meaningful starting need.
(function(){
window.teamNeedMultiplier=function(team,pos){
  const r=teamRoster(team),n=r.filter(x=>x.pos===pos).length;
  if(pos==='QB') return n===0?1.55:n===1?1.22:n===2?.62:.28;
  if(pos==='RB') return n<2?1.30:n<4?1.05:.80;
  if(pos==='WR') return n<3?1.35:n<5?1.08:.82;
  if(pos==='TE') return n===0?1.15:n===1?.65:.35;
  return 1;
};
window.posNeed=function(pos){
  const n=myRoster().filter(x=>x.pos===pos).length;
  if(pos==='QB') return n===0?92:n===1?68:n===2?28:12;
  if(pos==='RB') return Math.max(18,90-n*23);
  if(pos==='WR') return Math.max(20,95-n*20);
  if(pos==='TE') return n?25:58;
  return 20;
};
})();