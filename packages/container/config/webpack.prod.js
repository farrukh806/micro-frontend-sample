const { merge } = require("webpack-merge");
const common = require("./webpack.common");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const packageJson = require("../package.json");


const domain = process.env.PRODUCTION_DOMAIN;

if (!domain) {
    throw new Error('PRODUCTION_DOMAIN environment variable is required for production builds');
}

// Normalize domain: ensure it starts with http:// or https:// and doesn't have trailing slash
let normalizedDomain = domain.trim();
if (!normalizedDomain.startsWith('http://') && !normalizedDomain.startsWith('https://')) {
    // Assume HTTPS if no protocol is provided
    normalizedDomain = `https://${normalizedDomain}`;
}
normalizedDomain = normalizedDomain.replace(/\/+$/, ''); // Remove trailing slashes

// Construct the remote URL (remoteEntry.js is at the root of marketing dist)
const marketingRemoteUrl = `${normalizedDomain}/remoteEntry.js`;

const prodConfig = {
    mode: "production",
    output: {
        filename: "[name].[contenthash].js",
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "container",
            remotes: {
                marketing: `marketing@${marketingRemoteUrl}`,
            },
            shared: packageJson.dependencies,
        }),
    ],
}

module.exports = merge(common, prodConfig);