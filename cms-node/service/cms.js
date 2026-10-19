const BaseService = require('./base')
const model = require('../models')
const { Op } = require('sequelize')
const { randomBytes, createHash } = require('crypto')
const passwords = require('../utils/password')
const sanitizeHtml = require('sanitize-html')
function clean(value, key) {
 if(typeof value === 'string' && key !== 'content') return /^\s*(javascript|vbscript|data):/i.test(value) ? '' : value
 if(typeof value === 'string') return sanitizeHtml(value, {allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']), allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes, '*':['class','style'],img:['src','alt','width','height']},allowedSchemes:['http','https'],allowedStyles:{'*':{'color':[/^#[0-9a-f]+$/i,/^rgb\([\d,\s]+\)$/], 'text-align':[/^(left|right|center|justify)$/], 'font-size':[/^\d+(px|em|%)$/]}}})
 if(Array.isArray(value)) return value.map(v=>clean(v,key))
 if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,clean(v,k)]))
 return value
}
function validate(data) {
 if(!data || typeof data.name!=='string' || !data.name.trim() || data.name.length>128) throw Object.assign(new Error('页面名称需为 1–128 字'),{status:400})
 if(!Array.isArray(data.componentList) || data.componentList.length>500) throw Object.assign(new Error('组件列表无效'),{status:400})
 for(const c of data.componentList) if(!c || typeof c.name!=='string' || c.name.length>20 || !c.data || typeof c.data!=='object') throw Object.assign(new Error('组件数据无效'),{status:400})
}
class CMSService extends BaseService {
 static async save(data, update) {
  validate(data)
  const {name,cover='',shareDesc='',shareImage='',componentList,creator='',id,params,...rest}=clean(data)
  const result = await model.sequelize.transaction(async transaction=>{
   let page
   const values={name,cover,share_desc:shareDesc,share_image:shareImage,page_string:JSON.stringify(rest),update_time:new Date()}
   if(update){
    page=await model.page.findByPk(id,{transaction,lock:transaction.LOCK.UPDATE})
    if(!page) throw Object.assign(new Error('页面不存在'),{status:404})
    await page.update(values,{transaction})
    await model.components.destroy({where:{page_id:id},transaction})
   }else page=await model.page.create({...values,application_id:1,page_type:0,is_abled:0,create_time:new Date(),creator},{transaction})
   await model.components.bulkCreate(componentList.map((c,i)=>({page_id:page.id,name:c.name,sort:i,component_string:JSON.stringify(c.data)})),{transaction})
   return {id:page.id}
  })
  return this.success(result)
 }
 static addPageJson(data){return this.save(data,false)}
 static updateCmsJson(data){return this.save(data,true)}
 static async getPageData({id,type}) {
  const page=await model.page.findByPk(id,{include:[model.components],order:[[model.components,'sort','ASC']]})
  if(!page || (type==='h5' && !page.is_abled)) throw Object.assign(new Error('页面未发布或不存在'),{status:404})
  const componentList=page.components.filter(c=>{
   if(type==='cms')return true
   const t=c.component_string.validTime
   return !Array.isArray(t)||t.length!==2||(Date.now()>=new Date(t[0]).getTime()&&Date.now()<=new Date(t[1]).getTime())
  }).map(c=>({id:c.id,name:c.name,sort:c.sort,data:c.component_string}))
  return {...page.page_string,id:page.id,name:page.name,cover:page.cover,shareDesc:page.share_desc,shareImage:page.share_image,componentList}
 }
 static async getPageList(data){
  const pageNum=Math.max(1,Number(data.pageNum)||1),pageSize=Math.max(1,Math.min(100,Number(data.pageSize)||10)),where={}
  if(data.name)where.name={[Op.like]:`%${data.name}%`}
  if(data.id)where.id=data.id
  if(data.creator)where.creator=data.creator
  if(data.is_abled!==undefined && data.is_abled!=='')where.is_abled=Number(data.is_abled)
  if(data.startDate||data.endDate){where.create_time={};if(data.startDate)where.create_time[Op.gte]=data.startDate;if(data.endDate)where.create_time[Op.lte]=data.endDate}
  const result=await model.page.findAndCountAll({where,offset:(pageNum-1)*pageSize,limit:pageSize,order:[['update_time','DESC'],['id','DESC']]})
  return {list:result.rows,total:result.count,pageNum,pageSize}
 }
 static async deletePage(id){
  await model.sequelize.transaction(async transaction=>{await model.components.destroy({where:{page_id:id},transaction});await model.page.destroy({where:{id},transaction})});return {}
 }
 static async updatePageStatus(id,is_abled){
  if(![0,1].includes(is_abled))throw Object.assign(new Error('无效的发布状态'),{status:400})
  const page=await model.page.findByPk(id);if(!page)throw Object.assign(new Error('页面不存在'),{status:404})
  await page.update({is_abled,update_time:new Date()});return {}
 }
 static getPageAll(){return model.page.findAll({where:{is_abled:1},attributes:['id','name']})}
 static async login({username,password}){
  const user=await model.user.findOne({where:{user_name:username}})
  if(!user||!passwords.verify(password,user.password))return null
  const token=randomBytes(32).toString('hex')
  await model.session.destroy({where:{expires_at:{[Op.lt]:new Date()}}})
  await model.session.create({token_hash:createHash('sha256').update(token).digest('hex'),user_id:user.id,expires_at:new Date(Date.now()+8*60*60*1000)})
  return {token,username:user.user_name}
 }
}
module.exports=CMSService
