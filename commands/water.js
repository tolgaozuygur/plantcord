const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);

module.exports.info = {
  "title" : localization.commands.water.title.replace("<plant_name>", config.plant_name),
  "name" : localization.commands.water.name,
  "desc" : localization.commands.water.desc.replace("<plant_name>", config.plant_name),
  "color" : localization.commands.water.color,
  "field" : localization.commands.water.field
}

module.exports.execute = (client, message) => {
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();
  if(this.info.field){
    embed.addField(this.info.field, `${client.helpers.arduinoBridge.getMoisture()}%`)
  }

  message.channel.send({ embeds: [embed] });
}
