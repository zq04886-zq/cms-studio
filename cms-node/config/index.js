const fs = require('fs'), path = require('path')
const envFile = path.join(__dirname, '../.env')
if (fs.existsSync(envFile)) process.loadEnvFile(envFile)
module.exports = {
  common: require('@bigbighu/altas'),
  db: { database: process.env.DB_NAME || 'cms_studio', username: process.env.DB_USER || 'cms',
    password: process.env.DB_PASSWORD || '', host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306), dialect: 'mysql' },
  uploadDir: path.resolve(__dirname, '..', process.env.UPLOAD_DIR || 'data/uploads')
}
