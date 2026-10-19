const fs=require('fs'),model=require('../models')
async function main(){
 const list=JSON.parse(fs.readFileSync(process.argv[2],'utf8'))
 if(!Array.isArray(list)||!list.length)throw new Error('JSON 必须是非空商品数组')
 await model.$transaction(async transaction=>{
  for(const p of list){
   if(!p.jvCode||!p.jvName||!Number.isFinite(Number(p.listPrice))||Number(p.listPrice)<0)throw new Error('商品编码、名称和有效价格必填')
   if(p.imgUrl&&!/^(https?:\/\/|\/uploads\/)/.test(p.imgUrl))throw new Error('图片地址需为 HTTP(S) 或上传路径')
   const data={jvCode:p.jvCode,jvName:p.jvName,brand:p.brand||'',imgUrl:p.imgUrl||'',listPrice:p.listPrice}; await transaction.product.upsert({where:{jvCode:p.jvCode},create:data,update:data})
  }
 });console.log(`已导入 ${list.length} 条商品`)
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>model.$disconnect())
