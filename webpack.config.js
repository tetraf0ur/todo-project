const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

module.exports = {
	entry: {
		index: [
			"./src/index.ts",
			"./assets/sass/index.sass"
		],
	},
	stats: { warnings: false },
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
			},
			{
				test: /\.sass$/i,

				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader",
							options: {
								url: false,
								sourceMap: true
							}
						},
						{
							loader: "sass-loader",
							options: {
								sourceMap: true,
								paths: [path.resolve(__dirname, "node_modules")]
							}
						},
					]
				})
			},
			{
				test: /\.(html)$/,
				include: path.join(__dirname, './templates/views'),
				use: {
					loader: 'html-loader',
					options: {
						interpolate: true,
						attrs: false,
					}
				}
			},

		]
	},

	resolve: {
		extensions: [".ts", ".js", ".vue", ".json"],
		alias: {
			vue$: "vue/dist/vue.esm.js"
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin([
			{
				from: "./assets/images",
				to: "images"
			},
			{
				from: "./assets/fonts",
				to: "fonts"
			}

		]),
		new ImageminPlugin({
			sky: /\.(jpe?g|png|gif|svg)$/i,
			disable: process.env.NODE_ENV !== "production",
			pngquant: {
				quality: "95-100"
			},
		}),
		new ExtractTextPlugin("css/[name].css"),

		new HtmlWebpackPlugin({
			filename: `index.html`,
			title: "Home",
			template: path.join(__dirname, './templates/layout.html'),
			inject: false,
			inserts: {
				css: ['css/index.css'],
				js: ['js/index.js'],
				content: ['views/index.html']
			},
		}),

	],
	output: {
		filename: "js/[name].js",
		path: path.resolve(__dirname, "dist/public")
	}
};


