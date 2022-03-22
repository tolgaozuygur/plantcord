const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);

module.exports.info = {
  "title" : localization.commands.uptime.title,
  "name" : localization.commands.uptime.name,
  "desc" : localization.commands.uptime.desc,
  "color" : localization.commands.uptime.color,
  "field" : localization.commands.uptime.field,
}

module.exports.execute = (client, message) => {
  // client.uptime is in millseconds
  let days = Math.floor(client.uptime / 86400000);
  let hours = Math.floor(client.uptime / 3600000) % 24;
  let minutes = Math.floor(client.uptime / 60000) % 60;
  let seconds = Math.floor(client.uptime / 1000) % 60;

  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .addField(this.info.field,`${days}d ${hours}h ${minutes}m ${seconds}s`)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  message.channel.send({ embeds: [embed] });
}
