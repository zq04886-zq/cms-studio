import request from '@/utils/request.js'
import { nodeUrl } from '@/config/index.js'
export const upLoadUrl = `${nodeUrl}/file/upload`
export const fetchPictureGroup = () => request.get('/atlas-cms/pictures/groups').then(r => ({returnMessage:r.data}))
export const fetchPictureList = params => request.get('/atlas-cms/pictures',{params:{pageNum:params.queryPage}}).then(r => ({returnMessage:r.data.list,pager:{totalNum:r.data.total}}))
export const fetchProduct = params => request.get('/atlas-cms/products',{params}).then(r=>r.data)
