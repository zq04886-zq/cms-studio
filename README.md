# CMS Studio

移动端活动页配置系统，采用 X / Grok 启发的黑白灰视觉。仅修改模板与样式，原有 Vue script 块和 JavaScript 逻辑保持不变。

## 目录
- cms-manage：Vue 2 管理端，活动管理、拖拽组件、属性配置与预览入口。
- crs：Vue 2 / Vant H5 渲染端。
- cms-node：原有 Express / Sequelize 服务端。

## 启动与构建
使用 Node 16。管理端执行 `npm ci --legacy-peer-deps`；H5 原锁文件缺少条目，执行 `npm install --legacy-peer-deps --package-lock=false`。
分别执行 `npm start` 启动，执行 `npm run build` 构建。
管理端 http://127.0.0.1:3011/cms-manage/ ，渲染端 http://127.0.0.1:3010/crs/ 。

## 后端部署
管理端代理指向本机 3300。登录、保存、上传、上架依赖后端及数据库，静态前端不能单独提供这些功能。
课程源码带有第三方数据库、FTP 配置与 SQL 数据，这些文件仅留在本地，不提交 GitHub。部署时需提供自行管理的数据库和配置，不能直接使用课程内置第三方服务。
GitHub 发布用于源码交付，不代表已完成公网后端部署。

## 验证记录
- 管理端生产构建通过；存在课程原始代码的三个 API 导出缺失警告：fetchPictureGroup、fetchPictureList、fetchProduct。因此图片库及商品查询不能视为已可用。
- H5 端本地使用 `npm install --no-save --package-lock=false --legacy-peer-deps less@4.1.1 vue@2.6.14` 后构建通过，避免最新 Less 与旧 Webpack 不兼容；原始源码与依赖清单不变。
- 对比原始 169 个 JavaScript / Vue 文件，JavaScript 文件与 Vue script 块均未修改。
- 无头浏览器检查登录、首页和编辑器，登录空值校验通过，无页面 JavaScript 异常。未连接第三方课程后端，未验证真实登录、保存和上传。
