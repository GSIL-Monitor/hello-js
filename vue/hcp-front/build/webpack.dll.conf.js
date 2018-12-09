// TODO 将不变的依赖，如vue，vuex，vue-router单独打包生成dll
const path = require('path')
const webpack = require('webpack')
const rootPath = path.resolve(__dirname, '../')

let isDev = process.env.NODE_ENV === 'development'
let dllFileName = isDev ? '[name]-dev' : "[name]"

const dllConfig = {
  entry: {
    vendor: ['vue', 'vuex', 'qs', 'vue-router', 'jsonp', 'draggabilly', 'js-cookie']
  },
  output: {
    path: path.join(rootPath, 'dll'),
    filename: 'dll_[name]_[hash].js',
    library: "[name]_[hash]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(rootPath, "dll", "[name]-manifest.json"),
      name: "[name]_[hash]"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
}

module.exports = dllConfig
