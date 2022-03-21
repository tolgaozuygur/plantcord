const { Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { resolve } = require("path");

const nya = (path) => {
	const commands = new Collection();

	const files = readdirSync(path).filter((file) => file.endsWith(".js"));

	for (let file of files) {
		const command = require(resolve(path, file));
		if (command.disabled) {
			continue;
		}
		commands.set(command.name.toLowerCase(), command);
	}
	return commands;
};

module.exports = { nya: nya };