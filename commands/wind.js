const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const { User } = require("../utils/schemas")
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
	"title": localization.commands.wind.title.replace("<plant_name>", config.plant_name),
	"name": localization.commands.wind.name,
	"desc": localization.commands.wind.desc.replace("<plant_name>", config.plant_name).replace("<fan_speed>", config.wind_command_increase_percentage),
	"color": localization.commands.wind.color,
	"field": localization.commands.wind.field.replace("<fan_speed>", config.wind_command_increase_percentage),
	"moisture_low": localization.commands.wind.moisture_low,
	"moisture_high": localization.commands.wind.moisture_high,
	"recommended_moisture": localization.commands.wind.recommended_moisture,
	"fan_already_on": localization.commands.wind.fan_already_on,
	"fan_already_on_field": localization.commands.wind.fan_already_on_field,
	"fan_speed": localization.commands.wind.fan_speed
}

module.exports.execute = (client, message) => {
	client.wind_counter++;

	user = message.author;
    const userData = User.findOne({ id: user.id } || new User({ id: user.id })); 

	const embed = new MessageEmbed()
		.setTitle(this.info.title)
		.setColor(this.info.color)
		.setFooter({
			text: message.member.displayName,
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
		})
		.setTimestamp();

	if (client.fan_speed < 100) {
		client.fan_speed += config.wind_command_increase_percentage;
		if (client.helpers.arduinoBridge.getMoisture() < config.moisture_min) {
			embed.addField(this.info.field + " " + this.info.fan_speed + ": %" + client.fan_speed, this.info.moisture_low + " " + config.emoji_sad + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
		} else if (client.helpers.arduinoBridge.getMoisture() > config.moisture_max) {
			const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10
			userData.wallet += amount
			userData.save()
			embed.addField(this.info.field + " " + this.info.fan_speed + ": %" + client.fan_speed, this.info.moisture_high + " " + config.emoji_happy + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
		} else {
			const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10
			userData.wallet += amount
			userData.save()
			embed.addField(this.info.field1 + `${amount} 💵`)
			embed.addField(this.info.field + " " + this.info.fan_speed + ": %" + client.fan_speed, config.emoji_happy)
		}
	} else {
		embed.addField(this.info.fan_already_on + " " + this.info.fan_speed + ": %" + client.fan_speed, this.info.fan_already_on_field)
	}

	message.channel.send({ embeds: [embed] });
}
