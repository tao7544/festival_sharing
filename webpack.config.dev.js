
const webpackBaseConfig = require('./webpack.config.base');
const merge = require('webpack-merge');
const utils = require('./utils');
const pageConfig = require('./page.config.js');

module.exports = utils.pushHtmlWebpackPlugins(
	merge(webpackBaseConfig, {
		mode: 'development',
		// 起本地服务
		devServer: {
			contentBase: './dist/',
			historyApiFallback: true,
			inline: true,
			hot: true,
			open: true,
			overlay: true,
			openPage: 'index.html',
			host: '0.0.0.0',
			before(_, server) {
				server._watch(__dirname + '/src')
			},
			proxy: pageConfig.proxy
		}
	})
);
