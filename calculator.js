import {foods,recipes,plants,critters,foraged,units,defaults,choices} from './catalog.js';

export function normalizeSettings(input={}) {
 const s={...defaults,...input};
 for(const k of ['normal','bottomless','margin'])s[k]=Math.min(100000,Math.max(0,Number(s[k])||0));
 s.margin=Math.min(100,s.margin);
 s.hunger=[-1000,-500,0,500,1000].includes(Number(s.hunger))?Number(s.hunger):0;
 for(const [k,v] of Object.entries(choices))if(!v.includes(s[k]))s[k]=v[0];
 return s;
}
export function calculate(foodName,input={}) {
 const s=normalizeSettings(input), food=foods.find(f=>f.name===foodName);
 if(!food)throw new Error('Unknown food: '+foodName);
 const kcal=(s.normal*Math.max(0,1000+s.hunger)+s.bottomless*Math.max(0,1500+s.hunger))*(1+s.margin/100);
 const resources={},farm={},ranch={},stations={},stationUnits={},warnings=new Set(),used=new Set();let serial=0;
 const add=(map,name,amount)=>map[name]=(map[name]||0)+amount;
 const node=(name,amount,unit,kind,note='',children=[])=>({id:++serial,name,amount,unit,kind,note,children});
 const resolve=name=>{if(!name.startsWith('$'))return name;used.add(name.slice(1));return s[name.slice(1)];};
 const leaf=(name,amount,unit='kg/cycle',note='External resource supply')=>{add(resources,name,amount);return node(name,amount,unit,'resource',note);};
 function plant(p,count,note='') {
  add(farm,p.name,count);
  const children=(s.wild?p.wildInputs||[]:p.inputs).map(([n,q])=>walk(n,q*count));
  if(s.fertilizer&&!s.wild&&p.fertilizable)children.push(walk('Fertilizer',5*count*(p.branches||1)));
  if(p.note)warnings.add(p.note);
  return node(p.name,count,'plants','plant',[s.wild?'Wild':'Domestic',note,p.note].filter(Boolean).join(' · '),children);
 }
 function graze(name,rate) {
  if(name==='Mealwood')return plant(plants['Meal Lice'],rate*3*(s.wild?4:1),'Live plant grazing; no harvested Meal Lice');
  if(name==='Tublia')return plant({name,inputs:[['Brine',30],['Sulfur',20]],fertilizable:true},rate*8*(s.wild?4:1)/(s.fertilizer&&!s.wild?2:1),'Live growth grazed; 8-cycle domestic growth');
  if(name==='Bonbon Tree') {
   warnings.add('Bonbon Tree assumes all five branches continuously receive 10,000 lux. Do not harvest the nectar-producing branches for wood.');
   return plant({name,inputs:[['Snow',100]],fertilizable:false},rate*(s.wild?4:1),'Five mature branches at 10,000 lux; nectar, not wood');
  }
  throw new Error('Unmodeled graze '+name);
 }
 function breed(name,harvestRate,product='offspring') {
  const c=critters[name];
  const net=1/c.period-1/(c.life-c.baby),count=harvestRate/net;
  add(ranch,name,count);
  const children=c.diet.map(([n,q])=>n.startsWith('@')?graze(n.slice(1),count*q):walk(n,count*q));
  const action=node(name,harvestRate,product==='eggs'?'eggs/cycle':'harvests/cycle','harvest',product==='eggs'?'Crack surplus eggs; retain replacements':'Harvest surplus hatchlings; retain replacements');
  action.children=[node(name,count,'adult breeders','critter',`Happy, fed adults · 1 egg / ${c.period} cycles · ${c.space} tiles/adult`,children)];
  warnings.add('Ranches assume happy, fed adults, surplus hatchling harvesting, and same-morph eggs. Breeder replacements are reserved; their baby feed, incubation space, breeder death drops, startup time and coproduct credits are excluded.');
  return action;
 }
 function walk(name,amount,path=[]) {
  name=resolve(name);
  if(path.includes(name))throw new Error('Production cycle: '+[...path,name].join(' → '));
  const unit=units.has(name)?'units/cycle':'kg/cycle';
  const n=node(name,amount,unit,'ingredient');
  if(recipes[name]) {
   const r=recipes[name],industrial=['Fertilizer','Ethanol','Snow'].includes(name);
   add(stations,r.station,industrial?amount:amount/r.output);
   stationUnits[r.station]=industrial?'kg output / cycle':'batches / cycle';
   n.kind='recipe';n.note=r.station+(industrial?' · inputs per kg output':` · ${r.output} kg/batch`);
   if(r.note)warnings.add(r.note);
   n.children=r.inputs.map(([part,q])=>walk(part,amount*q/r.output,[...path,name]));return n;
  }
  if(plants[name]) {
   const p=plants[name],growth=p.cycles*(s.wild?4:1)/(s.fertilizer&&!s.wild&&p.fertilizable?2:1);
   const delay=s.harvest||p.selfHarvest||p.mustHarvest?0:4;
   n.note=`${p.yield} ${unit.startsWith('units')?'units':'kg'} / ${growth+delay} cycles`;
   n.children=[plant(p,amount/p.yield*(growth+delay),`${growth}-cycle growth${delay?' + 4-cycle drop delay':''}`)];
   if(name==='Plant Meat')n.children[0].children.push(breed('Hatch',amount/10));
   if(p.mustHarvest&&!s.harvest)warnings.add('Saturn Critter Traps cannot self-harvest: dupe harvesting is still required.');
   return n;
  }
  if(name==='Mimillet') {n.note='One seed when a Mimika dies';n.children=[walk('Mimika',amount)];return n;}
  if(name==='Nori') {n.note='10 kg per Kelpole';n.children=[walk('Kelpole',amount/10)];return n;}
  if(name==='Meat') {used.add('meat');n.children=[breed(s.meat,amount/critters[s.meat].drop)];return n;}
  const sources={'Calamari':'Glo Squid','Jawbo Fillet':'Jawbo','Fish Fillet':'Pacu','Raw Shellfish':'Sanishell','Tallow':'Spigot Seal','Tough Meat':'Lumb'};
  if(sources[name]) {const c=sources[name];n.note=`${critters[c].drop} kg per harvested animal`;n.children=[breed(c,amount/critters[c].drop)];return n;}
  if(name==='Raw Egg') {n.note='Hatch egg: 1 kg raw egg; Egg Cracker';n.children=[breed('Hatch',amount,'eggs')];return n;}
  if(name==='Tonic Root') {
   n.note='Shearing Station · 8 roots every 8 cycles';
   add(ranch,'Delecta Vole',amount);
   n.children=[node('Delecta Vole',amount,'adults','critter','Feed at 70–80 °C; prompt shearing',[walk('Regolith',4800*amount)])];
   warnings.add('Delecta Vole assumes ideal 8-cycle quill regrowth and an established herd; maintain replacement morphs separately.');return n;
  }
  if(name==='Sucrose') {
   add(ranch,'Sweetle',amount/10);
   n.note='Sweetle excretion: 20 kg sulfur → 10 kg sucrose per cycle';
   n.children=[node('Sweetle',amount/10,'adults','critter','Established, fed herd; replacements separate',[walk('Sulfur',amount*2)])];return n;
  }
  if(foraged[name]) {
   n.kind='limited';n.note='Finite supply — not a sustainable farm';
   n.children=[leaf(foraged[name],amount,'kg/cycle','Forage / starting supplies; replenishment not guaranteed')];
   warnings.add(`${name} is a finite foraged or starting supply, not a sustainable food plan.`);return n;
  }
  return leaf(name,amount,unit);
 }
 // The wiki rounds this calorie density to 2863; 11450 kcal / 4 kg is exact.
 const density=food.name==='Veggie Poppers'?11450/4:food.kcal;
 const tree=walk(food.name,kcal/density);
 return {tree,kcal,food,resources,farm,ranch,stations,stationUnits,warnings:[...warnings],used:[...used],settings:s};
}
