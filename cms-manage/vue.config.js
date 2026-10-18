const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  publicPath: '/cms-manage/',
  outputDir: 'dist',
  assetsDir: 'assets',
  lintOnSave: false,
  devServer: {
    host: '127.0.0.1',
    port: 3011,
    open: true,
    openPage: 'cms-manage/',
    proxy: {
      '/api/atlas-cms': {
        target: 'http://127.0.0.1:3300',
        pathRewrite: {
          '^/api/atlas-cms': '/atlas-cms'
        }
      }
      // '/api': {
      //   target: 'https://erp-newdev.fuchuang.com',
      //   headers: {
      //     host: 'erp-newdev.fuchuang.com'
      //   }
      // }
    }
  },
  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach((type) =>
      addStyleResource(config.module.rule('less').oneOf(type))
    )
    // 设置别名
    config.resolve.alias.set('@', path.resolve(__dirname, './src'))
  }
}
function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [path.resolve(__dirname, './src/styles/mixin.less')]
    })
}
