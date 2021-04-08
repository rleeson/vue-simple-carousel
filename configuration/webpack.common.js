const path = require("path");
const paths = require("./webpack.paths");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const babel_loader_options = {
	presets: [
		[ "@vue/cli-plugin-babel/preset" ]
	],
	plugins: [
		[
			"@babel/plugin-proposal-decorators",
			{ legacy: true }
		],
		[ "@babel/plugin-proposal-class-properties" ]
	]
};

module.exports = {
	entry: {
        "vue-simple-carousel": [ path.resolve(__dirname, "..", "autoload.js") ],
	},
	output: {
		path: paths.distribution,
		filename: "js/[name].js"
	},
	externals: {
		vue: "vue"
	},
	resolve: {
		extensions: [ ".ts", ".js", ".vue", ".json" ],
		alias: {
			"@": paths.source
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader",
				options: babel_loader_options
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: babel_loader_options
					},
					{
						loader: "ts-loader",
						options: {
							appendTsSuffixTo: [ /\.vue$/ ],
							transpileOnly: true
						}
					}
				]
			},
			{
				test: /\.vue$/,
				loader: "vue-loader"
			},
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: paths.source,
					to: paths.modules,
					toType: "dir"
				}
			]
		})
	]
};
