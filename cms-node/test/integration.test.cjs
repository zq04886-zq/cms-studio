const {test,before,after}=require('node:test'),assert=require('node:assert/strict');
process.env.DB_NAME='cms_studio_test';
const model=require('../models'),app=require('../app'),passwords=require('../utils/password');
let server,url,token,pageId;
async function req(endpoint,body,auth=token){const r=await fetch(url+'/atlas-cms'+endpoint,{method:body===undefined?'GET':'POST',headers:{...(body===undefined?{}:{'Content-Type':'application/json'}),...(auth?{'X-token':auth}:{})},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,...await r.json()}}
const content={name:'集成测试页面',cover:'',shareDesc:'分享说明',shareImage:'',backgroundColor:'#ffffff',backgroundPosition:'top',componentList:[{name:'文本',data:{component:'RichText',content:'<p>测试正文</p><script>alert(1)</script>',validTime:[]}}]};
before(async()=>{
 assert.equal(model.sequelize.config.database,'cms_studio_test');
 await model.sequelize.sync({force:true});
 await model.application.create({id:1,name:'test'});
 await model.user.create({user_name:'testadmin',password:passwords.hash('Test-password-12345')});
 server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));url='http://127.0.0.1:'+server.address().port;
});
after(async()=>{if(server)await new Promise(r=>server.close(r));await model.sequelize.close()});
test('anonymous access rejected; login returns independent expiring session',async()=>{
 assert.equal((await req('/getPageList?pageNum=1&pageSize=10',undefined,'')).status,401);
 assert.notEqual((await req('/login',{username:'testadmin',password:'incorrect'},'')).code,10000);
 const result=await req('/login',{username:'testadmin',password:'Test-password-12345'},'');assert.equal(result.code,10000);token=result.data.token;assert.match(token,/^[a-f0-9]{64}$/);assert.equal(await model.session.count(),1);
});
test('save draft persists all data, filters HTML and is private',async()=>{
 const result=await req('/addPageJson',content);assert.equal(result.code,10000,JSON.stringify(result));pageId=result.data.id;
 const saved=await req('/getPageJson?id='+pageId);assert.equal(saved.data.componentList.length,1);assert.equal(saved.data.componentList[0].data.content,'<p>测试正文</p>');
 assert.equal((await req('/getH5PageJson?id='+pageId,undefined,'')).status,404);
});
test('editing returns id and replaces components without duplicating pages',async()=>{
 const result=await req('/updateCmsJson',{...content,id:pageId,name:'修改后'});assert.equal(result.code,10000);assert.equal(result.data.id,pageId);assert.equal(await model.page.count(),1);assert.equal(await model.components.count(),1);
});
test('failure inserting components rolls back page update and component deletion',async()=>{
 const original=model.components.bulkCreate;model.components.bulkCreate=async()=>{throw new Error('test transaction rollback')};
 try{assert.equal((await req('/updateCmsJson',{...content,id:pageId,name:'不能被保存'})).status,500)}finally{model.components.bulkCreate=original}
 const saved=await req('/getPageJson?id='+pageId);assert.equal(saved.data.name,'修改后');assert.equal(saved.data.componentList.length,1);
});
test('status filtering includes drafts and publishing controls public access',async()=>{
 assert.equal((await req('/getPageList?pageNum=1&pageSize=10&isAbled=0')).data.total,1);
 assert.equal((await req('/updatePageStatus',{id:pageId,isAbled:1})).code,10000);
 assert.equal((await req('/getH5PageJson?id='+pageId,undefined,'')).data.name,'修改后');
 assert.equal((await req('/getPageList?pageNum=1&pageSize=10&isAbled=0')).data.total,0);
});
test('component display window is enforced for published page',async()=>{
 await req('/updateCmsJson',{...content,id:pageId,componentList:[{name:'文本',data:{component:'RichText',content:'future',validTime:['2099-01-01','2099-02-01']}}]});
 assert.equal((await req('/getH5PageJson?id='+pageId,undefined,'')).data.componentList.length,0);
 assert.equal((await req('/getPageJson?id='+pageId)).data.componentList.length,1);
});
test('real PNG upload is persisted and available in picture library',async()=>{
 const bytes=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jc1sAAAAASUVORK5CYII=','base64');
 const form=new FormData();form.append('file',new Blob([bytes],{type:'image/png'}),'test.png');
 const result=await (await fetch(url+'/atlas-cms/file/upload',{method:'POST',headers:{'X-token':token},body:form})).json();assert.equal(result.code,10000);assert.match(result.data,/^\/uploads\/[\w-]+\.png$/);
 assert.deepEqual(Buffer.from(await (await fetch(url+result.data)).arrayBuffer()),bytes);
 assert.equal((await req('/pictures/groups')).data[0].count,1);assert.equal((await req('/pictures?pageNum=1')).data.list[0].pictureUrl,result.data);
 const fs=require('fs/promises'),path=require('path');await fs.unlink(path.join(require('../config').uploadDir,path.basename(result.data)));
});
test('disguised upload rejected; unauthenticated upload rejected',async()=>{
 const form=new FormData();form.append('file',new Blob(['<script>bad</script>'],{type:'image/png'}),'fake.png');
 assert.equal((await fetch(url+'/atlas-cms/file/upload',{method:'POST',headers:{'X-token':token},body:form})).status,400);
 assert.equal((await fetch(url+'/atlas-cms/file/upload',{method:'POST',body:form})).status,401);
});
test('product search and public product hydration use persistent records',async()=>{
 const p=await model.product.create({jvCode:'TEST-001',jvName:'测试商品',brand:'Studio',listPrice:19.9,imgUrl:''});
 const list=await req('/products?name='+encodeURIComponent('测试'));assert.equal(list.data.total,1);
 const result=await req('/products/by-ids',{skuIdList:[p.id]},'');assert.equal(result.data[0].jvBrand,'测试商品');assert.equal(Number(result.data[0].listPrice),19.9);
});
test('taking offline removes public access and delete removes children',async()=>{
 await req('/updatePageStatus',{id:pageId,isAbled:0});assert.equal((await req('/getH5PageJson?id='+pageId,undefined,'')).status,404);
 assert.equal((await req('/deletePage',{id:pageId})).code,10000);assert.equal(await model.components.count(),0);assert.equal(await model.page.count(),0);
});
test('logout revokes session server-side',async()=>{assert.equal((await req('/logout',{})).code,10000);assert.equal((await req('/getPageList?pageNum=1&pageSize=10')).status,401)});
