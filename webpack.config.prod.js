/* eslint-disable */
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpackBaseConfig = require('./webpack.config.base');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const utils = require('./utils');
const pageConfig = require('./page.config.js');
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

class ChunksFromEntryPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('ChunksFromEntryPlugin', compilation => {
      compilation.hooks.htmlWebpackPluginAlterChunks.tap(
        'ChunksFromEntryPlugin',
        (_, { plugin }) => {
          // takes entry name passed via HTMLWebpackPlugin's options
          const entry = plugin.options.entry;
          const entrypoint = compilation.entrypoints.get(entry);

          return entrypoint.chunks.map(chunk =>
            ({
              names: chunk.name ? [chunk.name] : [],
              files: chunk.files.slice(),
              size: chunk.modulesSize(),
              hash: pageConfig.isDev ? undefined : chunk.hash
            })
          );
        }
      );
    });
  }
}

let argv = require('yargs').argv;
let buildpath = (argv.buildpath || '').replace("../", "") || undefined;

let prodWebpackConfig = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    //设置每一次build之前先删除dist  
    new CleanWebpackPlugin(
      [buildpath + '/*'],　     //匹配删除的文件  
      {
        root: require('path').resolve(__dirname, "../"),   //根目录  
        verbose: true,    //开启在控制台输出信息  
        dry: false     //启用删除文件  
      }
    ),
    new UglifyJsPlugin({
      sourceMap: !IS_PROD,
      parallel: require('os').cpus().length > 1
    }),

    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      sourceMap: !IS_PROD,
      uglifyJS: {
        output: {
          beautify: true,
          comments: true
        },
        warnings: false,
        compress: {
          drop_debugger: true,
          drop_console: true,
          reduce_vars: true,
          collapse_vars: true
        }
      }
    }),
    new ExtractTextPlugin({
      filename: `/HTML/public/css/[name]${pageConfig.isDev ? '' : '.[hash:7]'}.css`
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '_',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        // default: {
        //     minChunks: 2,
        //     priority: -20,
        //     reuseExistingChunk: true
        // },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
}

prodWebpackConfig = utils.pushHtmlWebpackPlugins(
  merge(webpackBaseConfig, prodWebpackConfig), {
  // html-webpack-plugin options
  minify: {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: true,
    minifyCSS: true, // 压缩内联css
    minifyJS: true,
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  },
})

prodWebpackConfig.plugins.push(new ChunksFromEntryPlugin())

module.exports = prodWebpackConfig
