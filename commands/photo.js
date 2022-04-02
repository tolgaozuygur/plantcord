const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);
const fs = require('fs');

module.exports.info = {
  "title" : localization.commands.photo.title.replace("<plant_name>", config.plant_name),
  "name" :  localization.commands.photo.name,
  "desc" :  localization.commands.photo.desc.replace("<plant_name>", config.plant_name),
  "color" :  localization.commands.photo.color
}

module.exports.execute = (client, message) => {
  fs.stat(config.photo_path, (err, stats) => {
    if (err) {
      //no photo found
      console.log(`DEBUG: No photo found. Is the webcam connected?`);
      stats.mtime = 0;
    }
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp(stats.mtime);
  });

  //check the photo mtime
  fs.stat(config.photo_path, (err, stats) => {
    let currentPhotoMTime;
    if (err) {
      //no photo found
      console.log(`DEBUG: No photo found. Is the webcam connected?`);
    } else {
      //photo found
      currentPhotoMTime = stats.mtime.toISOString();
      console.log(`DEBUG: File Data Last Modified: ${stats.mtime}`);
      //send embed message
      let filesToBeUploaded = []
      if (!client.lastPhoto || client.lastPhoto.mtime !== currentPhotoMTime) {
        // Last photo expired we need a new one.
        console.log(`DEBUG: Last photo expired, uploading new one.`);
        embed.setImage(`attachment://${config.photo_path.split('/').reverse()[0]}`);
        filesToBeUploaded = [config.photo_path]
      } else {
        console.log(`DEBUG: Using photo from cache.`);
        embed.setImage(client.lastPhoto.url)
      }
      message.channel.send({embeds: [embed], files: filesToBeUploaded})
        .then(message => {
          if (message.embeds[0].image && filesToBeUploaded.length > 0) {
            // Updating last photo data.
            console.log(`DEBUG: Updating lastPhoto`);
            const picName = message.embeds[0].image.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
            client.lastPhoto = {
              'name': picName[0],
              'url': message.embeds[0].image.url,
              'mtime': currentPhotoMTime
            }
          }
        });
    }
  });
}
