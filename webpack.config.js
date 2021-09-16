const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { IgnorePlugin } = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        ts_webgl: "./render/render.ts",
    },
    cache: true,
    target: "electron-renderer",
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, './dist'),
        filename: '[name]_[contenthash:8].js',
    },
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            path: false,
        },
    },
    plugins: [
        new IgnorePlugin({
            resourceRegExp: /^fsevents$/,
        }),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
            cleanStaleWebpackAssets: false,
            cleanOnceBeforeBuildPatterns: [
                '**/*',
                '!static-files*',
                '!directoryToExclude/**',
            ],
            cleanAfterEveryBuildPatterns: ['static*.*', '!static1.js'],
            dangerouslyAllowCleanPatternsOutsideProject: true,
        }),
        new HtmlWebpackPlugin({
            title: 'TS WebGL',
            template: 'public/index.html',
            filename: 'index.html',
            minify: {
                removeComments: true,
                collapseWhitespace: true, 
            },
            inject: 'body',
            showErrors: true,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[contenthash:8]_[name].css',
        }),
        new OptimizeCssAssetsWebpackPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader'],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
            },
        ]
    },
    devServer: {
        static: path.join(__dirname, './public/'),
        compress: true,
        host: 'localhost',
        port: process.env.npm_package_config_port,
        open: false,
        historyApiFallback: true,
    },
    externals: {
        fs: require("fs"),
    }
}