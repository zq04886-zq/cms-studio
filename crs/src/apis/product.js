import nodeFetch from '../utils/nodeFetch.js'
export const findSkuInfoByIds = data => nodeFetch.post('/products/by-ids',data).then(r=>r.data)
