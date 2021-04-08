const path = require("path");

module.exports = {
	distribution: path.resolve(__dirname, "..", "dist"),
	modules: path.resolve(__dirname, "..", "dist", "modules"),
	source: path.resolve(__dirname, "..", "src")
};