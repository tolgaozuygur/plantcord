const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);
const fs = require('fs');
let filesToBeUploaded = []
module.exports.info = {
  "title" : localization.commands.graph.title,
  "name" : localization.commands.graph.name,
  "color" : localization.commands.graph.color,
}

module.exports.execute = async (client, message) => {
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
  
  embed.setImage(`attachment://${config.graph_path.split('/').reverse()[0]}`);
  filesToBeUploaded = [config.graph_path]
  embed.setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  message.channel.send({ embeds: [embed], files: filesToBeUploaded });
}
