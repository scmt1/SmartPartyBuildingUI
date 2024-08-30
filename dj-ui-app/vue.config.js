const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
	publicPath: './',
  devServer: {
		port: 8082,
    open: true, // 自动开启项目
		allowedHosts: 'all',
		proxy: {
			'/appApi': {
				target: 'http://10.4.117.31:7097/gateway',
				changeOrigin: true,
				pathRewrite: {
					'^/appApi': ''
				},
			},
			'/fastcmsApi': {
				// target: 'http://127.0.0.1:7380/fastcms',
				target: 'http://10.4.117.31:7380/fastcms',
				changeOrigin: true,
				pathRewrite: {
					'^/fastcmsApi': ''
				},
			},
			'/fastApi': {
				target: 'http://10.4.117.31:7380',
				changeOrigin: true,
				pathRewrite: {
					'^/fastcmsApi': ''
				},
			},
			'/api': {
				//target: 'http://127.0.0.1:8097',
				target: 'https://lz12371.cn/',
				changeOrigin: true,
				pathRewrite: {
					'^/api': ''
				},
			},
			'/cms': {
				//target: 'http://localhost:9379',
				target: 'http://101.206.141.236:7379',
				changeOrigin: true,
				pathRewrite: {
					'^/cms': '/cms'
				},
			}
		}
  },
  // 别名配置
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve("./src"))
      .set('components', resolve("./src/components"))
  },
  transpileDependencies: ['uview-ui', '@dcloudio/uni-ui']
}
