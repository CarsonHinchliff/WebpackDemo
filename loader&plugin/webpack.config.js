const path = require("path");
const CopyrightWebpackPlugin = require("./plugins/copyright-webpack.plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins: [
        new CopyrightWebpackPlugin()
    ],
    module: {
        rules: [//orders: from right to left, from down to up
            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, "./loaders/replaceLoader.js"),
                    {
                        loader: path.resolve(__dirname, "./loaders/replaceLoaderAsync.js"),
                        options: {// parameters to loader function
                            name: "kaikeba"
                        }
                    }
                ]
            }
        ]
    }
}