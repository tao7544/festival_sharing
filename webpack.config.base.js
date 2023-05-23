/* eslint-disable */
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const pageConfig = require('./page.config.js');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

let webpackConfig = {
	// 配置入口
	entry: {},
	// 配置出口
	output: {
		path: path.join(__dirname, pageConfig.outputPath || 'dist/'),
		filename: `public/js/[name]${
				pageConfig.isDev ? '' : '.[hash:7]'
			}.js`,
		publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	},
	// 开启源码映射打包变慢…… 需要的时候再开
	devtool: '',  // IS_PROD ? '' : 'source-map',// 'inline-source-map',
	// 路径配置
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	stats: "errors-only",
	// loader配置
	module: {
		rules: [
			//{
				//test: /\.(js)$/,
				//loader: 'eslint-loader',
				//enforce: 'pre',
				//include: [path.join(__dirname, './src')],
				//options: {
					//formatter: require('eslint-friendly-formatter')
				//}
			//},
			{
				test: /.vue$/,
				loader: 'vue-loader',
				exclude: /node_modules/
			},
			// html中的img标签
			{
				test: /\.html$/,
				loader: 'html-withimg-loader',
				include: [path.join(__dirname, './src')],
				options: {
					limit: 10000,
					name: 'public/img/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [path.join(__dirname, './src')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'public/img/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'public/media/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'public/fonts/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
				],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader',
					'postcss-loader'
				],
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		// copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './resources'),
        to: 'resources',
        ignore: ['.*']
      }
    ])
	]
};

module.exports = webpackConfig;
