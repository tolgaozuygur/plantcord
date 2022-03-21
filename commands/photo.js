const {MessageEmbed} = require("discord.js");
const localization = require('../localization.json');

module.exports.info = {
  "title" : localization.commands.photo.title,
  "name" :  localization.commands.photo.name,
  "desc" :  localization.commands.photo.desc,
  "color" :  localization.commands.photo.color,
  "photo_path" :  localization.commands.photo.photo_path,
}

module.exports.execute = (client, message) => {
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setImage(`attachment://${this.info.photo_path}`)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  message.channel.send({ embeds: [embed],files: [this.info.photo_path] });
}
