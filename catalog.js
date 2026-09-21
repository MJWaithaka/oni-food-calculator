import {foods} from './foods.js';
export {foods};
export const slug=n=>n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
export const imageAliases={"Surf'n'Turf":'surfnturf','Soufflé Pancakes':'souffl_pancakes'};
export const asset=n=>`assets/${imageAliases[n]||slug(n)}.png`;
export const wiki=n=>'https://oxygennotincluded.wiki.gg/wiki/'+encodeURIComponent(n.replaceAll(' ','_'));
export const units=new Set(['Sleet Wheat Grain','Megafrond Grain','Nosh Bean','Mimillet','Pinpoki','Tonic Root','Mimika','Kelpole']);
const R=(station,inputs,output=1,note='')=>({station,inputs,output,note});
export const recipes={
 'Frost Burger':R('Gas Range',[['Frost Bun',1],['Lettuce',1],['Barbeque',1]]),
 'Frost Bun':R('Electric Grill',[['$grain',3]]),
 'Pepper Bread':R('Gas Range',[['$grain',10],['Pincha Peppernut',1]]),
 'Spicy Tofu':R('Gas Range',[['Tofu',1],['Pincha Peppernut',1]]),
 'Mixed Berry Pie':R('Gas Range',[['Grubfruit',4],['Gristle Berry',1],['$grain',3]]),
 'Stuffed Berry':R('Gas Range',[['Gristle Berry',2],['Pincha Peppernut',2]]),
 "Surf'n'Turf":R('Gas Range',[['Barbeque',1],['Cooked Seafood',1]]),
 'Mushroom Wrap':R('Gas Range',[['Fried Mushroom',1],['Lettuce',4]]),
 'Mushroom Quiche':R('Gas Range',[['Omelette',1],['Lettuce',1],['Fried Mushroom',1]]),
 'Barbeque':R('Electric Grill',[['Meat',2]]),
 'Cooked Seafood':R('Electric Grill',[['$seafood',1]]),
 'Fried Mushroom':R('Electric Grill',[['Mushroom',1]]),
 'Gristle Berry':R('Electric Grill',[['Bristle Berry',1]]),
 'Mush Fry':R('Electric Grill',[['Mush Bar',1]]),
 'Mush Bar':R('Microbe Musher',[['Dirt',75],['Water',75]]),
 'Liceloaf':R('Microbe Musher',[['Meal Lice',2],['Water',50]]),
 'Pickled Meal':R('Electric Grill',[['Meal Lice',3]]),
 'Tofu':R('Microbe Musher',[['Nosh Bean',6],['Water',50]]),
 'Pemmican':R('Microbe Musher',[['Meat',1],['Tallow',1]]),
 'Nosh Noms':R('Deep Fryer',[['Nosh Bean',6],['Tallow',1]]),
 'Roast Grubfruit Nut':R('Electric Grill',[['Spindly Grubfruit',1]]),
 'Swampy Delights':R('Electric Grill',[['Bog Jelly',1]]),
 'Berry Sludge':R('Microbe Musher',[['Bristle Berry',1],['$grain',5]]),
 'Grubfruit Preserve':R('Electric Grill',[['Grubfruit',8],['Sucrose',4]]),
 'Omelette':R('Electric Grill',[['Raw Egg',1]]),
 'Soufflé Pancakes':R('Electric Grill',[['Raw Egg',1],['$grain',2]]),
 'Curried Beans':R('Gas Range',[['Nosh Bean',4],['Tonic Root',4]],1,'Uses the dedicated Curried Beans recipe (4 + 4); the overview table disagrees (5 + 5). Verify against your game version.'),
 'Edamame':R('Sushi Bar',[['Nosh Bean',1],['Salty Sticks',1]]),
 'Fish Taco':R('Deep Fryer',[['Fish Fillet',1],['Tallow',2.4],['$grain',2]]),
 'Shellfish Tempura':R('Deep Fryer',[['Raw Shellfish',1],['Tallow',2.4],['$grain',2]]),
 'Squash Fries':R('Deep Fryer',[['Plume Squash',1],['Tallow',1]]),
 'Pikeapple Skewer':R('Electric Grill',[['Pikeapple',1]]),
 'Toasted Mimillet':R('Electric Grill',[['Mimillet',1]]),
 'Sushi Roll':R('Sushi Bar',[['Liceloaf',1],['Nori',1],['Fish Fillet',1]]),
 'Nigiri':R('Sushi Bar',[['Liceloaf',1],['Nori',1],['Calamari',1]]),
 'Uni':R('Sushi Bar',[['Pinpoki',1]]),
 'Smoked Fish':R('Smoker',[['$fillet',6],['$fuel',100]],4),
 'Tender Brisket':R('Smoker',[['Tough Meat',6],['$fuel',100]],3.2),
 'Veggie Poppers':R('Smoker',[['$vegetable',7],['$fuel',100]],4),
 'Fertilizer':R('Fertilizer Synthesizer',[['Dirt',65/120],['Polluted Water',39/120],['Phosphorite',26/120]]),
 'Ethanol':R('Ethanol Distiller',[['Wood',2]]),
 'Snow':R('Ice Maker',[['Water',1]])
};
const P=(name,cycles,yield_,inputs,options={})=>({name,cycles,yield:yield_,inputs,fertilizable:true,...options});
export const plants={
 'Meal Lice':P('Mealwood',3,1,[['Dirt',10]],{fertilizable:false}),
 'Mushroom':P('Dusk Cap',7.5,1,[['Slime',4]],{note:'Requires carbon dioxide, 5–35 °C.'}),
 'Bristle Berry':P('Bristle Blossom',6,1,[['Water',20]],{note:'Requires light, 5–30 °C.'}),
 'Lettuce':P('Waterweed',12,12,[['Bleach Stone',.5],['Salt Water',5]]),
 'Pincha Peppernut':P('Pincha Pepperplant',8,4,[['Phosphorite',1],['Polluted Water',35]]),
 'Sleet Wheat Grain':P('Sleet Wheat',18,18,[['Dirt',5],['Water',20]]),
 'Megafrond Grain':P('Megafrond',9,36,[['Chlorine Gas',54]],{fertilizable:false,wildInputs:[['Chlorine Gas',13.5]]}),
 'Nosh Bean':P('Nosh Sprout',21,12,[['Dirt',5],['Ethanol',20]]),
 'Grubfruit':P('Grubfruit Plant',8,8,[['Sulfur',10]],{note:'Requires Divergent tending to grow full Grubfruit rather than Spindly Grubfruit. Pollinator capacity is not modeled.'}),
 'Spindly Grubfruit':P('Spindly Grubfruit Plant',4,1,[['Sulfur',10]]),
 'Bog Jelly':P('Bog Bucket',6.6,1,[['Polluted Water',40]]),
 'Pikeapple':P('Pikeapple Bush',3,1,[['Phosphorite',5]]),
 'Plume Squash':P('Plume Squash Plant',9,1,[['Ethanol',15]]),
 'Sweatcorn':P('Sweatcorn Stalk',3,1,[['Peat',10]],{note:'Needs pollination. Conservative base growth; pollination speed bonus and pollinator capacity are not included.'}),
 'Salty Sticks':P('Sodicane',4,1,[['Salt',10]],{fertilizable:false}),
 'Pinpoki':P('Pinpoket',16,1,[['Refined Carbon',5]],{note:'Must be submerged; 40–80 °C.'}),
 'Mimika':P('Mimika Bud',5,1,[['Dirt',10]],{selfHarvest:true,note:'Self-harvests a Mimika; it later dies into one Mimillet. Allow startup time.'}),
 'Ovagro Fig':P('Ovagro Node',3,24,[['Water',90]],{branches:24,note:'Assumes 24 productive vines per node, after full establishment.'}),
 'Kelpole':P('Tower Kelp',3,8,[['Polluted Water',30],['Polluted Dirt',40]],{branches:8,note:'Assumes 8 mature branches per tower. Harvested Kelpoles yield Nori on death.'}),
 'Wood':P('Arbor Tree',4.5,1500,[['Polluted Water',70],['Dirt',10]],{branches:5,note:'Five productive branches. First growth and hauling are not included.'}),
 'Plant Meat':P('Saturn Critter Trap',30,10,[['Polluted Water',10]],{mustHarvest:true,note:'Must be dupe-harvested. Consumes one small land critter per harvest.'})
};
// Happy tame adults, steady-state surplus eggs with replacement allowance.
const C=(drop,period,life,diet,space=12)=>({drop,period,life,baby:5,diet,space});
export const critters={
 'Hatch':C(2,6,100,[['Sedimentary Rock',140]]),
 'Stone Hatch':C(2,6,100,[['Igneous Rock',140]]),
 'Sage Hatch':C(2,6,100,[['Dirt',140]]),
 'Drecko':C(2,9,150,[['@Mealwood',.25]]),
 'Pacu':C(1,1.5,25,[['Algae',7.5]],8),
 'Sanishell':C(4,6,100,[['Polluted Dirt',15]]),
 'Glo Squid':C(12,6,100,[['@Tublia',.25]]),
 'Jawbo':C(12,6,100,[['Fish Fillet',1]]),
 'Spigot Seal':C(50,6,100,[['@Bonbon Tree',.5]]),
 'Lumb':C(12,12,200,[['Ovagro Fig',4]],16)
};
export const foraged={'Muckroot':'Buried Muckroot','Hexalent Fruit':'Hexalent','Swamp Chard Heart':'Swamp Chard','Sherberry':'Sherberry Plant','Snac Fruit':'Snactus','Mussel Tongue':'Mussel Sprout','Nutrient Bar':'Ration Box'};
export const choices={grain:['Sleet Wheat Grain','Megafrond Grain'],meat:['Hatch','Stone Hatch','Sage Hatch','Drecko'],seafood:['Fish Fillet','Raw Shellfish'],fillet:['Fish Fillet','Jawbo Fillet'],vegetable:['Sweatcorn','Pikeapple','Spindly Grubfruit'],fuel:['Wood','Peat']};
export const defaults={normal:12,bottomless:0,hunger:0,wild:false,harvest:true,fertilizer:false,margin:0,...Object.fromEntries(Object.entries(choices).map(([k,v])=>[k,v[0]]))};
