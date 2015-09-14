var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
        'basic': [
            'webpack-dev-server/client?http://localhost:8881/',
            'webpack/hot/only-dev-server',
            './example/basic.jsx'
        ]
    },
    output: {
        path: __dirname,
        filename: "[name].js",
        publicPath: 'http://localhost:8881/',
        chunkFilename: '[id].chunk.js',
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.es6'],
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [
            { test: /\.jsx$|\.js$/, loaders: ['react-hot', 'babel-loader?stage=1'], exclude: /node_modules/ },
            { test: /\.scss$|\.css$/, loader: 'style-loader!style!css!sass' },
            { test: /\.(jpe?g|png|gif)$/i, loader: 'url?limit=10000!img?progressive=true' }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.NormalModuleReplacementPlugin(/^(net|dns)$/, path.resolve(__dirname, '../tests/setup/shim.js')),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('test')
        })
    ],
    devtool: "eval-source-map"
};
