const { randomBytes, scryptSync, timingSafeEqual } = require('crypto')
exports.hash = password => {
 const salt = randomBytes(16).toString('hex')
 return `scrypt:${salt}:${scryptSync(password, salt, 32).toString('hex')}`
}
exports.verify = (password, stored) => {
 if (typeof password !== 'string' || password.length > 256) return false
 const [kind, salt, value] = String(stored).split(':')
 if (kind !== 'scrypt' || !salt || !/^[a-f0-9]{64}$/.test(value || '')) return false
 return timingSafeEqual(scryptSync(password, salt, 32), Buffer.from(value, 'hex'))
}
