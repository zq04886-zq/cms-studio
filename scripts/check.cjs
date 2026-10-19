const fs=require('fs'),path=require('path'),{spawnSync}=require('child_process')
const root=path.resolve(__dirname,'..');let count=0
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 if(['node_modules','dist','.git','data','logs'].includes(e.name))continue
 const p=path.join(dir,e.name)
 if(e.isDirectory())walk(p);else if(/\.(js|cjs)$/.test(e.name)){
  const r=spawnSync(process.execPath,['--check',p],{encoding:'utf8'});if(r.status){console.error(r.stderr);process.exit(1)}count++
 }
}}
walk(path.join(root,'cms-node'));walk(path.join(root,'scripts'));console.log(`${count} 个服务端及工具脚本通过语法检查`)
