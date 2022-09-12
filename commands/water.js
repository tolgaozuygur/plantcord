const { MessageEmbed, Interaction } = require("discord.js");
const config = require('../config.json');
const { User } = require("../utils/schemas")
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
	"title": localization.commands.water.title.replace("<plant_name>", config.plant_name),
	"name": localization.commands.water.name,
	"desc": localization.commands.water.desc.replace("<plant_name>", config.plant_name),
	"color": localization.commands.water.color,
	"field0": localization.commands.water.field0,
	"field1": localization.commands.water.field1,
	"moisture_low": localization.commands.water.moisture_low,
	"moisture_high": localization.commands.water.moisture_high,
	"recommended_moisture": localization.commands.water.recommended_moisture
}

module.exports.execute = (client, message) => {
	client.water_counter++;
	client.helpers.arduinoBridge.waterThePlant(config.water_command_pump_time);

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

	if (client.helpers.arduinoBridge.getMoisture() < config.moisture_min) {
		embed.addField(this.info.field0 + ": %" + client.helpers.arduinoBridge.getMoisture(), this.info.moisture_low + " " + config.emoji_sad + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
	} else if (client.helpers.arduinoBridge.getMoisture() > config.moisture_max) {
		embed.addField(this.info.field0 + ": %" + client.helpers.arduinoBridge.getMoisture(), this.info.moisture_high + " " + config.emoji_sad + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
	} else {
		const amount = Math.floor(Math.random() * (100 - 10 + 1)) + 10
		userData.wallet += amount
		userData.save()
		embed.addField(this.info.field1 + `${amount} 💵`)
		embed.addField(this.info.field0 + ": %" + client.helpers.arduinoBridge.getMoisture(), config.emoji_happy)
	}

	message.channel.send({ embeds: [embed] });
}
