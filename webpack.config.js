const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const url = 'https://bryce.io/svelte-clock';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		extensions: ['.js', '.svelte']
	},
	output: {
		path: __dirname + '/public',
		publicPath: prod ? url : '/',
		filename: prod ? '[name].[hash].js' : '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			},
			{
        test: /\.(png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
			{
        test: /\.txt$/i,
        use: 'raw-loader',
      }
		]
	},
	mode,
	plugins: [
		new MiniCssExtractPlugin({
			filename: prod ? '[name].[hash].css' : '[name].css'
		}),
		new HtmlWebpackPlugin({
			title: 'Svelte Clock',
			description: 'An analog clock in Svelte',
			image: `${url}/clock.png`,
			url,
			template: 'src/index.html',
			favicon: 'src/clock.png'
		})
	],
	devtool: prod ? false: 'source-map'
};
