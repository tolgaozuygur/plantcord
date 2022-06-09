const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
	"title": localization.commands.counter.title,
	"name": localization.commands.counter.name,
	"color": localization.commands.counter.color,
	"wind_counter": localization.commands.counter.wind_counter,
	"water_counter": localization.commands.counter.water_counter,
}

module.exports.execute = async (client, message) => {
	const embed = new MessageEmbed()
		.setTitle(this.info.title)
		.setColor(this.info.color)

		.addFields(
			{
				"name": this.info.wind_counter,
				"value": client.wind_counter + ""
			}, {
			"name": this.info.water_counter,
			"value": client.water_counter + ""
		})

	embed.setFooter({
		text: message.member.displayName,
		iconURL: message.author.displayAvatarURL({ dynamic: true }),
	})
		.setTimestamp();

	message.channel.send({ embeds: [embed] });
}
