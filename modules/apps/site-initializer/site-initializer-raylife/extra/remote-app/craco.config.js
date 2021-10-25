module.exports = {
	babel: {
		plugins: [
			[
				'babel-plugin-root-import',
				{
					paths: [
						{
							rootPathPrefix: '~/',
							rootPathSuffix: './src',
						},
						{
							rootPathPrefix: '~/common',
							rootPathSuffix: './src/common',
						},
						{
							rootPathPrefix: '~/routes',
							rootPathSuffix: './src/routes',
						},
					],
				},
			],
		],
	},
	webpack: {
		configure: (webpackConfig) => {
			/**
			 * This change is necessary to import SCSS as string
			 * to inject into style tag
			 */

			webpackConfig.output.chunkFilename = 'static/js/[name].js';
			webpackConfig.output.filename = 'static/js/[name].js';

			return webpackConfig;
		},
	},
};
