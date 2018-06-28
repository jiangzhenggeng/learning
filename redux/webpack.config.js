// 一个常见的`webpack`配置文件
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: __dirname + "/index.js",
	output: {
		path: __dirname + "/",
		filename: "bundle.js"
	},
	devServer: {
		contentBase: "./", //本地服务器所加载的页面所在的目录
		historyApiFallback: true, //不跳转
		inline: true,
		hot: true
	},
	module: {
		rules: [{
			test: /(\.jsx|\.js)$/,
			use: {
				loader: "babel-loader"
			},
			exclude: /node_modules/
		}]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: __dirname + "/index.html"
		})
	]
}




