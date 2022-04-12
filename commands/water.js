const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
  "title": localization.commands.water.title.replace("<plant_name>", config.plant_name),
  "name": localization.commands.water.name,
  "desc": localization.commands.water.desc.replace("<plant_name>", config.plant_name),
  "color": localization.commands.water.color,
  "field": localization.commands.water.field,
  "moisture_low": localization.commands.water.moisture_low,
  "moisture_high": localization.commands.water.moisture_high,
  "recommended_moisture": localization.commands.water.recommended_moisture
}

module.exports.execute = (client, message) => {
  client.water_counter++ ;
  client.helpers.arduinoBridge.waterThePlant();
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
