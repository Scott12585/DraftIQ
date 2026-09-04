// DraftIQ v0.9.33 — page theme state.
(function(){
const pages=['command','draft','players','roster','teams','board','targets','league'];
function setPage(v){pages.forEach(p=>document.body.classList.remove('page-'+p));document.body.classList.add('page-'+v);}
const baseView=window.view;
window.view=function(v){setPage(v);return baseView(v);};
window.addEventListener('load',()=>{if(document.body.classList.contains('command-active'))setPage('command');else{const on=document.querySelector('nav button.on');const label=(on?.textContent||'').toLowerCase();const map={'draft assistant':'draft','available':'players','my team':'roster','league rosters':'teams','draft board':'board','targets':'targets','keepers':'league'};setPage(map[label]||'command');}});
})();