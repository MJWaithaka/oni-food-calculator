import {foods,asset,wiki,defaults,choices} from './catalog.js';
import {calculate,normalizeSettings} from './calculator.js';
import {availableAssets} from './asset-status.js';
const $=id=>document.getElementById(id),fmt=n=>n.toLocaleString(undefined,{maximumFractionDigits:n<1?3:2});
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
let settings={...defaults},selected='Frost Burger',result;
const query=new URLSearchParams(location.search);
for(const key of Object.keys(defaults))if(query.has(key))settings[key]=typeof defaults[key]==='boolean'?query.get(key)==='true':query.get(key);
settings=normalizeSettings(settings);
if(foods.some(f=>f.name===query.get('food')))selected=query.get('food');
for(const key of ['normal','bottomless','hunger','margin','wild','harvest','fertilizer']){if(typeof defaults[key]==='boolean')$(key).checked=settings[key];else $(key).value=settings[key];}
function sprite(name){const path=asset(name);return `<span class="sprite">${availableAssets.has(path)?`<img src="${path}" alt="" loading="lazy">`:`<span class="fallback" title="${esc(name)} — image not downloaded">${esc(name.split(' ').map(x=>x[0]).join('').slice(0,3))}</span>`}</span>`;}
// Also handle files removed after the image inventory was generated.
document.addEventListener('error',event=>{if(event.target instanceof HTMLImageElement){event.target.parentElement.innerHTML='<span class="fallback" title="Image unavailable">?</span>';}},true);
function renderFoods(){
 const list=foods.filter(f=>f.name.toLowerCase().includes($('search').value.toLowerCase())&&($('dlc').value==='all'||f.dlc===$('dlc').value)).sort((a,b)=>b.q-a.q||a.name.localeCompare(b.name));
 $('food-count').textContent=`${list.length} foods · highest quality first`;
 $('foods').innerHTML=list.length?list.map(f=>`<button class="food ${selected===f.name?'selected':''}" data-food="${esc(f.name)}" aria-pressed="${selected===f.name}" title="${esc(f.name)} · ${f.kcal} kcal/kg · ${f.dlc}">${sprite(f.name)}<span>${esc(f.name)}</span><span class="quality">${f.q>0?'+':''}${f.q}</span></button>`).join(''):'<p class="muted">No matching foods.</p>';
}
const labels={meat:'Meat ranch',grain:'Grain source',seafood:'Cooked Seafood ingredient',fillet:'Smoked Fish ingredient',vegetable:'Veggie Poppers ingredient',fuel:'Smoker fuel'};
function renderNode(n){return `<li class="tree-item"><a class="node ${n.kind}" href="${wiki(n.name)}" target="_blank" rel="noreferrer" title="${esc(n.note)}">${sprite(n.name)}<span class="node-name">${esc(n.name)}</span><span class="node-value">${fmt(n.amount)}</span><span class="node-unit">${n.unit}</span><span class="node-note">${esc(n.note)}</span></a>${n.children.length?`<ul class="tree-list">${n.children.map(renderNode).join('')}</ul>`:''}</li>`;}
function row(name,value,detail){return `<div class="summary-row">${sprite(name)}<span>${esc(name)}</span><strong>${value}<small>${esc(detail)}</small></strong></div>`;}
function render(){
 settings=normalizeSettings(settings);result=calculate(selected,settings);
 $('selected-name').textContent=selected;$('selected-detail').textContent=`${result.food.dlc} · Quality ${result.food.q>0?'+':''}${result.food.q} · ${fmt(result.tree.amount)} kg/cycle`;$('kcal').textContent=fmt(result.kcal);
 $('routes').innerHTML=result.used.map(key=>`<label>${labels[key]}<select data-route="${key}">${choices[key].map(value=>`<option${settings[key]===value?' selected':''}>${esc(value)}</option>`).join('')}</select></label>`).join('');
 $('tree').innerHTML=`<ul class="tree-list">${renderNode(result.tree)}</ul>`;
 $('capacity').innerHTML=Object.entries(result.farm).map(([n,v])=>row(n,Math.ceil(v-1e-10),`${fmt(v)} plants minimum`)).join('')+Object.entries(result.ranch).map(([n,v])=>row(n,Math.ceil(v-1e-10),`${fmt(v)} adults minimum`)).join('')||'<p class="muted">No renewable capacity in this plan.</p>';
 $('resources').innerHTML=Object.entries(result.resources).sort(([a],[b])=>a.localeCompare(b)).map(([n,v])=>row(n,fmt(v),'kg / cycle')).join('')||'<p class="muted">No external resource input.</p>';
 $('stations').innerHTML=Object.entries(result.stations).map(([n,v])=>row(n,fmt(v),result.stationUnits[n])).join('')||'<p class="muted">No cooking required.</p>';
 $('warnings').innerHTML=result.warnings.map(w=>`<li>${esc(w)}</li>`).join('');
 if(settings.fertilizer&&settings.wild)$('warnings').insertAdjacentHTML('beforeend','<li>Farmer’s Touch is disabled for wild plants.</li>');
 requestAnimationFrame(()=>{$('tree-viewport').scrollLeft=($('tree-viewport').scrollWidth-$('tree-viewport').clientWidth)/2;});
}
$('foods').addEventListener('click',e=>{const b=e.target.closest('[data-food]');if(!b)return;selected=b.dataset.food;renderFoods();render();});
$('routes').addEventListener('change',e=>{if(e.target.dataset.route){settings[e.target.dataset.route]=e.target.value;render();}});
for(const key of ['normal','bottomless','hunger','margin','wild','harvest','fertilizer'])$(key).addEventListener('input',()=>{settings[key]=typeof defaults[key]==='boolean'?$(key).checked:$(key).value;render();});
$('search').addEventListener('input',renderFoods);$('dlc').addEventListener('change',renderFoods);
function zoom(value){$('tree').style.zoom=value/100;$('zoom').value=value;}
$('zoom').addEventListener('input',()=>zoom(+$('zoom').value));$('reset-zoom').onclick=()=>zoom(100);
$('fit').onclick=()=>{zoom(100);const width=$('tree').scrollWidth,available=$('tree-viewport').clientWidth-30;zoom(Math.max(55,Math.min(100,100*available/width)));$('tree-viewport').scrollLeft=0;};
$('share').onclick=async()=>{const params=new URLSearchParams({food:selected,...settings});const url=new URL(location.href);url.search=params;url.hash='';try{await navigator.clipboard.writeText(url.href);$('status').textContent='Plan link copied.';}catch{window.prompt('Copy this plan link',url.href);}};
renderFoods();render();
