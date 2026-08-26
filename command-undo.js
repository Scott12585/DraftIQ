// Keep draft-day Undo actions on the Command Center without reopening Live Pick search.
(function(){
window.undoLastPick=function(){
  if(!s.draft.length)return;
  const last=s.draft.slice().sort((a,b)=>b.pick-a.pick)[0];
  s.draft=s.draft.filter(d=>!(d.pick===last.pick&&keyName(d.name)===keyName(last.name)));
  s.pick=last.pick;
  save();
  view('command');
  setTimeout(()=>{
    const input=document.getElementById('livePickSearch');
    const results=document.getElementById('livePickResults');
    if(input)input.blur();
    if(results){results.innerHTML='';results.style.display='none';}
  },0);
};
})();