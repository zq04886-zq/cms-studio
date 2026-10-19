const {spawnSync}=require('child_process'),path=require('path')
const root=path.resolve(__dirname,'..'),action=process.argv[2]
for(const name of action==='install'?['cms-node','cms-manage','crs']:['cms-manage','crs']){
 const cwd=path.join(root,name)
 const args=action==='install'?[process.env.npm_execpath,'ci','--ignore-scripts','--no-audit','--no-fund']:['node_modules/vite/bin/vite.js','build']
 if(action==='install'&&!args[0])throw new Error('请使用 npm run setup')
 console.log(`${action}: ${name}`)
 const r=spawnSync(process.execPath,args,{cwd,stdio:'inherit'})
 if(r.status!==0)process.exit(r.status||1)
 if(action==='install'&&name==='cms-node'){
  const generated=spawnSync(process.execPath,['node_modules/prisma/build/index.js','generate'],{cwd,stdio:'inherit'})
  if(generated.status!==0)process.exit(generated.status||1)
 }
}
