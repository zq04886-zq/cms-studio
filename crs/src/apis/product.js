import nodeFetch from '../utils/nodeFetch'
export const findSkuInfoByIds = data => nodeFetch.post('/products/by-ids',data).then(r=>r.data)
