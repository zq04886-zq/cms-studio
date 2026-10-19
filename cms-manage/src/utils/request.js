import axios from 'axios'
import { baseURL } from '@/config'
import { Message } from 'element-ui'
const service=axios.create({baseURL,timeout:20000})
service.interceptors.request.use(config=>{const token=localStorage.getItem('token');if(token)config.headers['X-token']=token;return config})
function failure(error){
 const data=error.response&&error.response.data
 const message=(data&&data.message)||error.message||'请求失败'
 Message.error(message)
 if(error.response&&error.response.status===401){localStorage.removeItem('token');window.location.hash='#/login'}
 return Promise.reject(new Error(message))
}
service.interceptors.response.use(response=>{
 const res=response.data
 if(res.code!==10000){Message.error(res.message||'请求失败');return Promise.reject(new Error(res.message||'请求失败'))}
 return res
},failure)
export default service
