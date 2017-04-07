var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: "./example/basic.jsx",
    output: {
        path: __dirname,
        filename: "[name].js"
    },
    resolve: {
        extensions: ["", ".js", ".jsx", ".es6"],
        modulesDirectories: ["node_modules"]
    },
    module: {
        loaders: [
            {
                test: /\.jsx$|\.js$/,
                loaders: ["babel-loader?stage=0"],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("test")
        })
    ],
    devtool: "eval-source-map"
};
