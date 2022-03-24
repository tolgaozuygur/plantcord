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
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();
    
  //check the photo mtime
  fs.stat(config.photo_path, (err, stats) => {
    if(err) {
        //no photo found
        console.log(`No photo found. Is the webcam connected?`);
    }else{
      //photo found
      currentPhotoMTime = stats.mtime;
      console.log(`File Data Last Modified: ${stats.mtime}`);
      //send embed message
      let filesToBeUploaded = []
      console.log("last photo? " + client.lastPhoto);
      if (!client.lastPhoto || client.lastPhoto.mtime !== currentPhotoMTime){
        // Last photo expired we need a new one.
        console.log(`Last photo expired, uploading new one.`);
        embed.setImage(`attachment://${config.photo_path}`);
        filesToBeUploaded = [config.photo_path]
      } else {
        console.log(`Using photo from cash`);
        embed.setImage(client.lastPhoto.url)
      }

      message.channel.send({ embeds: [embed],files:  filesToBeUploaded})
        .then(message => {
          console.log(`debug ` + message.embeds[0] + " / " + filesToBeUploaded.length); 
          if (message.embeds[0].image && filesToBeUploaded.length > 0){
            // Updating last photo data.      
            console.log(`Updating lastPhoto`);  
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
