const { createHash } = require('crypto')
const model = require('../models')
const publicPaths = new Set(['/login', '/getH5PageJson', '/products/by-ids'])
module.exports = () => async (req, res, next) => {
 if(publicPaths.has(req.path)) return next()
 try {
  const token = req.get('X-token') || ''
  if (!/^[a-f0-9]{64}$/.test(token)) return res.status(401).json({code:-2,message:'请登录后继续'})
  const session = await model.session.findByPk(createHash('sha256').update(token).digest('hex'))
  if(!session || new Date(session.expires_at) <= new Date()) return res.status(401).json({code:-2,message:'登录已过期'})
  req.user = await model.user.findByPk(session.user_id)
  if(!req.user) return res.status(401).json({code:-2,message:'账号不存在'})
  req.session = session
  next()
 } catch(e) { next(e) }
}
