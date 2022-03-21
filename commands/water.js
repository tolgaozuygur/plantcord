const {MessageEmbed} = require("discord.js");
const localization = require('../localization.json');

module.exports.info = {
  "title" : localization.commands.water.title,
  "name" : localization.commands.water.name,
  "desc" : localization.commands.water.desc,
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
    embed.addField(this.info.field, `${client.helpers.getMoisture()}%`)
  }

  message.channel.send({ embeds: [embed] });
}
