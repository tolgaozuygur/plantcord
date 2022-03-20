const {MessageEmbed} = require("discord.js");

module.exports.info = {
  "title" : "Bitkinin şuanki fotoğrafı 📷",
  "name" : "photo",
  "desc" : "Bitkinin anlık fotoğrafı için",
  "color" : "GREY",
  "photo_path" : "plant_photo.webp"
}

module.exports.execute = (client, message) => {
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setImage('https://raw.githubusercontent.com/tolgaozuygur/plantcord/main/plantcord.png')
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  message.channel.send({ embeds: [embed] });
}
