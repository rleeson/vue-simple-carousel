const common = require('./webpack.common.js');
const merge = require('webpack-merge');
const paths = require('./webpack.paths');
const webpack = require('webpack');

let server;
try {
    /**
     * Expects an export of properties host and port
     */
	server = require('./webpack.development.server.js');
}
catch ( e ) {
	server = {
		host: 'https://localhost:6060/assets/dist/',
		port: 6060
	};
}

let user;
try {
    /**
     * Free form, expects a set of properties compatible with Webpack configuration
     */
	user = require('./webpack.development.user.js');
}
catch ( e ) {
	user = {};
}

module.exports = merge.smart(
	common,
	{
		output: {
			publicPath: server.host
		},
		mode: 'development',
		devtool: 'inline-source-map',
		devServer: {
			allowedHosts: [
				'.localhost',
				'localhost',
				'.test',
				'127.0.0.1'
			],
			contentBase: paths.distribution,
			headers: {
				'Access-Control-Allow-Origin': '*'
			},
			hotOnly: true,
			https: true,
			historyApiFallback: true,
			inline: true,
			port: server.port,
			publicPath: server.host,
			stats: {
                assets: true,
                chunks: false,
                chunkGroups: false,
                chunkModules: false,
                chunkOrigins: false,
                colors: true,
                entrypoints: true,
                env: true,
                errors: true,
                errorDetails: true,
                maxModules: 5,
                modules: false,
                optimizationBailout: true,
                providedExports: false,
                publicPath: true,
                timings: true,
                usedExports: false,
                version: true,
                warnings: true
			}
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
		]
	},
	user
);
