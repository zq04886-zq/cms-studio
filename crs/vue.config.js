module.exports = {
    publicPath: '/crs/',
    lintOnSave: false,
    devServer: {
        host: '127.0.0.1',
        port: 3010,
        open: false,
        // proxy: {
        //   '^/api': {
        //     target: 'https://erp-newdev.fuchuang.com',
        //     headers: {
        //       host: 'erp-newdev.fuchuang.com'
        //     }
        //   }
        // }
    },
}
