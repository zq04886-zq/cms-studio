# CMS Studio

课程 CMS 的 X/Grok 风格迁移版。保留 Vue 2 管理端、Vue 2 移动端渲染器，以及 Express 4 + Sequelize 5 + MySQL 后端。

业务源码以课程解压文件为基准；唯一运行时代码差别是管理端 App.vue 加载独立 CSS。没有新增或替换业务逻辑。

- 管理端：`cms-manage`，开发端口 3011，路径 `/cms-manage/`
- 移动端：`crs`，开发端口 3010，路径 `/crs/`
- 后端：`cms-node`，启动时设置 `PORT=3300`，接口前缀 `/atlas-cms`
- 源码一致性校验：在根目录运行 `node scripts/verify-source.cjs`
- 详细说明：[源码分析](./源码分析.md)

## 安装与运行

分别进入三个子项目执行 `npm install --legacy-peer-deps`。旧版 Vue CLI / Webpack 4 在新版 Node 上构建需要 `NODE_OPTIONS=--openssl-legacy-provider`。两个前端执行 `npm run build` 或查看各自 package.json 中的开发命令。

后端保持原配置读取方式，并不读取 .env。将 `deployment-examples` 的配置样例复制到对应的 `cms-node/config/config.env.dev.js`、`config.env.prod.js`、`cms-node/utils/ftp.js`，填写自己的服务配置。SQL 样例只含结构，不包含课程账号和数据。初始化自己的 MySQL 后，PowerShell 中设置 `$env:PORT='3300'`，运行 `node index.js`。原项目使用 `NODE_ENV=prod` 选择生产配置。

## 发布边界

GitHub 仓库发布不等于完整业务公网部署。当前保持原源码中的 localhost 地址、预览参数拼接及三个缺失的 API 导出。需要部署 MySQL、FTP 及后端服务，确认真实访问地址，并另行确定必要的配置/逻辑修复范围，才能进行完整业务验收。不要把构建通过当作登录、上传、保存和发布流程已经通过。

原项目真实配置、FTP 凭据、SQL 数据、依赖目录及构建产物均不提交。样例只用于部署准备，不参与运行。
