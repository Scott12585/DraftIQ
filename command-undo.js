// Keep draft-day Undo actions on the Command Center instead of navigating to Draft Board.
(function(){
const originalUndo=window.undoLastPick;
window.undoLastPick=function(){
  if(!s.draft.length)return;
  const last=s.draft.slice().sort((a,b)=>b.pick-a.pick)[0];
  s.draft=s.draft.filter(d=>!(d.pick===last.pick&&keyName(d.name)===keyName(last.name)));
  s.pick=last.pick;
  save();
  view('command');
  setTimeout(()=>document.getElementById('livePickSearch')?.focus(),0);
};
})();