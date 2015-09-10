var webpack = require('webpack');
var path = require('path');

module.exports = function(config) {
    config.set({
        basePath: '',
        preprocessors: {
            './tests/**/*.spec.js':  ['webpack', 'sourcemap']
        },
        files: [
            './tests/**/*.spec.js'
        ],
        frameworks: ['mocha', 'chai'],
        reporters: [
            'progress'
        ],
        plugins: [
              'karma-chrome-launcher',
              'karma-firefox-launcher',
              'karma-chai',
              'karma-mocha',
              'karma-sourcemap-loader',
              'karma-webpack',
        ],
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    { test: /\.(jsx|js)$/, exclude: /node_modules/, loader: 'babel-loader?optional=runtime&stage=1' }
                ]
            },
            plugins: [
                new webpack.NormalModuleReplacementPlugin(/^(net|dns)$/, path.resolve(__dirname, './tests/setup/shim.js')),
                new webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('test')
                })
            ],
            resolve: {
                extensions: ['', '.js', '.jsx'], //ts, or anything else
			    root: [path.join(__dirname, "./node_modules"), path.join(__dirname, "./src")]
		    }
        },

        webpackServer: {
            noInfo: true
        },

        browserNoActivityTimeout: 30000,

        browsers: [ 'Firefox', 'Chrome' ],

        singleRun: true,

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
    });
};
