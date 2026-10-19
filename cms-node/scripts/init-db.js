const models=require('../models'),passwords=require('../utils/password')
async function main(){
 const name=process.env.ADMIN_USER,password=process.env.ADMIN_PASSWORD
 if(!name||name.length>20||!password||password.length<12)throw new Error('请设置 ADMIN_USER（最多20字）及至少12位 ADMIN_PASSWORD')
 await models.$queryRaw`SELECT 1`
 await models.application.upsert({where:{id:1},create:{id:1,name:'CMS Studio'},update:{}})
 const existing=await models.user.findUnique({where:{user_name:name}})
 const created=!existing
 const user=existing||await models.user.create({data:{user_name:name,password:passwords.hash(password)}})
 if(!created && process.argv.includes('--reset-password'))await models.$transaction([models.user.update({where:{id:user.id},data:{password:passwords.hash(password)}}),models.session.deleteMany({where:{user_id:user.id}})])
 console.log(created?'数据库就绪，管理员已创建':'数据库就绪，已有账号密码保持不变')
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>models.$disconnect())
