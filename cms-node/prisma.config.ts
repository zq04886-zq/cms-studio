import { defineConfig } from 'prisma/config'
import { existsSync } from 'node:fs'
if (existsSync('.env')) process.loadEnvFile('.env')
const url = process.env.DATABASE_URL || `mysql://${encodeURIComponent(process.env.DB_USER || 'cms')}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'cms_studio'}`
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url }
})
