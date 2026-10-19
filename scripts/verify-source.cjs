const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const baseline=require('../verification/source-baseline.json');
const localOnly=new Set(['cms-node/config/config.env.dev.js','cms-node/config/config.env.prod.js','cms-node/utils/ftp.js','cms-node/cms.sql']);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
let checked=0,missing=0,fail=[];
for(const [rel,expected] of Object.entries(baseline)){
 const p=path.join(root,rel);
 if(!fs.existsSync(p)){if(localOnly.has(rel)){missing++;continue;}fail.push(rel+': missing');continue;}
 let data=fs.readFileSync(p);
 if(/\.(js|vue|json|css|less|scss|html|md|sql|ejs|txt|yml|yaml)$/.test(rel)||path.basename(rel).startsWith('.')) data=Buffer.from(data.toString('utf8').replace(/\r\n/g,'\n'));
 if(rel==='cms-manage/src/App.vue'){
 const suffix=Buffer.from('\n<style src="./styles/studio.css"></style>\n');
 if(!data.subarray(-suffix.length).equals(suffix)){fail.push(rel+': unexpected style import');continue;}
 data=data.subarray(0,-suffix.length);
 }
 if(hash(data)!==expected)fail.push(rel+': differs from course source');else checked++;
}
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 if(['node_modules','dist','.git','logs','data'].includes(e.name))continue;
 const p=path.join(dir,e.name);if(e.isDirectory()){walk(p);continue;}
 const rel=path.relative(root,p).split(path.sep).join('/');
 if(/\.(js|cjs|mjs|ts|vue)$/.test(rel)&&!baseline[rel])fail.push(rel+': extra source file');
}}
for(const mod of ['cms-manage','cms-node','crs'])walk(path.join(root,mod));
console.log(JSON.stringify({checked,localConfigurationAbsent:missing,failures:fail},null,2));
process.exitCode=fail.length?1:0;
