import nodeFetch from '../utils/nodeFetch.js'
async function previewToken() {
  if(window.parent===window)return localStorage.getItem('token')||''
  const origin=import.meta.env.PROD?window.location.origin:'http://127.0.0.1:3011'
  return new Promise((resolve,reject)=>{
    const done=event=>{
      if(event.source===window.parent && event.origin===origin && event.data && event.data.type==='cms-preview-token'){
        clearTimeout(timer);window.removeEventListener('message',done);resolve(event.data.token)
      }
    }
    const timer=setTimeout(()=>{window.removeEventListener('message',done);reject(new Error('请从管理端打开草稿预览'))},5000)
    window.addEventListener('message',done)
    window.parent.postMessage({type:'cms-preview-auth'},origin)
  })
}
export async function getH5PageJson(params) {
  const token=params.draft?await previewToken():''
  const res=await nodeFetch.get(params.draft?'/getPageJson':'/getH5PageJson',{params:{id:params.id},headers:token?{'X-token':token}:{}})
  return res.data
}
