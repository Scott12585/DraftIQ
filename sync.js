// DraftIQ shared-state sync. localStorage remains the offline fallback.
const DRAFTIQ_SUPABASE_URL='https://uinhyjqsqrgfczqrmcya.supabase.co';
const DRAFTIQ_SUPABASE_KEY='sb_publishable_qmrBMbSlLInIYT2IXwy49Q_WnMiToQJ';
const DRAFTIQ_STATE_ID=1;
let draftiqCloudReady=false;
let draftiqCloudApplying=false;
let draftiqCloudTimer=null;
let draftiqLastCloud='';

async function draftiqCloudRequest(method,body){
  const url=`${DRAFTIQ_SUPABASE_URL}/rest/v1/draftiq_state?id=eq.${DRAFTIQ_STATE_ID}`;
  const headers={apikey:DRAFTIQ_SUPABASE_KEY,Authorization:`Bearer ${DRAFTIQ_SUPABASE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'};
  const r=await fetch(url,{method,headers,body:body?JSON.stringify(body):undefined,cache:'no-store'});
  if(!r.ok)throw new Error(`DraftIQ cloud ${r.status}`);
  return r.status===204?[]:r.json();
}
async function draftiqLoadCloud(){
  try{
    const rows=await draftiqCloudRequest('GET');
    const cloud=rows?.[0]?.state;
    if(cloud&&Object.keys(cloud).length){
      draftiqCloudApplying=true;
      s={...defaults,...cloud};
      s.teams=s.teams||defaults.teams;s.draft=s.draft||[];s.targets=s.targets||[];s.owners=s.owners||{...DEFAULT_OWNERS};
      localStorage.setItem(KEY,JSON.stringify(s));
      draftiqLastCloud=JSON.stringify(s);
      draftiqCloudApplying=false;
      view('command');
    }else{
      await draftiqPushCloud();
    }
    draftiqCloudReady=true;
    draftiqSetSyncStatus('Synced');
  }catch(e){draftiqCloudReady=true;draftiqSetSyncStatus('Offline');console.warn(e);}
}
async function draftiqPushCloud(){
  if(draftiqCloudApplying)return;
  const snapshot=JSON.stringify(s);
  if(snapshot===draftiqLastCloud)return;
  try{
    await draftiqCloudRequest('PATCH',{state:s,updated_at:new Date().toISOString()});
    draftiqLastCloud=snapshot;
    draftiqSetSyncStatus('Synced');
  }catch(e){draftiqSetSyncStatus('Offline');console.warn(e);}
}
function draftiqQueueCloud(){
  if(!draftiqCloudReady||draftiqCloudApplying)return;
  draftiqSetSyncStatus('Saving…');
  clearTimeout(draftiqCloudTimer);
  draftiqCloudTimer=setTimeout(draftiqPushCloud,250);
}
function draftiqSetSyncStatus(text){
  let el=document.getElementById('cloudSyncStatus');
  if(!el){el=document.createElement('div');el.id='cloudSyncStatus';el.style.cssText='font-size:9px;color:#92959c;text-align:center;margin:7px 0 2px;letter-spacing:.5px';document.querySelector('header')?.appendChild(el);}
  el.textContent=`CLOUD • ${text}`;
}
async function draftiqPollCloud(){
  if(!draftiqCloudReady||document.hidden)return;
  try{
    const rows=await draftiqCloudRequest('GET');
    const cloud=rows?.[0]?.state;if(!cloud||!Object.keys(cloud).length)return;
    const snap=JSON.stringify({...defaults,...cloud});
    if(snap!==draftiqLastCloud&&snap!==JSON.stringify(s)){
      draftiqCloudApplying=true;s={...defaults,...cloud};localStorage.setItem(KEY,JSON.stringify(s));draftiqLastCloud=JSON.stringify(s);draftiqCloudApplying=false;view('command');
    }
  }catch(e){}
}
const draftiqLocalSave=save;
save=function(){draftiqLocalSave();draftiqQueueCloud();};
window.addEventListener('load',()=>{draftiqSetSyncStatus('Connecting…');draftiqLoadCloud();setInterval(draftiqPollCloud,3000);});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)draftiqPollCloud();});