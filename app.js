const paths = {
  route:'<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M8 6h7a4 4 0 0 1 0 8H9a2 2 0 0 0 0 4h7"/>',
  book:'<path d="M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2zM12 6v15"/>',
  device:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  layers:'<path d="m3 8 9-5 9 5-9 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chart:'<path d="M4 20V13m6 7V9m6 11V4"/>',
  down:'<path d="m6 9 6 6 6-6"/>',right:'<path d="m9 5 7 7-7 7"/>'
};
function icon(name) {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
}
document.querySelectorAll('[data-icon]').forEach(el=>el.outerHTML=icon(el.dataset.icon));
const id = (p,i) => 'phase-'+(p+1)+'-item-'+(i+1);
const keys = phases.flatMap((p,n)=>p.items.map((_,i)=>id(n,i)));
const storageKey='stackpath.python.v1';
let checked=new Set();
function readProgress(){
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');
    checked=new Set(Array.isArray(saved)?saved.filter(k=>keys.includes(k)):[]);
  }catch{document.getElementById('save-status').textContent='Progress in this tab';}
}
readProgress();
const byId=id=>document.getElementById(id);
const nav=byId('phase-links'), content=byId('content');
const pad=n=>String(n).padStart(2,'0');
let active=0, resources=false;
function progress(){
  byId('percent').innerHTML=Math.round(100*checked.size/keys.length)+'<span>%</span>';
  byId('count').textContent=checked.size+' of '+keys.length+' complete';
  byId('meter').max=keys.length;byId('meter').value=checked.size;
  if (!resources) {
    const p=phases[active], n=p.items.filter((_,i)=>checked.has(id(active,i))).length;
    byId('phase-count').textContent=n+' / '+p.items.length+' complete';
  }
}
function render(){
  const hash=location.hash.slice(1);
  resources=hash==='resources';
  const phaseMatch=/^phase-([1-5])$/.exec(hash);
  if(phaseMatch)active=Number(phaseMatch[1])-1;
  byId('road-tab').setAttribute('href','#phase-'+(active+1));
  for(const [tab,on] of [['road-tab',!resources],['res-tab',resources]]){
    if(on)byId(tab).setAttribute('aria-current','page');else byId(tab).removeAttribute('aria-current');
  }
  nav.innerHTML=phases.map((p,n)=>'<a class="phase-link" href="#phase-'+(n+1)+'" '+(!resources&&n===active?'aria-current="step"':'')+'><span class="phase-num">'+pad(n+1)+'</span>'+p.name+(!resources&&n===active?icon('right'):'')+'</a>').join('');
  if(resources){
    content.innerHTML='<div class="section-head"><h2>Resources</h2><p>Study guidance, reference books, and practice from the roadmap.</p></div>'+guides.map((g,i)=>'<details class="guide" '+(i===0?'open':'')+'><summary>'+g.name+'</summary><div class="detail">'+g.detail+'</div></details>').join('');
  }else{
    const p=phases[active];
    content.innerHTML='<div class="section-head"><div class="phase-intro"><span class="phase-badge">PHASE '+pad(active+1)+'</span><span class="week">'+icon('calendar')+' Weeks '+p.weeks+'</span></div><h2>'+p.name+'</h2><p>'+p.description+'</p></div><div class="subbar"><strong>Phase checklist</strong><span id="phase-count" aria-live="polite"></span></div>'+p.items.map((item,i)=>{
      const key=id(active,i), project=i===p.items.length-1;
      return '<article class="task"><div class="task-main"><input type="checkbox" class="tick" data-key="'+key+'" aria-label="Mark '+item.title+' complete" '+(checked.has(key)?'checked':'')+'><button type="button" class="task-button" aria-expanded="false" aria-controls="'+key+'-detail"><span class="task-text"><span class="task-title"><span class="task-num">'+(project?'PROJECT':(active+1)+'.'+(i+1))+'</span>'+item.title+'</span><span class="task-summary">'+item.summary+'</span></span>'+icon('down')+'</button></div><div id="'+key+'-detail" hidden class="detail">'+item.detail+'</div></article>';
    }).join('');
  }
  progress();
}
content.addEventListener('change',e=>{
  const input=e.target.closest('.tick');
  if(!input)return;
  if(input.checked)checked.add(input.dataset.key);else checked.delete(input.dataset.key);
  try{localStorage.setItem(storageKey,JSON.stringify([...checked]));}catch{byId('save-status').textContent='Progress in this tab';}
  progress();
});
content.addEventListener('click',e=>{
  const button=e.target.closest('.task-button');
  if(!button)return;
  const open=button.getAttribute('aria-expanded')==='true';
  button.setAttribute('aria-expanded',String(!open));
  byId(button.getAttribute('aria-controls')).hidden=open;
});
window.addEventListener('hashchange',render);
window.addEventListener('storage',e=>{
  if(e.key!==storageKey && e.key!==null)return;
  readProgress();
  content.querySelectorAll('.tick').forEach(el=>el.checked=checked.has(el.dataset.key));
  progress();
});
render();
