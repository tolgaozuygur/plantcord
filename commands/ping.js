const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
	"title": localization.commands.ping.title,
	"name": localization.commands.ping.name,
	"desc": localization.commands.ping.desc,
	"color": localization.commands.ping.color,
	"latencyfield": localization.commands.ping.latencyfield,
	"apifield": localization.commands.ping.apifield,
}

module.exports.execute = (client, message) => {
	const apiLatency = Math.round(message.client.ws.ping);
	const embed = new MessageEmbed()
		.setTitle(this.info.title)
		.setColor(this.info.color)
		.addField(this.info.latencyfield, `${Date.now() - message.createdTimestamp}ms`)
		.addField(this.info.apifield, `${apiLatency}ms`)
		.setFooter({
			text: message.member.displayName,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		})
		.setTimestamp();

	message.channel.send({ embeds: [embed] });
}
