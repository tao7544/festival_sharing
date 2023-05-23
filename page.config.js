const fs = require('fs');
const pagePath = './src/pages';
const pages = [];
const files = fs.readdirSync(pagePath);

files.forEach(function (item) {
    let stat = fs.lstatSync(`${pagePath}/${item}`);
    if (stat.isDirectory() === true) { 
      pages.push({
        name: item,
        html: `${item}/index.html`,
        jsEntry: `${item}/index.js`
      })
    }
})

let argv = require('yargs').argv;
let url = argv.apiurl || 'http://192.168.10.254:3211'; // http://192.168.10.254:3211 或 3212
var buildpath = argv.buildpath || undefined;

const proxyConfig = {
  target: url,
  changeOrigin : true,
  secure: false
}

module.exports = {
  outputPath: buildpath || './dist',
  isDev: true,
  proxy: {
    '/Case': proxyConfig, 
  },
  pages
};
