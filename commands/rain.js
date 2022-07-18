const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
	"title": localization.commands.rain.title.replace("<plant_name>", config.plant_name),
	"name": localization.commands.rain.name,
	"desc": localization.commands.rain.desc.replace("<plant_name>", config.plant_name),
	"color": localization.commands.rain.color,
	"field": localization.commands.rain.field,
	"moisture_low": localization.commands.rain.moisture_low,
	"moisture_high": localization.commands.rain.moisture_high,
	"recommended_moisture": localization.commands.rain.recommended_moisture,
	"order": 500
}

module.exports.execute = (client, message) => {
	if (!config.rain_role.some(role => message.member.roles.cache.has(role))) return message.reply(localization.commands.rain.non_member)
	client.water_counter++;
	client.helpers.arduinoBridge.waterThePlant(config.rain_command_pump_time);
	const embed = new MessageEmbed()
		.setTitle(this.info.title)
		.setColor(this.info.color)
		.setFooter({
			text: message.member.displayName,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		})
		.setTimestamp();

	if (client.helpers.arduinoBridge.getMoisture() < config.moisture_min) {
		embed.addField(this.info.field + ": %" + client.helpers.arduinoBridge.getMoisture(), this.info.moisture_low + " " + config.emoji_sad + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
	} else if (client.helpers.arduinoBridge.getMoisture() > config.moisture_max) {
		embed.addField(this.info.field + ": %" + client.helpers.arduinoBridge.getMoisture(), this.info.moisture_high + " " + config.emoji_sad + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
	} else {
		embed.addField(this.info.field + ": %" + client.helpers.arduinoBridge.getMoisture(), config.emoji_happy)
	}

	message.channel.send({ embeds: [embed] });
}
