const {spawnSync}=require('child_process'),path=require('path')
const root=path.resolve(__dirname,'..'),action=process.argv[2]
for(const name of action==='install'?['cms-node','cms-manage','crs']:['cms-manage','crs']){
 const cwd=path.join(root,name)
 const args=action==='install'?[process.env.npm_execpath,'ci','--legacy-peer-deps','--ignore-scripts','--no-audit','--no-fund']:['--openssl-legacy-provider','node_modules/@vue/cli-service/bin/vue-cli-service.js','build']
 if(action==='install'&&!args[0])throw new Error('请使用 npm run setup')
 console.log(`${action}: ${name}`)
 const r=spawnSync(process.execPath,args,{cwd,stdio:'inherit'})
 if(r.status!==0)process.exit(r.status||1)
}
