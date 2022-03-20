const {MessageEmbed} = require("discord.js");

module.exports.info = {
  "title" : "Bitkiyi suladın! 🌱",
  "name" : "water",
  "desc" : "Bitki sulamak için",
  "color" : "BLUE",
  "field" : "Toprak Nemi "
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
