var path = require('path');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
module.exports = {
    entry:'./src/js/app.js',
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'bundle.js',
        sourceMapFilename:'bundle.map.js' 
    },
    optimization: {
        minimize:true,
        minimizer: [
            new UglifyJsPlugin({
                test:/\.js$/,
                sourceMap:true 
                //minify all the js
            }),
          new OptimizeCSSAssetsPlugin({
            
          })
        ],
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //           test: /[\\/]node_modules[\\/]/,
        //           name: "vendor",
        //           chunks: "initial",
        //         },
        //   },
      },
    devtool:"source-map",
    // to generate  the sourcemap of the the bundle
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets:['env']
                        }
                    }
                ]
            },
            {
               
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader","postcss-loader"]
            },
            
            {
                test:/\.html$/,
                use:[
                    'html-loader'
                ]
            },
            {
                test:/\.(jpg|png|jpeg)$/,
                use:[{
                    loader:'file-loader',
                    options:{
                        name:'[name].[ext]',
                        outputPath:'img/',
                        publicPath:'img/'
                    }
                }]
            },
            {
                test:/\.html$/,
                use:[{
                    loader:'file-loader',
                    options:{
                        name:'[name].[ext]'
                    }
                }],
                exclude:path.resolve(__dirname,'src/index.html')
            }
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
          }),
          new UglifyJsPlugin({
              sourceMap:true
          }),
          new OptimizeCSSAssetsPlugin({}),
          new HtmlPlugin({
                template:'src/index.html'
          }),
          new CleanWebpackPlugin(['dist']),
        //   new webpack.SourceMapDevToolPlugin({
        //     // filename: '[name].map.js'
        //   })

    ]

}