const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
	"title": localization.commands.help.title,
	"name": localization.commands.help.name,
	"color": localization.commands.help.color,
}

module.exports.execute = async (client, message) => {
	// We are not creating an embed every time help is called.
	if (client.helpEmbed)
		return message.channel.send({ embeds: [client.helpEmbed] });

	const embed = new MessageEmbed()
		.setTitle(this.info.title)
		.setColor(this.info.color)

	// TODO: Can be moved to the config file.
	const notListedCommands = ['ping', 'uptime'];

	const sortedCommands = client.commands.sort((a, b) => {
		const aOrder = a.info.order || 0;
		const bOrder = b.info.order || 0;
		return aOrder - bOrder;
	})

	await sortedCommands.forEach(command => {
		if (command.info.desc && !notListedCommands.includes(command.info.name))
			embed.addField(`${client.config.prefix}${command.info.name}`, command.info.desc)
	})

	client.helpEmbed = embed;
	message.channel.send({ embeds: [embed] });
}
