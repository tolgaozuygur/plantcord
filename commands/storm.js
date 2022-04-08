const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);

module.exports.info = {
  "title" : localization.commands.storm.title.replace("<plant_name>", config.plant_name),
  "name" : localization.commands.storm.name,
  "desc" : localization.commands.storm.desc.replace("<plant_name>", config.plant_name),
  "color" : localization.commands.storm.color,
  "field" : localization.commands.storm.field.replace("<fan_duration>", config.storm_fan_duration),
  "moisture_low" : localization.commands.storm.moisture_low,
  "moisture_high" : localization.commands.storm.moisture_high,
  "recommended_moisture" : localization.commands.storm.recommended_moisture,
  "fan_already_on" : localization.commands.storm.fan_already_on,
  "fan_already_on_field" : localization.commands.storm.fan_already_on_field
}

module.exports.execute = (client, message) => {
  if(!config.storm_role.some(role => message.member.roles.cache.has(role))) return message.reply(localization.storm.non_member)
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  if(client.helpers.arduinoBridge.getFanState() == 0){
    setTimeout(fanTimeOut, config.storm_fan_duration * 1000, client);
    client.helpers.arduinoBridge.turnOnTheFan();
    if(client.helpers.arduinoBridge.getMoisture() < config.moisture_min){
      embed.addField(this.info.field, this.info.moisture_low + " " + config.emoji_sad + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
    }else if(client.helpers.arduinoBridge.getMoisture() > config.moisture_max){
      embed.addField(this.info.field, this.info.moisture_high + " " + config.emoji_happy + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
    }else{
      embed.addField(this.info.field, config.emoji_happy)
    }
  }else{
    embed.addField(this.info.fan_already_on, this.info.fan_already_on_field)
  }

  message.channel.send({ embeds: [embed] });
}

function fanTimeOut(client) {
  client.helpers.arduinoBridge.turnOffTheFan();
}



