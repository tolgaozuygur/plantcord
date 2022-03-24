const { MessageEmbed } = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/' + config.localization_file);

module.exports.info = {
  "title": localization.commands.photo.title.replace("<plant_name>", config.plant_name),
  "name": localization.commands.photo.name,
  "desc": localization.commands.photo.desc.replace("<plant_name>", config.plant_name),
  "color": localization.commands.photo.color,
  "photo_path": localization.commands.photo.photo_path,
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

  // TODO: Change picture with real one.
  let filesToBeUploaded = []
  if (!client.lastPhoto || client.lastPhoto.name !== localization.commands.photo.photo_path) {
    // Last photo expired we need a new one.
    embed.setImage(`attachment://${this.info.photo_path}`);
    filesToBeUploaded = [this.info.photo_path]
  } else {
    embed.setImage(client.lastPhoto.url)
  }

  message.channel.send({ embeds: [embed], files: filesToBeUploaded })
    .then(message => {
      if (message.embeds[0].image && filesToBeUploaded.length > 0) {
        // Updating last photo data.
        const picName = message.embeds[0].image.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
        client.lastPhoto = {
          'name': picName[0],
          'url': message.embeds[0].image.url
        }
      }
    });
}
