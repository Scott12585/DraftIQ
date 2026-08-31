// Remove redundant Command Center toolbar controls; live pick entry already provides Undo.
(function(){
function cleanup(){
 const shell=document.querySelector('.cc-shell');
 if(!shell)return;
 const toolbar=shell.querySelector('.cc-toolbar');
 if(toolbar)toolbar.remove();
 shell.classList.add('cc-no-toolbar');
}
const priorView=window.view;
window.view=function(v){priorView(v);if(v==='command')setTimeout(cleanup,0);};
window.addEventListener('load',()=>setTimeout(cleanup,0));
})();