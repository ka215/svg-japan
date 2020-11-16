const path = require('path')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const autoprefixer = require('autoprefixer')

const srcDir = './src'
const entryObj = {
    'svg-japan' : [ path.resolve(__dirname, srcDir, 'index.js') ],
    //'svg-japan': [ path.resolve(__dirname, srcDir, 'index.scss') ]
}

const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'inline-source-map' : false,
    entry: entryObj,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: isDevelopment ? "[name].js" : "[name].min.js"
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /(node_modules|assets)/,
                loader: 'eslint-loader',
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|assets)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                exclude: /(node_modules|assets)/,
                use: [
                    // During development, CSS is bundled with JS, and it is divided and output for production.
                    // isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                    // Always split output of JS and CSS
                    // MiniCssExtractPlugin.loader,
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // During development, CSS is bundled with JS, and it is divided and output for production.
                            // url: isDevelopment ? true : false,
                            url: false,
                            sourceMap: isDevelopment ? true : false,
                            // 2 => postcss-loader, sass-loader
                            //importLoaders: 2
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: isDevelopment ? true : false,
                            postcssOptions: {
                                plugins: () => [ autoprefixer({ grid: true }) ]
                            }
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: isDevelopment ? true : false
                        }
                    }
                ]
            }
        ]
    },/*
    plugins: [
        new MiniCssExtractPlugin({
            filename: './[name].css',
            chunkFilename: '[id].css'
        })
    ],*/
    watch: isDevelopment ? true : false,
    watchOptions: {
        ignored: [ 'assets', 'node_modules' ]
    }
};