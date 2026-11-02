const fs=require('fs');
let h=fs.readFileSync(__dirname+'/template.html','utf8');
h=h.replace('/*__THREE__*/',()=>fs.readFileSync(__dirname+'/three.min.js','utf8').replace(/<\/script/gi,'<\\/script'));
h=h.replace('/*__CAD__*/',()=>fs.readFileSync(__dirname+'/cad.json','utf8'));
h+='\n<!-- Three.js license\n'+fs.readFileSync(__dirname+'/LICENSE-three','utf8')+' -->';
fs.writeFileSync(__dirname+'/../HSP_Anatomy.html',h,'utf8');
