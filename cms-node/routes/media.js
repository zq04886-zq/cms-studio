const router=require('express').Router(),fs=require('fs/promises'),path=require('path')
const {randomUUID}=require('crypto'),formidable=require('formidable'),{Op}=require('sequelize')
const model=require('../models'),config=require('../config')
const ok=(res,data)=>res.json({code:10000,message:'success',data})
const route=fn=>(req,res,next)=>Promise.resolve(fn(req,res)).catch(next)
router.post('/logout',route(async(req,res)=>{await req.session.destroy();ok(res,{})}))
router.get('/pictures/groups',route(async(req,res)=>ok(res,[{uuid:'all',name:'全部图片',count:await model.picture.count()}])))
router.get('/pictures',route(async(req,res)=>{
 const limit=10,offset=(Math.max(1,Number(req.query.pageNum)||1)-1)*limit
 const r=await model.picture.findAndCountAll({limit,offset,order:[['id','DESC']]})
 ok(res,{list:r.rows.map(p=>({uuid:p.id,pictureName:p.name,pictureUrl:p.url})),total:r.count})
}))
router.post('/file/upload',route(async(req,res)=>{
 await fs.mkdir(config.uploadDir,{recursive:true})
 const form=formidable({uploadDir:config.uploadDir,maxFileSize:2*1024*1024,maxFiles:1,multiples:false,allowEmptyFiles:false})
 const temp=[];form.on('fileBegin',(_,file)=>temp.push(file.filepath))
 let saved
 try{
  const files=await new Promise((resolve,reject)=>form.parse(req,(err,fields,files)=>err?reject(err):resolve(files)))
  const file=files.file
  if(!file||Array.isArray(file))throw Object.assign(new Error('请选择一张图片'),{status:400})
  const bytes=await fs.readFile(file.filepath)
  const png=bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),jpg=bytes[0]===255&&bytes[1]===216&&bytes[2]===255
  if(!png&&!jpg)throw Object.assign(new Error('只支持 PNG/JPEG 图片'),{status:400})
  const filename=randomUUID()+(png?'.png':'.jpg');saved=path.join(config.uploadDir,filename)
  await fs.rename(file.filepath,saved)
  const url='/uploads/'+filename
  await model.picture.create({name:String(file.originalFilename||'图片').slice(0,255),url,created_at:new Date()})
  saved=null;ok(res,url)
 }finally{
  await Promise.all(temp.map(p=>fs.unlink(p).catch(()=>{})))
  if(saved)await fs.unlink(saved).catch(()=>{})
 }
}))
router.get('/products',route(async(req,res)=>{
 const page=Math.max(1,Number(req.query.pageNum)||1),limit=10
 const where=req.query.name?{jvName:{[Op.like]:`%${req.query.name}%`}}:{}
 const r=await model.product.findAndCountAll({where,offset:(page-1)*limit,limit,order:[['id','DESC']]})
 ok(res,{list:r.rows,total:r.count})
}))
router.post('/products/by-ids',route(async(req,res)=>{
 const ids=req.body.skuIdList
 if(!Array.isArray(ids)||ids.length>100)throw Object.assign(new Error('商品列表无效'),{status:400})
 const list=await model.product.findAll({where:{id:{[Op.in]:ids}}})
 ok(res,ids.map(id=>list.find(p=>p.id===Number(id))).filter(Boolean).map(p=>({...p.toJSON(),jvId:p.id,jvBrand:p.jvName,jvCategoryNames:p.brand})))
}))
module.exports=router
