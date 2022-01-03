const path = require("path");

const config = require("./webpack.production");

config.output.filename = "messenger.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

module.exports = config;