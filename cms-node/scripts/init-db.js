const models=require('../models'),passwords=require('../utils/password')
async function main(){
 const name=process.env.ADMIN_USER,password=process.env.ADMIN_PASSWORD
 if(!name||name.length>20||!password||password.length<12)throw new Error('请设置 ADMIN_USER（最多20字）及至少12位 ADMIN_PASSWORD')
 await models.sequelize.authenticate()
 // Creates missing tables only. Never drops or alters existing data.
 await models.sequelize.sync()
 await models.application.findOrCreate({where:{id:1},defaults:{name:'CMS Studio'}})
 const [user,created]=await models.user.findOrCreate({where:{user_name:name},defaults:{password:passwords.hash(password)}})
 if(!created && process.argv.includes('--reset-password')){await user.update({password:passwords.hash(password)});await models.session.destroy({where:{user_id:user.id}})}
 console.log(created?'数据库就绪，管理员已创建':'数据库就绪，已有账号密码保持不变')
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>models.sequelize.close())
