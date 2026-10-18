import nodeFetch from '../utils/nodeFetch'

export async function  getH5PageJson(params) {
  const res = await nodeFetch.get(`/getH5PageJson`, {params})
  return res.data
}
