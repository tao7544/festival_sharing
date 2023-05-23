
const pageConfig = require('./page.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

exports.pushHtmlWebpackPlugins = (webpackConfig, options = {}) => {
	const { 
		pages,
		outputPath = '/dist/'
	} = pageConfig;

	if (pages && Array.isArray(pages)) {
		pages.map(page => {
			webpackConfig.entry[page.name] = `./src/pages/${page.jsEntry}`;
			options.chunks = ['commons', `vendors_${page.name}`, page.name];

			let template = path.join(__dirname, `/src/pages/${page.html}`);
			webpackConfig.plugins.push(
				new HtmlWebpackPlugin({
					filename: path.join(__dirname, `${outputPath}/${page.name}.html`),
					template,
					// favicon:'./src/images/logo.png',
					inject: true,
					chunks: [page.name],
					inlineSource: '.(js|css)$',
					chunksSortMode: 'dependency',
					hash: true,
					...options
				})
			)
		})
	}
	return webpackConfig
}
