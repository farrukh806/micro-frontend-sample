const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: ".",
                    globOptions: {
                        ignore: ["**/index.html"], // Don't copy index.html (HtmlWebpackPlugin handles it)
                    },
                    filter: (resourcePath) => {
                        // Only copy _redirects and _headers files
                        const filename = path.basename(resourcePath);
                        return filename === "_redirects" || filename === "_headers";
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
}