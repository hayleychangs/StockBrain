const path=require("path");
module.exports={
    mode:"development",
    entry:"./src/index.js",
    output:{
        filename:"main.js",
        path:path.resolve(__dirname,"dist"),
        publicPath:"/"
    },
    devServer:{
        static:"./dist",
        hot: true, //enable webpack hot module replacement
        open: true,
        historyApiFallback: true
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module:{
        rules:[
            {
                test:/\.css$/i,
                use:[
                    "style-loader",
                    {
                        loader:"css-loader",
                        options:{
                            importLoaders: 1,
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                            }
                        },
                    },
                ],
                include: /\.module\.css$/,
            },
            {
                test:/\.css$/i,
                use:["style-loader", "css-loader"],
                exclude: /\.module\.css$/,
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },

        ]
    }
};