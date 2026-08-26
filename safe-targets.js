// Safely bind Available-page target buttons without embedding player names in inline JS.
(function(){
function enc(n){return encodeURIComponent(String(n||''));}
function rewriteTargetButtons(){
 const list=document.getElementById('plist');
 if(!list)return;
 list.querySelectorAll('.row').forEach(row=>{
   const nameEl=row.querySelector('b');
   const btn=row.querySelector('button');
   if(!nameEl||!btn)return;
   const name=nameEl.textContent.trim();
   if(!name)return;
   const isTargeted=!!targetLevel(name);
   btn.removeAttribute('onclick');
   btn.dataset.player=enc(name);
   btn.dataset.targetAction=isTargeted?'remove':'add';
 });
}
document.addEventListener('click',function(e){
 const btn=e.target.closest('#plist button[data-target-action]');
 if(!btn)return;
 e.preventDefault();e.stopPropagation();
 const name=decodeURIComponent(btn.dataset.player||'');
 if(!name)return;
 if(btn.dataset.targetAction==='remove')removeTargetHere(name);else addTargetHere(name,2);
 setTimeout(rewriteTargetButtons,0);
},true);
const original=window.filterPlayers;
window.filterPlayers=function(){original();rewriteTargetButtons();};
setTimeout(rewriteTargetButtons,0);
})();