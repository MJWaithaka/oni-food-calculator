import fs from 'node:fs';
const files=['index.html','index.css','main.js','catalog.js','calculator.js','foods.js','asset-status.js','ASSETS.md','asset-manifest.json'];
fs.mkdirSync('_site/assets',{recursive:true});
for(const file of files)fs.copyFileSync(file,`_site/${file}`);
const manifest=JSON.parse(fs.readFileSync('asset-manifest.json'));
for(const item of manifest.filter(x=>x.present))fs.copyFileSync(item.path,`_site/${item.path}`);
console.log(`Built static site: ${files.length} files, ${manifest.filter(x=>x.present).length} images.`);
